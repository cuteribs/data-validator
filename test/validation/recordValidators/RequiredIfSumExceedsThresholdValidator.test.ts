import {
	Nullable,
	RecordValidationType,
	IRecordValidationRule,
	RequiredIfSumExceedsThresholdValidator,
	createRecordValidationRule,
} from 'src/index';

class TestRecord {
	values: Record<string, Nullable<string>>;

	constructor(p1: Nullable<string>, p2: Nullable<string>, p3: Nullable<string>) {
		this.values = { p1, p2, p3 };
	}

	get(key: string): Nullable<string> {
		return this.values[key];
	}
}

const testData = [
	{ expected: true, threshold: 10, record: new TestRecord(null, '10.001', 'c') },
	{ expected: true, threshold: 10, record: new TestRecord('9.999', '10.001', 'c') },
	{ expected: true, threshold: 10, record: new TestRecord('a', '10.001', 'c') },
	{ expected: true, threshold: 10, record: new TestRecord('9.999', 'b', null) },
	{ expected: true, threshold: 10, record: new TestRecord(null, null, null) },
	{ expected: false, threshold: 10, record: new TestRecord(null, '10.001', null) },
	{ expected: false, threshold: 10, record: new TestRecord('a', '10.001', null) },
	{ expected: false, threshold: 10, record: new TestRecord('10.002', '10.001', null) },
];

function createSut(rule: IRecordValidationRule): RequiredIfSumExceedsThresholdValidator<TestRecord> {
	const valueGetter = (record: TestRecord, property: string) => record.get(property) ?? '';
	const sut = new RequiredIfSumExceedsThresholdValidator<TestRecord>(rule, valueGetter);
	return sut;
}

describe('RequiredIfRegexMatchValidator', () => {
	test.each(testData)('Success: %s', ({ expected, threshold, record }) => {
		const rule = createRecordValidationRule(
			RecordValidationType.RequiredIfSumExceedsThreshold,
			'TestRule',
			'Test Rule',
			'Didnot pass Test Rule',
			['p1', 'p2'],
			['p3', 'p4'],
			false,
			threshold.toString()
		);

		const sut = createSut(rule);
		const result = sut.validate(record);
		expect(result).toBe(expected);
	});

	test.each([undefined, null, '', 'abc'])('Error: %s', (checkParameter) => {
		var rule = createRecordValidationRule(
			RecordValidationType.RequiredIfRegexMatch,
			'IMORule',
			'Test Rule for IMO',
			'Didnot pass IMORule',
			['p1', 'p2'],
			['p3', 'p4'],
			false,
			checkParameter
		);

		const action = () => createSut(rule);
		expect(action).toThrow();
	});
});
