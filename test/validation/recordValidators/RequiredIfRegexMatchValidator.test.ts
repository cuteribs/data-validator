import { Nullable } from 'src/common';
import { RecordValidationType, RecordValidationRule } from 'src/models';
import { RequiredIfRegexMatchValidator } from 'src/validation/recordValidators';

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
	{ expected: true, record: new TestRecord(null, '9900002', 'c') },
	{ expected: true, record: new TestRecord('9900000', '9900001', 'c') },
	{ expected: false, record: new TestRecord(null, '9900002', null) },
	{ expected: false, record: new TestRecord('9900000', '9900001', null) },
	{ expected: false, record: new TestRecord(null, '9900002', '') },
	{ expected: false, record: new TestRecord('9900000', '9900001', '') },
	{ expected: false, record: new TestRecord(null, '', 'c') },
	{ expected: false, record: new TestRecord(null, '99000011', 'c') },
	{ expected: false, record: new TestRecord('990000', null, 'c') },
];

function createSut(rule: RecordValidationRule): RequiredIfRegexMatchValidator<TestRecord> {
	const valueGetter = (record: TestRecord, property: string) => record.get(property) ?? '';
	const sut = new RequiredIfRegexMatchValidator<TestRecord>(rule, valueGetter);
	return sut;
}

describe('RequiredIfRegexMatchValidator', () => {
	test.each(testData)('RequiredIfRegexMatchValidatorTests: %s', ({ expected, record }) => {
		const rule = new RecordValidationRule(
			RecordValidationType.RequiredIfRegexMatch,
			'TestRule',
			'Test Rule',
			'Didnot pass Test Rule',
			['p1', 'p2'],
			['p3', 'p4'],
			false,
			'^\\d{7}$'
		);

		const sut = createSut(rule);
		const result = sut.validate(record);
		expect(result).toBe(expected);
	});

	test('RequiredIfRegexMatchValidatorTests_Exception', () => {
		var rule = new RecordValidationRule(
			RecordValidationType.RequiredIfRegexMatch,
			'IMORule',
			'Test Rule for IMO',
			'Didnot pass IMORule',
			['p1', 'p2'],
			['p3', 'p4'],
			false,
			null
		);

		const action = () => createSut(rule);
		expect(action).toThrow();
	});
});
