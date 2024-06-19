import { RecordValidationRule } from 'src/models';
import { RecordValidatorBase } from '.';

export class RequiredIfRegexMatchValidator<TRecord> extends RecordValidatorBase<TRecord> {
	static regexPatterns: Record<string, RegExp> = {};

	constructor(rule: RecordValidationRule, valueGetter: (record: TRecord, property: string) => string) {
		super(rule, valueGetter);

		if (!rule.checkParameter) {
			throw new Error('checkParameter is required for RequiredIfRegexMatchValidator.');
		}
	}

	validate(record: TRecord): boolean {
		return this.rule.propertiesToCheck.some((x) => this.validatePropertyToCheck(record, x));
	}

	private validatePropertyToCheck(record: TRecord, property: string): boolean {
		const value = this.valueGetter(record, property);

		const checkParameter = this.rule.checkParameter ?? '';

		if (value?.length > 0 && checkParameter.length > 0) {
			let regex = RequiredIfRegexMatchValidator.regexPatterns[checkParameter];
			if (!regex) {
				regex = RequiredIfRegexMatchValidator.regexPatterns[checkParameter] = new RegExp(checkParameter);
			}

			if (regex.test(value)) {
				return this.validatePropertiesToAffect(record);
			}
		}

		return false;
	}
}
