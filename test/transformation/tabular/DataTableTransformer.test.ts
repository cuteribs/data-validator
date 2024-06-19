import { Property } from '../../../src/models/Property';
import { PropertyType } from '../../../src/models/PropertyType';
import { Schema } from '../../../src/models/Schema';
import { DataTableTransformer } from '../../../src/transformation/tabular/DataTableTransformer';
import { DataTable } from '../../../src/models/DataTable';

describe('DataTableTransformer', () => {
	it('TransformTest', async () => {
		// Arrange
		const schema = new Schema(1, '', [
			new Property('Name', 1, PropertyType.Validation, false),
			new Property('Age', 2, PropertyType.Validation, false),
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
