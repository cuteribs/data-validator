import { ISchema } from '../models/ISchema';

export abstract class DataTransformerBase<TInput, TOutput> {
	schema: ISchema;

	constructor(schema: ISchema) {
		this.schema = schema;
	}

	abstract transform(input: TInput, output: TOutput): void;
}
