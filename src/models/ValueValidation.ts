import { Severity, ValidationRule } from '.';

export class ValueValidation {
	severity: Severity;
	rule: ValidationRule;

	constructor(severity: Severity, rule: ValidationRule) {
		this.severity = severity;
		this.rule = rule;
	}
}
