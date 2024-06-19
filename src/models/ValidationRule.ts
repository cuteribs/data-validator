import { Nullable } from 'src/common';
import { DataFormat } from '.';

export interface ValidationRule {
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

export function createRule(rule: Partial<ValidationRule>): ValidationRule {
	const defaultRule: ValidationRule = {
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
	return { ...defaultRule, ...rule } as ValidationRule;
}
