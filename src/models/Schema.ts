import { Nullable } from 'src/common';
import { Property, RecordValidationRule } from '.';

export class Schema {
	versionNumber: number;
	description: Nullable<string>;
	properties: Property[];
	recordValidationRules: Nullable<RecordValidationRule[]>;
	// extensions: Nullable<any>;

	constructor(
		versionNumber: number,
		description: Nullable<string>,
		properties: Nullable<Property[]> = undefined,
		recordValidationRules: Nullable<RecordValidationRule[]> = undefined,
		extensions: Nullable<object> = undefined
	) {
		this.versionNumber = versionNumber;
		this.description = description;
		this.properties = properties || [];
		this.recordValidationRules = recordValidationRules;
		// this.extensions = extensions;
	}
}
