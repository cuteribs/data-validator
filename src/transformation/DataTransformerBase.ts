﻿import { ISchema } from '../models/Schema';

export abstract class DataTransformerBase<TInput, TOutput> {
	schema: ISchema;

	constructor(schema: ISchema) {
		this.schema = schema;
	}

	abstract transform(input: TInput, output: TOutput): void;
}
