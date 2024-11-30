import { Nullable, isNumber } from 'src/common';
import { LogMessages } from 'src/LogMessages';
import { RecordValidatorFactory, RequiredIfRegexMatchValidator } from './recordValidators';
import { 
	ISchema, 
	Logger, 
	RecordValidationResult, 
	ValueValidationResult, 
	Severity, 
	IValueValidation, 
	IValidationRule, 
	PropertyType, 
	DataFormat, 
	IProperty
} from 'src/models';

export abstract class DataValidatorBase<TInput, TOutput, TRecord> {
	protected validationStartTime: Nullable<number>;
	schema: ISchema;
	logger: Logger;
	validationProperties: Nullable<IProperty[]>;
	autoProperties: Nullable<IProperty[]>;

	constructor(schema: ISchema, logger: Logger) {
		this.schema = schema;
		this.logger = logger;
	}

	validate(input: TInput, output: TOutput): boolean {
		let result = true;
		const inputPropertyNames = this.getPropertyNamesFromInput(input);

		if (!this.validatePropertyNames(inputPropertyNames)) {
			return false;
		}

		const propertyNames = Array.from(inputPropertyNames);

		for (const p of this.getAutoProperties()) {
			if (propertyNames.includes(p.name)) {
				this.logger.logError(LogMessages.SchemaPropertyConflict);
				return false;
			}

			propertyNames.push(p.name);
		}

		this.addOutputProperties(output, propertyNames);

		let i = 0;
		let record : Nullable<TRecord>; 

		while (true) {
			record = this.getNextRecord(input, i);

			if(!record) break;

			i++;
			const recordResult = this.validateRecord(i, record, inputPropertyNames);

			if (!recordResult.isValid) {
				result = false;
				continue;
			}

			this.addOutputRecord(output, recordResult.values);
		}

		return result;
	}

	protected abstract addOutputProperties(output: TOutput, propertyNames: string[]): void;

	private validateWithRecordValidationRules(record: TRecord, recordNumber: number): boolean {
		let isValid = true;

		for (const rule of this.schema.recordValidationRules || []) {
			const recordValidator = RecordValidatorFactory.create(rule, this.getValue);
			isValid = recordValidator.validate(record);

			if (!isValid) {
				const args = {
					PropertiesToCheck: rule.propertiesToCheck,
					PropertiesToAffect: rule.propertiesToAffect,
				};
				this.logger.logError(rule.errorMessage, null, recordNumber, rule.name, null, args);
			}
		}

		return isValid;
	}

	private validatorValueOfProperties(
		recordNumber: number,
		record: TRecord,
		propertyNames: string[],
		result: RecordValidationResult
	): void {
		for (const propertyName of propertyNames) {
			const value = this.getValue(record, propertyName);
			const property = this.getValidationProperties().find((c) => c.name === propertyName);

			if (!property) {
				result.values.push(value);
				continue;
			}

			const valueResult: ValueValidationResult = { isValid: true, fallbackValue: null };

			for (const validation of property.validations || []) {
				const severity = validation.severity;
				const isValid = this.validateValue(recordNumber, propertyName, validation, value);

				if (!isValid) {
					switch (severity) {
						case Severity.Error:
							valueResult.isValid = false;
							break;
						case Severity.Fallback:
							valueResult.fallbackValue = validation.rule.fallbackValue;
							result.hasFallback = true;
							break;
					}
				}
			}

			if (valueResult.isValid) {
				result.values.push(valueResult.fallbackValue || value);
			} else {
				result.isValid = false;
			}
		}
	}

	protected validateRecord(recordNumber: number, record: TRecord, propertyNames: string[]): RecordValidationResult {
		const recordResult: RecordValidationResult = { isValid: true, hasFallback: false, values: [] };

		// validate record
		recordResult.isValid = this.validateWithRecordValidationRules(record, recordNumber);

		// validate properties
		this.validatorValueOfProperties(recordNumber, record, propertyNames, recordResult);

		// append auto properties
		this.appendAutoProperties(recordResult);

		return recordResult;
	}

	protected validateValue(
		recordNumber: number,
		propertyName: string,
		validation: IValueValidation,
		value: string
	): boolean {
		const { severity, rule } = validation;
		const result = this.validateValueInternal(rule, value);

		if (!result) {
			this.logger.log(severity, rule.errorMessage, propertyName, recordNumber, rule.name, value);
		}

		return result;
	}

	private validateValueInternal(rule: IValidationRule, value: string): boolean {
		// validate NotEmpty
		if (value === '') {
			return !rule.notEmpty;
		}

		// validate format
		if (rule.dataFormat && !this.validateDataFormat(value, rule.dataFormat)) {
			return false;
		}

		// validate numeric
		if (typeof rule.minimum === 'number' || typeof rule.maximum === 'number') {
			if (!isNumber(value)) {
				return false;
			} 
			
			const numericValue = Number(value);

			if (typeof rule.minimum === 'number' &&
				(rule.exclusiveMinimum ? numericValue <= rule.minimum : numericValue < rule.minimum)
			) {
				return false;
			}

			if (typeof rule.maximum === 'number' &&
				(rule.exclusiveMaximum ? numericValue >= rule.maximum : numericValue > rule.maximum)
			) {
				return false;
			}
		}

		// validate string
		if (typeof rule.minLength === 'number' && value.length < rule.minLength) {
			return false;
		}

		if (typeof rule.maxLength === 'number' && value.length > rule.maxLength) {
			return false;
		}

		if (rule.pattern) {
			if (!RequiredIfRegexMatchValidator.regexPatterns[rule.pattern]) {
				RequiredIfRegexMatchValidator.regexPatterns[rule.pattern] = new RegExp(rule.pattern);
			}

			if (!RequiredIfRegexMatchValidator.regexPatterns[rule.pattern].test(value)) {
				return false;
			}
		}

		if (rule.enum && rule.enum.length > 0 && !rule.enum.includes(value)) {
			return false;
		}

		return true;
	}

	protected appendAutoProperties(result: RecordValidationResult): void {
        for (const p of this.getAutoProperties()) {
            let value = '';

            this.validationStartTime ??= Date.now();

            switch (p.type) {
                case PropertyType.Timestamp:
                    value = new Date(this.validationStartTime).toISOString().substring(0, 19);
                    break;
                case PropertyType.FallbackIndicator:
                    value = result.hasFallback ? 'Y' : '';
                    break;
            }

            result.values.push(value);
        }
    }

	protected validateDataFormat(value: string, dataFormat: DataFormat): boolean {
        let result = true;

        switch (dataFormat) {
            case DataFormat.Boolean:
                if (!['true', 'false'].includes(value.toLowerCase())) {
                    result = false;
                }
                break;
            case DataFormat.Int32:
				// -2147483648 ~ 2147483647
				if(isNumber(value)) {
					const number = Number(value);

					if(!Number.isInteger(number) || number <= -2147483648 || number >= 2147483647) {
						result = false;
					}
				} else {
					result = false;
				}
                break;
			case DataFormat.Int64:
				// -9223372036854775807 ~ 9223372036854775807, not safe in JS
				if(isNumber(value)) {
					const number = Number(value);

					if(!Number.isInteger(number)) {
						result = false;
					} else {
						const bigInt = BigInt(value);

						if(bigInt <= BigInt('-9223372036854775807') || bigInt >= BigInt('9223372036854775807')) {
							result = false;
						}
					}
				} else {
					result = false;
				}
                break;
            case DataFormat.Float:
                case DataFormat.Double:
                if (isNaN(Number(value))) {
                    result = false;
                }
                break;
            case DataFormat.DateTime:
                if (isNaN(Date.parse(value))) {
                    result = false;
                }
                break;
            default:
                if (!Object.values(DataFormat).includes(dataFormat)) {
                    result = false;
                }
                break;
        }

        return result;
    }

	protected validatePropertyNames(propertyNames: string[]): boolean {
        let isValid = true;

        if (propertyNames.length === 0) {
            this.logger.logError(LogMessages.PropertyNotFound);
            return false;
        }

        for (const name of propertyNames) {
            if (!this.getValidationProperties().some((x) => x.name === name)) {
                this.logger.logWarning(LogMessages.PropertyNotExistInSchema, name);
            }
        }

        for (const property of this.getValidationProperties().filter((c) => c.required)) {
            if (!propertyNames.includes(property.name)) {
                this.logger.logError(LogMessages.RequiredPropertyMissing, property.name);
                isValid = false;
            }
        }

        return isValid;
    }

	protected getValidationProperties(): IProperty[] {
		if(!this.validationProperties){
			this.validationProperties = this.schema.properties.filter((p) => p.type === PropertyType.Validation);

		}
		return this.validationProperties;
	}
	
	protected getAutoProperties(): IProperty[] {
		if(!this.autoProperties) {
			this.autoProperties = this.schema.properties.filter((p) => p.type !== PropertyType.Validation);
		}
		return this.autoProperties;
	}

	protected abstract getPropertyNamesFromInput(input: TInput): string[];

	protected abstract getNextRecord(input: TInput, index: number): Nullable<TRecord>;

	protected abstract getValue(record: TRecord, propertyName: string): string;

	protected abstract addOutputRecord(output: TOutput, values: string[]): void;
}
