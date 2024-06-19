import { DataColumn, DataRow, DataTable } from 'src/models';

describe('DataTable', () => {
	test('Adds column', () => {
		const sut = new DataTable();
		const column = sut.addColumn('Column1');
		expect(column).not.toBeNull();
		expect(column.name).toBe('Column1');

		sut.addColumn('Column2');
		expect(sut.columns.length).toBe(2);
	});
	test('Adds row', () => {
		const sut = new DataTable();
		sut.addColumn('Column1');
		const value = 'value 1';
		const row = sut.addRow(value);
		expect(row).not.toBeNull();
		expect(row.getByIndex(0)).toBe(value);
		expect(row.getByColumn('Column1')).toBe(value);
		expect(row.getByColumn('Column2')).toBeUndefined();

		row.setByColumn('Column1', 'value 2');
		expect(row.getByIndex(0)).toBe('value 2');
		expect(row.getByIndex(1)).toBeUndefined();
		expect(row.values.length).toBe(1);

		const action = () => sut.addRow('c1', 'c2');
		expect(action).toThrow();
	});
});

describe('DataColumn', () => {
	test('Constructor', () => {
		const table = new DataTable();
		const sut = new DataColumn(table, 'Column1');
		expect(sut).not.toBeNull();
		expect(sut.table).toBe(table);
	});
});

describe('DataRow', () => {
	test('Constructor', () => {
		const table = new DataTable();
		const sut = new DataRow(table);
		expect(sut).not.toBeNull();
		expect(sut.table).toBe(table);
	});
});
