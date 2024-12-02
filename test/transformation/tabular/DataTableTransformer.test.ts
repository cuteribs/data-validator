import { PropertyType, DataTable, createProperty, createSchema, DataTableTransformer } from 'src/index';

describe('DataTableTransformer', () => {
	it('TransformTest', async () => {
		// Arrange
		const schema = createSchema(1, '', [
			createProperty('Name', 1, PropertyType.Validation, false),
			createProperty('Age', 2, PropertyType.Validation, false),
		]);
		const input = new DataTable();
		input.addColumn('Age');
		input.addRow('10');
		const output = new DataTable();

		// Act
		const sut = new DataTableTransformer(schema);
		sut.transform(input, output);

		// Assert
		const columns = output.columns.map((c) => c.name);
		expect(columns[0]).toBe('Name');
		expect(columns[columns.length - 1]).toBe('Age');
	});
});
