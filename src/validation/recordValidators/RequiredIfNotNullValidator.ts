import { IRecordValidationRule } from 'src/models';
import { RecordValidatorBase } from '.';

export class RequiredIfNotNullValidator<TRecord> extends RecordValidatorBase<TRecord> {
	constructor(rule: IRecordValidationRule, valueGetter: (record: TRecord, property: string) => string) {
		super(rule, valueGetter);
	}

	validate(record: TRecord): boolean {
		return this.rule.propertiesToCheck.some((x) => this.validatePropertyToCheck(record, x));
	}

	private validatePropertyToCheck(record: TRecord, property: string): boolean {
		const value = this.valueGetter(record, property);

		if (!value) return false;

		return this.validatePropertiesToAffect(record);
	}
}
