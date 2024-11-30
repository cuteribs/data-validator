import { ISchema } from '../../models/ISchema';
import { DataColumn, DataTable } from '../../models/DataTable';
import { DataTransformerBase } from '../DataTransformerBase';

export class DataTableTransformer extends DataTransformerBase<DataTable, DataTable> {
	constructor(schema: ISchema) {
		super(schema);
	}

	transform(input: DataTable, output: DataTable): void {
		if (output.columns.length === 0) {
			for (const p of this.schema.properties) {
				const column = new DataColumn(output, p.name);
				output.columns.push(column);
			}
		}

		const inputColumns = input.columns.map((c) => c.name);
		const outputColumns = output.columns.map((c) => c.name);
		const intersectedColumns = inputColumns.filter((c) => outputColumns.some((oc) => oc === c));

		for (const row of input.rows) {
			const newRow = output.addRow();

			for (const c of intersectedColumns) {
				newRow.setByColumn(c, row.getByColumn(c)!);
			}
		}
	}
}
