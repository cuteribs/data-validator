import { IRecordValidationRule } from 'src/models';

export abstract class RecordValidatorBase<TRecord> {
	rule: IRecordValidationRule;
	valueGetter: (record: TRecord, property: string) => string;

	constructor(rule: IRecordValidationRule, valueGetter: (record: TRecord, property: string) => string) {
		this.rule = rule;
		this.valueGetter = valueGetter;
	}

	/// <summary>
	/// Validates the record based on the provided rule.
	/// </summary>
	/// <param name="record">The record to validate.</param>
	abstract validate(record: TRecord): boolean;

	/// <summary>
	/// Default implementation to validate the properties to affect that are not empty.
	/// </summary>
	/// <param name="record"></param>
	/// <returns></returns>
	protected validatePropertiesToAffect(record: TRecord): boolean {
		return this.rule.isAffectedToAll
			? this.rule.propertiesToAffect.every((x) => this.validatePropertyToAffect(record, x))
			: this.rule.propertiesToAffect.some((x) => this.validatePropertyToAffect(record, x));
	}

	private validatePropertyToAffect(record: TRecord, property: string): boolean {
		return !!this.valueGetter(record, property);
	}
}
