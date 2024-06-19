import { Dictionary, Nullable } from 'src/common';
import { LogEntry, Severity } from '.';

export class Logger {
	entries: LogEntry[] = [];

	logError(
		message: string,
		property: Nullable<string> = undefined,
		recordNumber: Nullable<number> = undefined,
		rule: Nullable<string> = undefined,
		value: Nullable<string> = undefined,
		args: Dictionary = {}
	): void {
		this.entries.push(new LogEntry(Severity.Error, message, property, recordNumber, rule, value, args));
	}

	logWarning(
		message: string,
		property: Nullable<string> = undefined,
		recordNumber: Nullable<number> = undefined,
		rule: Nullable<string> = undefined,
		value: Nullable<string> = undefined,
		args: Dictionary = {}
	): void {
		this.entries.push(new LogEntry(Severity.Warning, message, property, recordNumber, rule, value, args));
	}

	log(
		severity: Severity,
		message: string,
		property: Nullable<string> = undefined,
		recordNumber: Nullable<number> = undefined,
		rule: Nullable<string> = undefined,
		value: Nullable<string> = undefined,
		args: Dictionary = {}
	): void {
		this.entries.push(new LogEntry(severity, message, property, recordNumber, rule, value, args));
	}
}
