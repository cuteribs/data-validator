import { RecordValidationType, createRecordValidationRule } from 'src/models';
import {
	RequiredIfNotNullValidator,
	RequiredIfRegexMatchValidator,
	RequiredIfSumExceedsThresholdValidator,
	RecordValidatorFactory,
} from 'src/validation/recordValidators';

const testData = [
	{ type: RecordValidationType.RequiredIfNotNull, objectType: RequiredIfNotNullValidator.name },
	{ type: RecordValidationType.RequiredIfRegexMatch, objectType: RequiredIfRegexMatchValidator.name },
	{
		type: RecordValidationType.RequiredIfSumExceedsThreshold,
		objectType: RequiredIfSumExceedsThresholdValidator.name,
	},
];

type TestRecord = {};

describe('RecordValidatorBase', () => {
	test.each(testData)('CreateTest: %s', ({ type, objectType }) => {
		const rule = createRecordValidationRule(type, 'name', 'description', 'errorMessage', [], [], undefined, '1');
		const result = RecordValidatorFactory.create<TestRecord>(rule, (r, p) => '');
		expect(result.constructor.name).toBe(objectType);
	});
});
