import Ajv, { ErrorObject } from 'ajv';
import betterAjvErrors, { IOutputError } from '@stoplight/better-ajv-errors';
import pointer from 'jsonpointer';

const ajv = new Ajv({
  $data: true,
  allErrors: true,
});

// Make a little helper for validating
export function validate(
  schema: Record<string, any>,
  data: any,
): {
  valid: any;
  errors: IOutputError[];
} {
  const valid = ajv.validate(schema, data);
  if (!valid) {
    const output = betterAjvErrors(schema, ajv.errors, {
      propertyPath: [],
      targetValue: data,
    });
    return { valid, errors: output as IOutputError[] };
  }
  return { valid, errors: [] };
}

export function validateSchema(schema: Record<string, any>): void {
  try {
    ajv.compile(schema);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export function buildHumanErrors(
  schema: Record<string, any>,
  errors: ErrorObject[],
): string[] {
  return errors.map((error) => {
    const missingProperty = (error.params as any).missingProperty;
    if (missingProperty) {
      const property = pointer.get(schema, `/properties/${missingProperty}`);
      return property.title + ' is a required field';
    }
    const property = pointer.get(schema, '/properties' + error.instancePath);
    if (error.keyword === 'format' && property.example) {
      return (
        property.title + ' is in an invalid format, e.g: ' + property.example
      );
    }
    return property.title + ' ' + error.message;
  });
}
