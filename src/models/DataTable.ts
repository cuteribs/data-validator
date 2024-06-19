import { Nullable } from 'src/common';

export class DataTable {
	rows: DataRow[] = [];
	columns: DataColumn[] = [];

	addColumn(name: string): DataColumn {
		const column = new DataColumn(this, name, this.columns.length);
		this.columns.push(column);
		return column;
	}

	addRow(...values: string[]): DataRow {
		const row = new DataRow(this);
		const [columnsLen, valuesLen] = [this.columns.length, values.length];

		if (valuesLen === 0) {
			row.values = Array(columnsLen).fill('');
		} else if (valuesLen !== columnsLen) {
			throw new Error('Invalid number of values');
		} else {
			row.values = values;
		}

		this.rows.push(row);
		return row;
	}
}

export class DataColumn {
	table: DataTable;
	name: string;
	index: number;

	constructor(table: DataTable, name: string, index = -1) {
		this.table = table;
		this.name = name;
		this.index = index;
	}
}

export class DataRow {
	table: DataTable;
	values: string[];

	constructor(table: DataTable, values: string[] = []) {
		this.table = table;
		this.values = values;
	}

	getByColumn(column: string): Nullable<string> {
		const index = this.table.columns.findIndex((c) => c.name === column);
		return index > -1 ? this.values[index] : undefined;
	}

	getByIndex(index: number): Nullable<string> {
		return index > -1 && index < this.values.length ? this.values[index] : undefined;
	}

	setByColumn(column: string, value: string): void {
		const index = this.table.columns.findIndex((c) => c.name === column);
		index > -1 && (this.values[index] = value);
	}
}
