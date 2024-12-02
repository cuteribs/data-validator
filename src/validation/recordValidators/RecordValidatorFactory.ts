import {
	RecordValidatorBase,
	RequiredIfNotNullValidator,
	RequiredIfRegexMatchValidator,
	RequiredIfSumExceedsThresholdValidator,
} from '..';
import { IRecordValidationRule, RecordValidationType } from 'src/models';

export class RecordValidatorFactory {
	/// <summary>
	/// Creates a record validator based on the provided rule and value getter.
	/// </summary>
	/// <param name="rule">The record validation rule.</param>
	/// <param name="valueGetter">The function to get the value of a property from a record.</param>
	/// <returns>The created record validator.</returns>
	/// <exception cref="NotSupportedException">Thrown when the record validation rule type is not supported.</exception>
	static create<TRecord>(
		rule: IRecordValidationRule,
		valueGetter: (record: TRecord, property: string) => string
	): RecordValidatorBase<TRecord> {
		let result: RecordValidatorBase<TRecord>;

		switch (rule.type) {
			case RecordValidationType.RequiredIfNotNull:
				result = new RequiredIfNotNullValidator<TRecord>(rule, valueGetter);
				break;
			case RecordValidationType.RequiredIfRegexMatch:
				result = new RequiredIfRegexMatchValidator<TRecord>(rule, valueGetter);
				break;
			case RecordValidationType.RequiredIfSumExceedsThreshold:
				result = new RequiredIfSumExceedsThresholdValidator<TRecord>(rule, valueGetter);
				break;
		}

		return result;
	}
}
