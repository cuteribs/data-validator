import {
	Nullable,
	RecordValidationType,
	IRecordValidationRule,
	RequiredIfNotNullValidator,
	createRecordValidationRule,
} from 'src/index';

class TestRecord {
	values: Record<string, Nullable<string>>;

	constructor(p1: Nullable<string>, p2: Nullable<string>, p3: Nullable<string>, p4: Nullable<string>) {
		this.values = { p1, p2, p3, p4 };
	}

	get(key: string): Nullable<string> {
		return this.values[key];
	}
}

const testData = [
	{ expected: true, isAffectedToAll: false, record: new TestRecord(null, 'b', null, 'd') },
	{ expected: true, isAffectedToAll: false, record: new TestRecord(null, 'b', 'c', 'd') },
	{ expected: true, isAffectedToAll: true, record: new TestRecord(null, 'b', 'c', 'd') },
	{ expected: true, isAffectedToAll: true, record: new TestRecord('a', 'b', 'c', 'd') },
	{ expected: false, isAffectedToAll: false, record: new TestRecord(null, 'b', null, null) },
	{ expected: false, isAffectedToAll: false, record: new TestRecord(null, 'b', '', null) },
	{ expected: false, isAffectedToAll: false, record: new TestRecord(null, 'b', null, '') },
	{ expected: false, isAffectedToAll: true, record: new TestRecord(null, 'b', null, null) },
	{ expected: false, isAffectedToAll: true, record: new TestRecord(null, 'b', '', '') },
	{ expected: false, isAffectedToAll: true, record: new TestRecord('a', 'b', null, null) },
];

function createSut(rule: IRecordValidationRule): RequiredIfNotNullValidator<TestRecord> {
	const valueGetter = (record: TestRecord, property: string) => record.get(property) ?? '';
	const sut = new RequiredIfNotNullValidator<TestRecord>(rule, valueGetter);
	return sut;
}

describe('RequiredIfNotNullValidator', () => {
	test.each(testData)('RequiredIfNotNullValidatorTests: %s', ({ expected, isAffectedToAll, record }) => {
		const rule = createRecordValidationRule(
			RecordValidationType.RequiredIfNotNull,
			'TestRule',
			'Test Rule',
			'Didnot pass Test Rule',
			['p1', 'p2'],
			['p3', 'p4'],
			isAffectedToAll
		);

		const sut = createSut(rule);
		const result = sut.validate(record);
		expect(result).toBe(expected);
	});
});
