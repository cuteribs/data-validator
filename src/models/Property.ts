import { Nullable } from 'src/common';
import { PropertyType, ValueValidation } from '.';

export class Property {
	name: string;
	order: number;
	type: PropertyType;
	required: boolean;
	validations: Nullable<ValueValidation[]>;
	extensions: Nullable<any>;

	constructor(
		name: string,
		order: number,
		type: PropertyType,
		required: boolean,
		validations: Nullable<ValueValidation[]> = undefined,
		extensions: Nullable<any> = undefined
	) {
		this.name = name;
		this.order = order;
		this.type = type;
		this.required = required;
		this.validations = validations;
		this.extensions = extensions;
	}
}
