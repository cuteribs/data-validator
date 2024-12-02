import { Nullable } from 'src/common';

export enum DataFormat {
	String = 'String',
	Boolean = 'Boolean',
	Int32 = 'Int32',
	Int64 = 'Int64',
	Float = 'Float',
	Double = 'Double',
	DateTime = 'DateTime',
}

export enum PropertyType {
	Validation = 'Validation',
	FallbackIndicator = 'FallbackIndicator',
	Timestamp = 'Timestamp',
}

export enum Severity {
	Error = 'Error',
	Warning = 'Warning',
	Fallback = 'Fallback',
}

export enum RecordValidationType {
	RequiredIfNotNull = 'RequiredIfNotNull',
	RequiredIfRegexMatch = 'RequiredIfRegexMatch',
	RequiredIfSumExceedsThreshold = 'RequiredIfSumExceedsThreshold',
}

export interface IValidationRule {
	name: string;

	notEmpty: boolean;
	dataFormat: Nullable<DataFormat>;

	// Number validations
	minimum: Nullable<number>;
	maximum: Nullable<number>;
	exclusiveMinimum: boolean;
	exclusiveMaximum: boolean;

	// String validations
	minLength: Nullable<number>;
	maxLength: Nullable<number>;
	pattern: Nullable<string>;
	enum: Nullable<string[]>;

	errorMessage: string;
	fallbackValue: string;
}

export interface IValueValidation {
	severity: Severity;
	rule: IValidationRule;
}

export interface IProperty {
	name: string;
	order: number;
	type: PropertyType;
	required: boolean;
	validations: Nullable<IValueValidation[]>;
	extensions: Nullable<any>;
}

export interface IRecordValidationRule {
	type: RecordValidationType;
	name: string;
	description: string;
	errorMessage: string;
	propertiesToCheck: string[];
	propertiesToAffect: string[];
	isAffectedToAll: boolean;
	checkParameter: Nullable<string>;
}

export interface ISchema {
	versionNumber: number;
	description: Nullable<string>;
	properties: IProperty[];
	recordValidationRules: Nullable<IRecordValidationRule[]>;
	// extensions: Nullable<any>;
}
