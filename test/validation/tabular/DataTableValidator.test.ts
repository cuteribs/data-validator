﻿import { Logger, Schema, Property, PropertyType, DataTable } from 'src/models';
import { DataTableValidator } from 'src/validation/tabular/DataTableValidator';

describe('DataTableValidator', () => {
	it('ValidateTest', () => {
		const logger = new Logger();
		const schema = new Schema(1, '');
		schema.properties.push(new Property('Column1', 1, PropertyType.Validation, false));
		const input = new DataTable();
		input.addColumn('Column1');
		input.addRow('Value1');
		const output = new DataTable();

		const sut = new DataTableValidator(schema, logger);
		const result = sut.validate(input, output);
		expect(result).toBe(true);
		expect(output.columns[0].name).toBe(input.columns[0].name);
		expect(output.rows[0].getByIndex(0)).toBe(input.rows[0].getByIndex(0));
	});
});