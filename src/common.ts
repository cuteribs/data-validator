import {
	IValidationRule,
	Severity,
	IValueValidation,
	PropertyType,
	IProperty,
	RecordValidationType,
	IRecordValidationRule,
	ISchema,
} from './models';

export const LogMessages = {
	PropertyNotExistInSchema: "IProperty '{0}' doesn't exist in schema",
	RequiredPropertyMissing: "Required property '{0}' is missing",
	CsvHeaderNotFound: 'No header is found in CSV file',
	SchemaPropertyConflict: 'IProperty name conflict between schema and input data',
	PropertyNotFound: 'Cannot find any property',
};

export type Nullable<T> = T | null | undefined;

export type Dictionary = Record<string, Nullable<any>>;

export function isNumber(value: Nullable<string>): boolean {
	const str = value ?? '';
	return !isNaN(parseFloat(str)) && isFinite(Number(str));
}

export function createValidationRule(rule: Partial<IValidationRule>): IValidationRule {
	const defaultRule: IValidationRule = {
		name: '',
		errorMessage: '',
		fallbackValue: '',
		notEmpty: false,
		dataFormat: undefined,
		minimum: undefined,
		maximum: undefined,
		exclusiveMinimum: false,
		exclusiveMaximum: false,
		minLength: undefined,
		maxLength: undefined,
		pattern: undefined,
		enum: undefined,
	};
	return { ...defaultRule, ...rule } as IValidationRule;
}

export function createValueValidation(severity: Severity, rule: IValidationRule): IValueValidation {
	return { severity, rule };
}

export function createProperty(
	name: string,
	order: number,
	type: PropertyType,
	required: boolean,
	validations: Nullable<IValueValidation[]> = undefined,
	extensions: Nullable<any> = undefined
): IProperty {
	return { name, order, type, required, validations, extensions };
}

export function createRecordValidationRule(
	type: RecordValidationType,
	name: string,
	description: string,
	errorMessage: string,
	propertiesToCheck: string[],
	propertiesToAffect: string[],
	isAffectedToAll = false,
	checkParameter: Nullable<string> = null
): IRecordValidationRule {
	return {
		type,
		name,
		description,
		errorMessage,
		propertiesToCheck,
		propertiesToAffect,
		isAffectedToAll,
		checkParameter,
	};
}

export function createSchema(
	versionNumber: number,
	description: Nullable<string>,
	properties: Nullable<IProperty[]> = undefined,
	recordValidationRules: Nullable<IRecordValidationRule[]> = undefined
): ISchema {
	return { versionNumber, description, properties: properties || [], recordValidationRules };
}
