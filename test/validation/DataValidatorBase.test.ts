import { Nullable } from 'src/common';
import {
	Schema,
	Property,
	PropertyType,
	ValueValidation,
	Severity,
	DataFormat,
	Logger,
	RecordValidationRule,
	RecordValidationType,
} from 'src/models';
import { ValidationRule, createRule } from 'src/models/ValidationRule';
import { DataValidatorBase } from 'src/validation/DataValidatorBase';

const valueValidationData = {
	validationRules: {
		NotEmpty: {
			notEmpty: true,
			errorMessage: 'NotEmpty',
		},
		BooleanFormat: {
			dataFormat: DataFormat.Boolean,
			fallbackValue: 'false',
			errorMessage: 'BooleanFormat',
		},
		Int32Format: {
			dataFormat: DataFormat.Int32,
			errorMessage: 'Int32Format',
		},
		Int64Format: {
			dataFormat: DataFormat.Int64,
			errorMessage: 'Int64Format',
		},
		FloatFormat: {
			dataFormat: DataFormat.Float,
			errorMessage: 'FloatFormat',
		},
		DoubleFormat: {
			dataFormat: DataFormat.Double,
			errorMessage: 'DoubleFormat',
		},
		DateTimeFormat: {
			dataFormat: DataFormat.DateTime,
			errorMessage: 'DateTimeFormat',
		},
		ExclusiveMinimum10: {
			minimum: 10,
			exclusiveMinimum: true,
			errorMessage: 'ExclusiveMinimum10',
		},
		Minimum10: {
			minimum: 10,
			errorMessage: 'Minimum10',
		},
		ExclusiveMaximum10: {
			maximum: 10,
			exclusiveMaximum: true,
			errorMessage: 'ExclusiveMaximum10',
		},
		Maximum10: {
			maximum: 10,
			errorMessage: 'Maximum10',
		},
		MinLength10: {
			minLength: 10,
			errorMessage: 'MinLength10',
		},
		MaxLength10: {
			maxLength: 10,
			errorMessage: 'MaxLength10',
		},
		GuidPattern: {
			pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
			errorMessage: 'GuidPattern',
		},
		DirectionEnum: {
			enum: ['Top', 'Right', 'Down', 'Left'],
			errorMessage: 'DirectionEnum',
		},
	},

	properties: [
		{ name: 'P_NotEmpty', rule: 'NotEmpty', severity: 'Error' },
		{ name: 'P_BooleanFormat', rule: 'BooleanFormat', severity: 'Fallback' },
		{ name: 'P_Int32Format', rule: 'Int32Format' },
		{ name: 'P_Int64Format', rule: 'Int64Format' },
		{ name: 'P_FloatFormat', rule: 'FloatFormat' },
		{ name: 'P_DoubleFormat', rule: 'DoubleFormat' },
		{ name: 'P_DateTimeFormat', rule: 'DateTimeFormat' },
		{ name: 'P_UnknownFormat', rule: 'UnknownFormat' },
		{ name: 'P_ExclusiveMinimum10', rule: 'ExclusiveMinimum10' },
		{ name: 'P_Minimum10', rule: 'Minimum10' },
		{ name: 'P_ExclusiveMaximum10', rule: 'ExclusiveMaximum10' },
		{ name: 'P_Maximum10', rule: 'Maximum10' },
		{ name: 'P_Maximum10', rule: 'Maximum10' },
		{ name: 'P_MinLength10', rule: 'MinLength10' },
		{ name: 'P_MaxLength10', rule: 'MaxLength10' },
		{ name: 'P_GuidPattern', rule: 'GuidPattern' },
		{ name: 'P_DirectionEnum', rule: 'DirectionEnum' },
	],

	data: [
		['P_NotEmpty', ''],
		['P_BooleanFormat', '1'],
		['P_Int32Format', '5.5'],
		['P_Int64Format', '20202020202020202020'],
		['P_FloatFormat', 'a'],
		['P_DoubleFormat', 'a'],
		['P_DateTimeFormat', '19900101'],
		['P_UnknownFormat', 'xyz'],
		['P_ExclusiveMinimum10', '10'],
		['P_Minimum10', '9.9'],
		['P_ExclusiveMaximum10', '10'],
		['P_Maximum10', '10.1'],
		['P_Maximum10', 'two'],
		['P_MinLength10', '999999999'],
		['P_MaxLength10', '11111111111'],
		['P_GuidPattern', '0001'],
		['P_DirectionEnum', 'Forward'],
		['P_NotInSchema', ''],
	],
};

const testSchema = new Schema(9, 'Test Schema', getTestProperties());

describe('DataValidatorBase', () => {
	const positiveIntegerRule = createRule({
		name: 'positive integer',
		errorMessage: 'Value is not a positive integer.',
		dataFormat: DataFormat.Int32,
		minimum: 1,
	});

	const notEmptyStringRule = createRule({
		name: 'not empty string',
		notEmpty: true,
		errorMessage: 'Value is empty.',
		fallbackValue: 'SPACE',
	});

	const getTestSchema = () =>
		new Schema(9, 'Test Schema', [
			new Property('Column_1', 1, PropertyType.Validation, true, [
				new ValueValidation(Severity.Error, positiveIntegerRule),
			]),
			new Property('Column_2', 2, PropertyType.Validation, false, [
				new ValueValidation(Severity.Fallback, notEmptyStringRule),
			]),
			new Property('Column_3', 3, PropertyType.Validation, false),
		]);

	test('should validate with valid input and return output', () => {
		const logger = new Logger();
		const sut = new TestDataValidator(getTestSchema(), logger);
		const input = {
			fields: ['Column_1', 'Column_2', 'Column_3', 'Column_4'],
			records: [{ Column_1: '1', Column_2: 'Value', Column_3: '', Column_4: '' }],
		};
		const output = {
			fields: ['Column_1', 'Column_2', 'Column_3', 'Column_4'],
			records: [],
		};

		const result = sut.validate(input, output);

		expect(result).toBe(true);
		expect(output.records.length).toBe(1);
		expect(output.records[0]).toEqual(input.records[0]);
	});

	test('should validate with missing required headers and return output', () => {
		const logger = new Logger();
		const sut = new TestDataValidator(getTestSchema(), logger);
		const input = {
			fields: ['Column_2', 'Column_3'],
			records: [{ Column_2: 'Value', Column_3: '' }],
		};

		const result = sut.validate(input, { fields: [], records: [] });

		expect(result).toBe(false);
	});

	test('should validate with auto properties and return output', () => {
		const schema = new Schema(1, '', [
			new Property('Column1', 1, PropertyType.Validation, false, [
				new ValueValidation(
					Severity.Fallback,
					createRule({
						dataFormat: DataFormat.Float,
						fallbackValue: '9.9',
					})
				),
			]),
			new Property('Column2', 1, PropertyType.Validation, false),
			new Property('DateTime', 1, PropertyType.Timestamp, false),
			new Property('Correction', 1, PropertyType.FallbackIndicator, false),
		]);

		const logger = new Logger();
		const sut = new TestDataValidator(schema, logger);
		const input: TestData = {
			fields: ['Column1', 'Column2'],
			records: [
				{ Column1: 'a', Column2: '' },
				{ Column1: '1', Column2: '' },
				{ Column1: 'b', Column2: '' },
			],
		};
		let output: TestData = { fields: [], records: [] };

		let result = sut.validate(input, output);
		expect(result).toBe(true);
		expect(output.records.length).toBe(3);

		let record = output.records[0];
		const dateTime = Date.parse(record['DateTime']);
		expect(isNaN(dateTime)).toBe(false);
		expect(record['Correction']).toBe('Y');
		expect(record['Column1']).toBe('9.9');

		record = output.records[1];
		const dateTime2 = Date.parse(record['DateTime']);
		expect(dateTime2).toBe(dateTime);
		expect(record['Correction']).toBe('');
		expect(record['Column1']).toBe('1');

		input.fields = ['Column1', 'DateTime'];
		output = { fields: [], records: [] };
		result = sut.validate(input, output);
		expect(result).toBe(false);

		for (const record of output.records) {
			expect(record.length).not.toBe(output.fields.length);
		}
	});

	test('should validate with record validation', () => {
		const logger = new Logger();
		const schema = getTestSchema();
		schema.recordValidationRules = [
			new RecordValidationRule(
				RecordValidationType.RequiredIfNotNull,
				'RequiredIfNotNull',
				'If Column_1 not null then Column_2 is required',
				'Column_1 is required.',
				['Column_1'],
				['Column_2']
			),
		];
		const input: TestData = {
			fields: ['Column_1', 'Column_2'],
			records: [{ Column_1: '1', Column_2: 'value' }],
		};
		const output: TestData = { fields: [], records: [] };

		const sut = new TestDataValidator(schema, logger);

		let result = sut.validate(input, output);
		expect(result).toBe(true);

		input.records = [{ Column_1: '1', Column_2: '' }];
		result = sut.validate(input, output);
		expect(result).toBe(false);
	});

	test.each(getTestData())('value valudation test: %s', ({ propertyName, value, validation }) => {
		const logger = new Logger();
		const input: TestData = { fields: [propertyName], records: [{ [propertyName]: value }] };
		const output: TestData = { fields: [propertyName], records: [] };

		const sut = new TestDataValidator(testSchema, logger);

		const result = sut.validate(input, output);

		if (!validation) {
			expect(result).toBe(true);
			expect(output.records[0][propertyName]).toBe(value);
			return;
		}

		if(validation.severity === Severity.Error){
			expect(result).toBe(false);
		} else{
			expect(result).toBe(true);

			if(validation.severity === Severity.Fallback){
				expect(output.records[0][propertyName]).toBe(validation.rule.fallbackValue);
			}
		}		

		const logEntry = logger.entries[0];
		expect(logEntry.message).toBe(validation.rule.errorMessage);
	});
});

class TestDataValidator extends DataValidatorBase<TestData, TestData, TestRecord> {
	private propertyNames: string[] = [];

	constructor(schema: Schema, logger: Logger) {
		super(schema, logger);
	}

	protected getPropertyNamesFromInput(input: TestData): string[] {
		return input.fields;
	}

	protected addOutputProperties(output: TestData, propertyNames: string[]): void {
		output.fields = this.propertyNames = [...propertyNames];
	}

	protected getNextRecord(input: TestData, index: number): Nullable<TestRecord> {
		return input.records[index];
	}

	protected addOutputRecord(output: TestData, values: string[]): void {
		const record: TestRecord = {};

		for (let i = 0; i < this.propertyNames.length; i++) {
			record[this.propertyNames[i]] = values[i] ?? '';
		}
		output.records.push(record);
	}

	protected getValue(record: TestRecord, propertyName: string): string {
		return record[propertyName];
	}
}

class TestData {
	fields: string[] = [];
	records: TestRecord[] = [];
}

type TestRecord = Record<string, string>;

function getTestValidationRules(): Record<string, ValidationRule> {
	const entries = Object.entries(valueValidationData.validationRules);
	const rules: Record<string, ValidationRule> = {};

	for (const [key, value] of entries) {
		rules[key] = createRule({ name: key, ...value });
	}

	return rules;
}

function getTestProperties(): Property[] {
	const rules = getTestValidationRules();

	return valueValidationData.properties.map((x) => {
		const severity = Severity[(x.severity ?? 'Warning') as keyof typeof Severity];
		const rule = rules[x.rule];
		const vaidations = rule ? [new ValueValidation(severity, rule)] : undefined;
		const property = new Property(x.name, 1, PropertyType.Validation, false, vaidations);
		return property;
	});
}

function getTestData() {
	return valueValidationData.data.map((x) => {
		const [propertyName, value] = x;
		return getData(propertyName, value);
	});
}

function getData(propertyName: string, value: string) {
	const property = testSchema.properties.find((x) => x.name == propertyName);
	const validation = property?.validations?.[0];
	return { propertyName, value, validation };
}
