import { Nullable } from 'src/common';
import { RecordValidationType } from 'src/models';

export class RecordValidationRule {
	type: RecordValidationType;
	name: string;
	description: string;
	errorMessage: string;
	propertiesToCheck: string[];
	propertiesToAffect: string[];
	isAffectedToAll: boolean;
	checkParameter: Nullable<string>;

	constructor(
		type: RecordValidationType,
		name: string,
		description: string,
		errorMessage: string,
		propertiesToCheck: string[],
		propertiesToAffect: string[],
		isAffectedToAll = false,
		checkParameter: Nullable<string> = null
	) {
		this.type = type;
		this.name = name;
		this.description = description;
		this.errorMessage = errorMessage;
		this.propertiesToCheck = propertiesToCheck;
		this.propertiesToAffect = propertiesToAffect;
		this.isAffectedToAll = isAffectedToAll;
		this.checkParameter = checkParameter;
	}
}
