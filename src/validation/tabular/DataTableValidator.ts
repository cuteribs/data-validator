import { Nullable } from 'src/common';
import { DataValidatorBase } from '../DataValidatorBase';
import { DataColumn, DataRow, DataTable, ISchema, Logger } from 'src/models';

export class DataTableValidator extends DataValidatorBase<DataTable, DataTable, DataRow> {
	constructor(schema: ISchema, logger: Logger) {
		super(schema, logger);
	}

	protected getPropertyNamesFromInput(input: DataTable): string[] {
		return input.columns.map((c) => c.name);
	}

	protected addOutputProperties(output: DataTable, propertyNames: string[]): void {
		output.columns.length = 0;
		const columns = propertyNames.map((name, index) => new DataColumn(output, name, index));
		output.columns.push(...columns);
	}

	protected getNextRecord(input: DataTable, index: number): Nullable<DataRow> {
		return input.rows[index];
	}

	protected addOutputRecord(output: DataTable, values: string[]): void {
		const row = new DataRow(output);
		row.values = values;
		output.rows.push(row);
	}

	protected getValue(record: DataRow, propertyName: string): string {
		const value = record.getByColumn(propertyName);
		return value ?? '';
	}
}
