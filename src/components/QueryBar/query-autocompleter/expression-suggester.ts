import dropWhile from 'lodash-es/dropWhile';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import mapValues from 'lodash-es/mapValues';
import merge from 'lodash-es/merge';
import take from 'lodash-es/take';
import uniqWith from 'lodash-es/uniqWith';
import {
  isClassType,
  isMethodType,
  isUnionType,
  TypedMethod,
  TypedObject,
  TypedSuggestion,
  TypingResult,
  UnionTyping,
} from './types';
import Position = AceAjax.Position;

// before indexer['last indexer key
const INDEXER_REGEX = /^(.*)\['([^\[]*)$/;

interface NormalizedInput {
  input: string;
  caretPosition: number;
}

const EmptyMethod = {
  type: 'method',
  returnType: '',
} as TypedMethod;

export default class ExpressionSuggester {
  private readonly typeCache = new Map<string, TypedObject>();
  private readonly typeInfoCache = new Map<
    TypingResult,
    TypingResult | undefined
  >();
  private readonly methodsCache = new Map<
    TypingResult,
    TypedMethod[] | undefined
  >();
  private readonly _variables: Record<string, TypingResult>;

  constructor(
    typesInformation: TypedObject[],
    variables: Record<string, TypingResult> = {},
  ) {
    typesInformation.forEach((info) => {
      this.typeCache.set(info.refClazzName, info);
    });
    this._variables = variables;
  }

  async suggestionsFor(inputValue: string, caretPosition2d: Position) {
    const normalized = this._normalizeMultilineInputToSingleLine(
      inputValue,
      caretPosition2d,
    );
    const lastExpressionPart = this._focusedLastExpressionPartWithoutMethodParens(
      normalized.input,
      normalized.caretPosition,
    );
    const properties = this._alreadyTypedProperties(lastExpressionPart);
    const variablesIncludingSelectionOrProjection = this._getAllVariables(
      normalized,
    );
    const focusedClazz = this.findRootClazz(
      properties,
      variablesIncludingSelectionOrProjection,
    );
    if (!focusedClazz) return [];
    return this._getSuggestions(
      lastExpressionPart,
      focusedClazz,
      variablesIncludingSelectionOrProjection,
    );
  }

  private _normalizeMultilineInputToSingleLine(
    inputValue: string,
    caretPosition2d: Position,
  ): NormalizedInput {
    const rows = inputValue.split('\n');
    const trimmedRows = rows.map((row) => {
      const trimmedAtStartRow = dropWhile(row, (c) => c === ' ').join('');
      return {
        trimmedAtStartRow: trimmedAtStartRow,
        trimmedCount: row.length - trimmedAtStartRow.length,
      };
    });
    const beforeCaretInputLength = take(trimmedRows, caretPosition2d.row)
      .map((row) => row.trimmedAtStartRow.length)
      .reduce((res, length) => res + length, 0);

    const caretPosition =
      caretPosition2d.column -
      trimmedRows[caretPosition2d.row].trimmedCount +
      beforeCaretInputLength;
    const normalizedInput = trimmedRows
      .map((row) => row.trimmedAtStartRow)
      .join('');
    return {
      input: normalizedInput,
      caretPosition: caretPosition,
    };
  }

  private async _getSuggestions(
    value: string,
    focusedClazz: TypedObject,
    variables: Record<string, TypingResult>,
  ): Promise<TypedSuggestion[]> {
    const variableNames = Object.keys(variables);
    const variableAlreadySelected = variableNames.some((variable) => {
      return value.includes(`${variable}.`) || value.includes(`${variable}['`);
    });
    const toCompare = value.toLowerCase();
    const variableNotSelected = variableNames.some((variable) => {
      return variable.toLowerCase().indexOf(toCompare) === 0; // startsWith
    });
    if (variableAlreadySelected && focusedClazz) {
      const currentType = this.getTypeInfo(focusedClazz);
      const inputValue = this._justTypedProperty(value) ?? '';
      const allowedMethodList = this.getAllowedMethods(currentType);
      return inputValue?.length === 0
        ? allowedMethodList.map(convertSuggestion)
        : this._filterSuggestionsForInput(allowedMethodList, inputValue);
    } else if (variableNotSelected && !isEmpty(value)) {
      const allVariablesWithClazzRefs = variableNames.map((key) => {
        const val = variables[key];
        const refClazz = this.getTypeInfo(val);
        return {
          type: 'method',
          methodName: key,
          returnType: key,
          refClazz,
          params: [],
        } as TypedMethod;
      });
      return this._filterSuggestionsForInput(allVariablesWithClazzRefs, value);
    } else {
      return [];
    }
  }

  private getAllowedMethods(currentType: TypingResult) {
    let result: TypedMethod[] | undefined = this.methodsCache.get(currentType);

    if (!result) {
      if (isUnionType(currentType)) {
        const allMethods = flatMap(currentType.union, (subType) =>
          isClassType(subType) ? this.getAllowedMethodsForClass(subType) : [],
        );
        // TODO: compute union of extracted methods types
        result = uniqWith(allMethods, (typeA, typeB) => isEqual(typeA, typeB));
      } else if (isClassType(currentType)) {
        result = this.getAllowedMethodsForClass(currentType);
      }
      result = result || [];
      this.methodsCache.set(currentType, result);
    }
    return result;
  }

  private getAllowedMethodsForClass(currentType: TypedObject): TypedMethod[] {
    const keys = Object.keys(currentType.methods);
    return keys.map((key) => {
      const val = currentType.methods[key];
      if (!val.refClazz) {
        val.refClazz = this.getClassFromGlobalTypeInfo(val.returnType);
      }
      return { ...val, methodName: key };
    });
  }

  private _filterSuggestionsForInput(
    variables: TypedMethod[],
    inputValue: string,
  ) {
    const value = inputValue.toLowerCase();
    const result: TypedSuggestion[] = [];
    variables.forEach((variable) => {
      const lower = variable.methodName.toLowerCase();
      if (lower.includes(value)) result.push(convertSuggestion(variable));
    });
    return result;
  }

  private findRootClazz(
    properties: string[],
    variables: Record<string, TypingResult>,
  ) {
    const variableName = properties[0];
    if (variables[variableName]) {
      let clazz: TypedObject | undefined;
      let method: TypedMethod;
      let parentClazz = get(variables, variableName);
      if (isClassType(parentClazz)) clazz = parentClazz;

      for (let i = 1; i < properties.length && !!parentClazz; i++) {
        const prop = properties[i];
        const parentType = this.getTypeInfo(parentClazz);
        method = this.extractMethod(parentType, prop);
        clazz = this.getClassFromGlobalTypeInfo(method.returnType);
        if (!clazz) return null;
        parentClazz = clazz;
      }
      return clazz || null;
    } else {
      return null;
    }
  }

  private extractMethod(type: TypingResult, prop: string) {
    if (isUnionType(type)) {
      const foundedTypes = type.union
        .map((clazz) => this._extractMethodFromClass(clazz, prop))
        .filter((i) => i != null);
      // TODO: compute union of extracted methods types
      return (first(foundedTypes) as TypedMethod) || EmptyMethod;
    } else {
      return this._extractMethodFromClass(type, prop) || EmptyMethod;
    }
  }

  private _extractMethodFromClass(clazz: TypingResult, prop: string) {
    const methods = isClassType(clazz) ? clazz.methods : {};
    return get(methods, `${prop}.refClazzName`) as TypedMethod;
  }

  private getTypeInfo(type: TypingResult): TypingResult {
    let result: TypingResult | undefined = this.typeInfoCache.get(type);
    if (!result) {
      if (isUnionType(type)) {
        const unionOfTypeInfos = type.union.map((clazz) =>
          this.getTypeInfoFromClass(clazz),
        );
        result = {
          ...type,
          type: 'union',
          union: unionOfTypeInfos,
        } as UnionTyping;
      } else {
        result = this.getTypeInfoFromClass(type);
      }
      this.typeInfoCache.set(type, result);
    }
    return result;
  }

  private getTypeInfoFromClass(clazz: TypingResult): TypedObject {
    const methodsFromInfo = this._getMethodsFromGlobalTypeInfo(clazz);
    let methods = methodsFromInfo;
    if (isClassType(clazz)) {
      const names = Object.keys(clazz.fields);
      const fromFields = Object.create(null);
      const methodsFromFields = mapValues(clazz.fields, (field) => ({
        refClazzName: field,
      }));
      methods = merge(methodsFromFields, methodsFromInfo);
    }

    return ({
      refClazzName: '',
      params: [],
      ...clazz,
      type: 'class',
      fields: [],
      methods,
    } as unknown) as TypedObject;
  }

  private _getMethodsFromGlobalTypeInfo(
    clazz: TypingResult | string,
  ): Record<string, TypedMethod> {
    let clazzInfo = this.getClassFromGlobalTypeInfo(clazz);
    return clazzInfo?.methods ?? {};
  }

  private getClassFromGlobalTypeInfo(
    clazz: TypingResult | string,
  ): TypedObject | undefined {
    let clazzInfo = undefined;
    if (isClassType(clazz)) {
      clazzInfo = clazz;
    } else if (isMethodType(clazz)) {
      clazzInfo = this.typeCache.get(clazz.returnType);
    } else {
      let name: string;
      if (typeof clazz === 'string') {
        name = clazz;
      } else {
        name = (clazz as any).refClazzName;
      }
      clazzInfo = this.typeCache.get(name);
    }
    return clazzInfo;
  }

  private _focusedLastExpressionPartWithoutMethodParens(
    expression: string,
    caretPosition: number,
  ) {
    return this._lastExpressionPartWithoutMethodParens(
      this._currentlyFocusedExpressionPart(expression, caretPosition),
    );
  }

  private _currentlyFocusedExpressionPart(
    value: string,
    caretPosition: number,
  ) {
    return this._removeFinishedSelectionFromExpressionPart(
      value.slice(0, caretPosition),
    );
  }

  //TODO: this does not handle map indices properly... e.g. #input.value[#this[""] > 4]
  private _removeFinishedSelectionFromExpressionPart(
    currentExpression: string,
  ) {
    return currentExpression.replace(/\[[^\]]*]/g, '');
  }

  private _lastExpressionPartWithoutMethodParens(value: string) {
    //we have to handle cases like: util.now(other.quaxString.toUpperCase().__)
    const withoutNestedParenthesis = value.substring(
      this._lastNonClosedParenthesisIndex(value) + 1,
      value.length,
    );
    const valueCleaned = withoutNestedParenthesis.replace(/\(.*\)/, '');
    //handling ?. operator
    const withSafeNavigationIgnored = valueCleaned.replace(/\?\./g, '.');
    return isEmpty(value)
      ? ''
      : `#${last((withSafeNavigationIgnored ?? '').split('#'))}`;
  }

  private _lastNonClosedParenthesisIndex(value: string): number {
    let nestingCounter = 0;
    for (let i = value.length - 1; i >= 0; i--) {
      if (value[i] === '(') nestingCounter -= 1;
      else if (value[i] === ')') nestingCounter += 1;

      if (nestingCounter < 0) return i;
    }
    return -1;
  }

  private _justTypedProperty(value: string) {
    const items = this._dotSeparatedToProperties(value);
    return items.length ? items[items.length - 1] : null;
  }

  private _alreadyTypedProperties(value: string) {
    const items = this._dotSeparatedToProperties(value);
    return items.splice(0, -1);
  }

  private _dotSeparatedToProperties(value: string): string[] {
    // TODO: Implement full SpEL support for accessing by indexer the same way
    //  as by properties - not just for last indexer
    const indexerMatch = value.match(INDEXER_REGEX);
    if (indexerMatch) {
      return this._dotSeparatedToPropertiesIncludingLastIndexerKey(
        indexerMatch,
      );
    } else {
      return (value ?? '').split('.');
    }
  }

  private _dotSeparatedToPropertiesIncludingLastIndexerKey(
    indexerMatch: RegExpMatchArray,
  ) {
    const beforeIndexer = indexerMatch[1];
    const indexerKey = indexerMatch[2];
    const splitProperties = (beforeIndexer ?? '').split('.');
    return [...splitProperties, indexerKey];
  }

  private _getAllVariables(normalized: NormalizedInput) {
    const thisClazz = this._findProjectionOrSelectionRootClazz(normalized);
    const data = thisClazz ? { this: thisClazz } : {};
    return merge(data, this._variables);
  }

  private _findProjectionOrSelectionRootClazz(normalized: NormalizedInput) {
    const currentProjectionOrSelection = this._findCurrentProjectionOrSelection(
      normalized,
    );
    if (currentProjectionOrSelection) {
      const properties = this._alreadyTypedProperties(
        currentProjectionOrSelection,
      );
      //TODO: currently we don't assume nested selections/projections
      const focused = this.findRootClazz(properties, this._variables);
      return focused?.params?.[0] ?? null;
    } else {
      return null;
    }
  }

  private _findCurrentProjectionOrSelection(normalized: NormalizedInput) {
    const { input, caretPosition } = normalized;
    const currentPart = this._currentlyFocusedExpressionPart(
      input,
      caretPosition,
    );
    //TODO: detect if it's *really* selection/projection (can be in quoted string, or method index??)
    const lastOpening = currentPart.lastIndexOf('[');
    const isInMiddleOfProjectionSelection =
      lastOpening > currentPart.indexOf(']');
    if (isInMiddleOfProjectionSelection) {
      const currentSelectionProjectionPart = currentPart.slice(0, lastOpening);
      //TODO: this won't handle former projections - but we don't support them now anyway...
      return this._lastExpressionPartWithoutMethodParens(
        currentSelectionProjectionPart,
      );
    } else {
      return null;
    }
  }
}

function convertSuggestion(variable: TypedMethod): TypedSuggestion {
  const suggestion: TypedSuggestion = {
    name: variable.methodName,
    display: variable.display,
    description: variable.description,
    refClazz: variable.refClazz,
    params: [],
  };
  if (isMethodType(variable.refClazz) && !!variable.params) {
    suggestion.params = variable.params?.map((x) => {
      return {
        name: x.name,
        refClazz: x.refClazz,
      };
    });
  }
  return suggestion;
}

function first(items: unknown[]): unknown {
  const [head, ...tail] = items;
  return head;
}

function last<T>(items: T[]): T {
  return items[items.length - 1];
}

function flatMap<T, U>(array: T[], mapFunc: (x: T) => U[]): U[] {
  return array.reduce(
    (cumulus: U[], next: T) => [...mapFunc(next), ...cumulus],
    <U[]>[],
  );
}
