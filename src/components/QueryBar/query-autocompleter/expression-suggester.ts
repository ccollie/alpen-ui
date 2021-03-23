import {
  isClassType,
  isDictType,
  isUnionType,
  TypedMethod,
  TypedObject,
  TypingResult,
} from './types';
import _ from 'lodash';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import get from 'lodash-es/get';
import map from 'lodash-es/map';
import mapValues from 'lodash-es/mapValues';
import take from 'lodash-es/take';
import dropWhile from 'lodash-es/dropWhile';
import merge from 'lodash-es/merge';
import uniqWith from 'lodash-es/uniqWith';
import flatMap from 'lodash-es/flatMap';

import Position = AceAjax.Position;

// before indexer['last indexer key
const INDEXER_REGEX = /^(.*)\['([^\[]*)$/;

interface NormalizedInput {
  input: string;
  caretPosition: number;
}

function first(items: unknown[]): unknown {
  const [head, ...tail] = items;
  return head;
}

export default class ExpressionSuggester {
  private readonly _typesInformation: TypedObject[];
  private readonly _variables: Record<string, TypingResult>;

  constructor(
    typesInformation: TypedObject[],
    variables: Record<string, TypingResult>,
  ) {
    this._typesInformation = typesInformation;
    this._variables = variables;
  }

  suggestionsFor(inputValue: string, caretPosition2d: Position) {
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
    const focusedClazz = this._findRootClazz(
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

  private _getSuggestions(
    value: string,
    focusedClazz: TypedObject,
    variables: Record<string, TypingResult>,
  ): Promise<TypingResult[]> {
    const variableNames = Object.keys(variables);
    const variableAlreadySelected = variableNames.some((variable) => {
      return value.includes(`${variable}.`) || value.includes(`${variable}['`);
    });
    const toCompare = value.toLowerCase();
    const variableNotSelected = variableNames.some((variable) => {
      return variable.toLowerCase().indexOf(toCompare) === 0; // startsWith
    });
    if (variableAlreadySelected && focusedClazz) {
      const currentType = this._getTypeInfo(focusedClazz);
      const inputValue = this._justTypedProperty(value);
      if (!isDictType(currentType)) {
        const allowedMethodList = this._getAllowedMethods(currentType);
        const result =
          inputValue?.length === 0
            ? allowedMethodList
            : this._filterSuggestionsForInput(allowedMethodList, inputValue);
        return new Promise((resolve) => resolve(result));
      } else {
        return this._getSuggestionsForDict(currentType.dict, inputValue);
      }
    } else if (variableNotSelected && !isEmpty(value)) {
      const allVariablesWithClazzRefs = map(variables, (val, key) => {
        return { methodName: key, refClazz: val };
      });
      const result = this._filterSuggestionsForInput(
        allVariablesWithClazzRefs,
        value,
      );
      return new Promise((resolve) => resolve(result));
    } else {
      return new Promise((resolve) => resolve([]));
    }
  }

  private _getAllowedMethods(currentType: TypingResult) {
    if (isUnionType(currentType)) {
      const allMethods = flatMap(currentType.union, (subType) =>
        this._getAllowedMethodsForClass(subType),
      );
      // TODO: compute union of extracted methods types
      return uniqWith(allMethods, (typeA, typeB) => isEqual(typeA, typeB));
    } else {
      return this._getAllowedMethodsForClass(currentType);
    }
  }

  private _getAllowedMethodsForClass(currentType: TypedObject) {
    return map(currentType.methods, (val, key) => {
      return { ...val, methodName: key };
    });
  }

  private _filterSuggestionsForInput(
    variables: Record<string, TypingResult>,
    inputValue: string,
  ) {
    const value = inputValue.toLowerCase();
    return _.filter(variables, (variable) => {
      const lower = variable.methodName.toLowerCase();
      return lower.includes(value);
    });
  }

  private _findRootClazz(
    properties: string[],
    variables: Record<string, TypingResult>,
  ) {
    const variableName = properties[0];
    if (variables[variableName]) {
      let variableClazz = get(variables, variableName);
      const [ignore, ...tail] = properties;
      for (let i = 1; i < properties.length; i++) {}
      return tail.reduce((currentParentClazz, prop) => {
        const parentType = this._getTypeInfo(currentParentClazz);
        return this._extractMethod(parentType, prop);
      }, variableClazz);
    } else {
      return null;
    }
  }

  private _extractMethod(type: TypingResult, prop: string) {
    if (isUnionType(type)) {
      let foundedTypes = type.union
        .map((clazz) => this._extractMethodFromClass(clazz, prop))
        .filter((i) => i != null);
      // TODO: compute union of extracted methods types
      return first(foundedTypes) || { refClazzName: '' };
    } else {
      return this._extractMethodFromClass(type, prop) || { refClazzName: '' };
    }
  }

  private _extractMethodFromClass(clazz: TypingResult, prop: string) {
    const methods = isClassType(clazz) ? clazz.methods : {};
    return get(methods, `${prop}.refClazz`) as TypingResult;
  }

  private _getTypeInfo(type: TypingResult) {
    if (isUnionType(type)) {
      const unionOfTypeInfos = type.union.map((clazz) =>
        this._getTypeInfoFromClass(clazz),
      );
      return {
        ...type,
        union: unionOfTypeInfos,
      };
    } else {
      return this._getTypeInfoFromClass(type);
    }
  }

  private _getTypeInfoFromClass(clazz: TypingResult) {
    const methodsFromInfo = this._getMethodsFromGlobalTypeInfo(clazz);
    const methodsFromFields = mapValues(clazz.fields, (field) => ({
      refClazzName: field,
    }));
    const allMethods = merge(methodsFromFields, methodsFromInfo);

    return {
      ...clazz,
      methods: allMethods,
    };
  }

  private _getMethodsFromGlobalTypeInfo(
    clazz: TypingResult | string,
  ): Record<string, TypedMethod> {
    let clazzInfo;
    if (isClassType(clazz)) {
      clazzInfo = clazz;
    } else {
      let name: string;
      if (typeof clazz === 'string') {
        name = clazz;
      } else {
        name = (clazz as any).refClazzName;
      }
      clazzInfo = this._typesInformation.find((x) => x.refClazzName === name);
    }
    return clazzInfo?.methods ?? {};
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
  _removeFinishedSelectionFromExpressionPart = (currentExpression: string) => {
    return currentExpression.replace(/\[[^\]]*]/g, '');
  };

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
      : `#${_.last((withSafeNavigationIgnored ?? '').split('#'))}`;
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
      const focused = this._findRootClazz(properties, this._variables);
      return focused?.params?.[0] ?? null;
    } else {
      return null;
    }
  }

  _findCurrentProjectionOrSelection(normalized: NormalizedInput) {
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

  _getSuggestionsForDict = (typ, typedProperty) => {
    return this._fetchDictLabelSuggestions(typ.id, typedProperty).then(
      (result) =>
        map(result.data, (entry) => {
          return {
            methodName: entry.label,
            refClazz: typ.valueType,
          };
        }),
    );
  };

  _fetchDictLabelSuggestions = (dictId: string, labelPattern: string) => {
    return this._httpService.fetchDictLabelSuggestions(
      this._processingType,
      dictId,
      labelPattern,
    );
  };
}
