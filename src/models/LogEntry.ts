import { Severity } from '.';
import { Dictionary, Nullable } from 'src/common';

export class LogEntry {
	severity: Severity;
	message: string;
	args: Record<string, any> = {};

	constructor(
		severity: Severity,
		message: string,
		property: Nullable<string>,
		recordNumber: Nullable<number>,
		rule: Nullable<string>,
		value: Nullable<string>,
		args: Dictionary
	) {
		this.severity = severity;
		this.message = message;

		for (const [key, value] of Object.entries(args)) {
			this.args[key] = value;
		}

		this.args['property'] = property;
		this.args['recordNumber'] = recordNumber;
		this.args['rule'] = rule;
		this.args['value'] = value;
	}
}
