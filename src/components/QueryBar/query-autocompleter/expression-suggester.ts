import dropWhile from 'lodash-es/dropWhile';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import merge from 'lodash-es/merge';
import take from 'lodash-es/take';
import uniqWith from 'lodash-es/uniqWith';
import initial from 'lodash-es/initial';

import {
  Functions,
  isClassType,
  isMethodType,
  isUnionType,
  TypedMethod,
  TypedObject,
  TypedSuggestion,
  TypeRef,
  TypesInformation,
  TypingResult,
  UnionTyping,
  VariableDict,
} from './types';
import Position = AceAjax.Position;

const typeCache = new Map<string, TypedObject>();
const typeInfoCache = new Map<
  TypingResult | TypeRef,
  TypingResult | undefined
>();
const methodsCache = new Map<TypingResult, TypedMethod[] | undefined>();

// before indexer[last indexer key
const INDEXER_REGEX = /^(.*)\[([^\[]*)$/;

interface NormalizedInput {
  input: string;
  caretPosition: number;
}

const EmptyMethod = {
  type: 'method',
  returnType: '',
} as TypedMethod;

const EmptyClass: TypedObject = {
  type: 'class',
  refClazzName: '',
  fields: {},
  methods: {},
};

export default class ExpressionSuggester {
  private readonly _variables: VariableDict;
  private allVarsWithClassRefs: TypedMethod[] | undefined = undefined;

  constructor(variables: VariableDict = {}) {
    if (typeCache.size === 0) {
      TypesInformation.forEach((info) => {
        typeCache.set(info.refClazzName, info);
      });
      this.fixupFunctions();
    }
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
    focusedClazz: TypedObject | null,
    variables: VariableDict,
  ): Promise<TypedSuggestion[]> {
    const variableNames = Object.keys(variables);
    const variableAlreadySelected = variableNames.some((variable) => {
      return value.includes(`${variable}.`) || value.includes(`${variable}[`);
    });
    const toCompare = value.toLowerCase();
    const variableNotSelected = variableNames.some((variable) => {
      return variable.toLowerCase().indexOf(toCompare) === 0; // startsWith
    });
    if (variableAlreadySelected && focusedClazz) {
      const currentType = this.getTypeInfo(focusedClazz);
      const inputValue = this._justTypedProperty(value) ?? '';
      const allowedMethodList = this.getAllowedMethods(currentType);
      return this._filterSuggestionsForInput(allowedMethodList, inputValue);
    } else if (variableNotSelected && !!value?.length) {
      this.allVarsWithClassRefs =
        this.allVarsWithClassRefs ||
        variableNames.map((key) => {
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
      return this._filterSuggestionsForInput(this.allVarsWithClassRefs, value);
    } else {
      return this.suggestFunctions(value);
    }
  }

  private getAllowedMethods(currentType: TypingResult) {
    let result: TypedMethod[] | undefined = methodsCache.get(currentType);

    if (!result) {
      if (isUnionType(currentType)) {
        const allMethods = flatMap(this.resolveUnion(currentType), (clazz) => {
          return this.getAllowedMethodsForClass(clazz);
        });
        // TODO: compute union of extracted methods types
        result = uniqWith(allMethods, (typeA, typeB) => isEqual(typeA, typeB));
      } else if (isClassType(currentType)) {
        result = this.getAllowedMethodsForClass(currentType);
      }
      result = result || [];
      methodsCache.set(currentType, result);
    }
    return result;
  }

  private getAllowedMethodsForClass(currentType: TypedObject): TypedMethod[] {
    const keys = Object.keys(currentType.methods);
    return keys.map((key) => {
      const val = currentType.methods[key];
      val.methodName = key;
      val.refClazz =
        val.refClazz || this.getClassFromGlobalTypeInfo(val.returnType);
      return val;
    });
  }

  private _filterSuggestionsForInput(
    variables: TypedMethod[],
    inputValue: string,
  ) {
    if (!inputValue) return variables.map(convertSuggestion);
    const value = inputValue.toLowerCase();
    const result: TypedSuggestion[] = [];
    variables.forEach((variable) => {
      const lower = (variable.methodName ?? '').toLowerCase();
      if (lower.includes(value)) result.push(convertSuggestion(variable));
    });
    return result;
  }

  private suggestFunctions(name: string) {
    const lower = (name ?? '').toLowerCase();
    let result: TypedSuggestion[] = [];
    for (let functionsKey in Functions) {
      if (functionsKey.toLowerCase().includes(lower)) {
        const suggestion = convertSuggestion(Functions[functionsKey]);
        if (suggestion) {
          suggestion.name = functionsKey;
        }
        result.push(suggestion);
      }
    }
    return result;
  }

  private fixupFunctions() {
    for (let functionsKey in Functions) {
      const fn = Functions[functionsKey];
      fn.methodName = functionsKey;
      fn.refClazz = this.getClassFromGlobalTypeInfo(fn.returnType);
    }
  }

  private findRootClazz(properties: string[], variables: VariableDict) {
    const variableName = properties[0];
    if (variables[variableName]) {
      let clazz: TypedObject | undefined;
      let parentClazz = this.getClassFromGlobalTypeInfo(
        variables[variableName],
      );
      for (let i = 1; !!parentClazz && i < properties.length; i++) {
        const method = this.extractMethod(parentClazz, properties[i]);
        clazz = method && this.getClassFromGlobalTypeInfo(method.returnType);
        parentClazz = clazz;
      }
      return parentClazz || null;
    } else {
      return null;
    }
  }

  private extractMethod(type: TypingResult, prop: string) {
    if (isUnionType(type)) {
      const foundedTypes = this.resolveUnion(type)
        .map((clazz) => this._extractMethodFromClass(clazz, prop))
        .filter((i) => i != null);
      // TODO: compute union of extracted methods types
      return first(foundedTypes) || EmptyMethod;
    } else {
      return this._extractMethodFromClass(type, prop) || EmptyMethod;
    }
  }

  private _extractMethodFromClass(clazz: TypingResult, prop: string) {
    if (!isClassType(clazz)) {
      const found = this.getTypeInfo(clazz);
      if (!found) return null;
      clazz = found;
    }
    const methods = clazz && isClassType(clazz) ? clazz.methods : {};
    return get(methods, prop) as TypedMethod;
  }

  private getTypeInfo(type: TypingResult | TypeRef): TypingResult {
    let result: TypingResult | undefined = typeInfoCache.get(type);
    if (!result) {
      if (isUnionType(type)) {
        this.resolveUnion(type);
        result = type;
      } else {
        result = this.getTypeInfoFromClass(type);
      }
      typeInfoCache.set(type, result);
    }
    return result;
  }

  private resolveUnion(type: UnionTyping) {
    if (!Array.isArray(type.resolved)) {
      type.resolved = type.union.map((clazz) =>
        this.getTypeInfoFromClass(clazz),
      );
    }
    return type.resolved || [];
  }

  private getTypeInfoFromClass(clazz: TypingResult | TypeRef): TypedObject {
    const type = this.getClassFromGlobalTypeInfo(clazz);
    let methods: Record<string, TypedMethod>;
    if (isClassType(type)) {
      const names = Object.keys(type.fields);
      const fromFields: Record<string, TypedMethod> = Object.create(null);
      names.forEach((name) => {
        fromFields[name] = {
          ...type.fields[name],
          returnType: type.refClazzName,
          refClazz: this.getClassFromGlobalTypeInfo(type.refClazzName),
          params: [],
        };
      });
      methods = {
        ...fromFields,
        ...(type.methods || {}),
      };
    } else {
      return EmptyClass;
    }

    return {
      ...type,
      type: 'class',
      fields: {},
      methods,
    };
  }

  private _getMethodsFromGlobalTypeInfo(
    clazz: TypingResult | TypeRef | string,
  ): Record<string, TypedMethod> {
    let clazzInfo = this.getClassFromGlobalTypeInfo(clazz);
    return clazzInfo?.methods ?? {};
  }

  private getClassFromGlobalTypeInfo(
    clazz: TypingResult | TypeRef | string,
  ): TypedObject | undefined {
    let clazzInfo = undefined;
    if (isClassType(clazz)) {
      clazzInfo = clazz;
    } else if (isMethodType(clazz)) {
      clazzInfo = typeCache.get(clazz.returnType);
    } else {
      let name: string;
      if (typeof clazz === 'string') {
        name = clazz;
      } else {
        name = (clazz as any).refClazzName;
      }
      clazzInfo = typeCache.get(name);
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
    return !value || value.length == 0
      ? ''
      : `${last((withSafeNavigationIgnored ?? '').split('#'))}`; ///???
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
    return initial(items);
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
    name: variable.methodName || '',
    //  display: variable.display,
    description: variable.description,
    refClazz: variable.refClazz,
    params: [],
  };
  if (!!variable.params) {
    suggestion.params = variable.params?.map((x) => {
      return {
        name: x.name,
        refClazz: x.refClazz,
      };
    });
  }
  return suggestion;
}

function first<T>(items: T[]): T | undefined {
  return items.length ? items[0] : undefined;
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
