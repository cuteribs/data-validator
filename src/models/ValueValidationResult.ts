import { Nullable } from 'src/common';

export interface ValueValidationResult {
	isValid: boolean;
	fallbackValue: Nullable<string>;
}
