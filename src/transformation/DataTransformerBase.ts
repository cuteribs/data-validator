import { Schema } from '../models/Schema';

export abstract class DataTransformerBase<TInput, TOutput> {
	schema: Schema;

	constructor(schema: Schema) {
		this.schema = schema;
	}

	abstract transform(input: TInput, output: TOutput): void;
}
