import { IRecordValidationRule } from 'src/models';
import { RecordValidatorBase } from '.';
import { isNumber } from 'src/common';

export class RequiredIfSumExceedsThresholdValidator<TRecord> extends RecordValidatorBase<TRecord> {
	private readonly threshold: number;

	constructor(rule: IRecordValidationRule, valueGetter: (record: TRecord, property: string) => string) {
		super(rule, valueGetter);

		if (isNumber(this.rule.checkParameter)) {
			this.threshold = Number(this.rule.checkParameter);
		} else {
			throw new Error('checkParameter is required for RequiredIfSumExceedsThresholdValidator.');
		}
	}

	validate(record: TRecord): boolean {
		const sum = this.rule.propertiesToCheck.reduce((acc, x) => acc + Number(this.valueGetter(record, x)) || 0, 0);

		let result = true;

		if (sum > this.threshold) {
			result = this.validatePropertiesToAffect(record);
		}

		return result;
	}
}
