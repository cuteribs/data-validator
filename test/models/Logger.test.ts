import { Logger } from '../../src/models/Logger';
import { Severity } from '../../src/models/Severity';

describe('LogError', () => {
	it('Adds error entry to list', () => {
		// Arrange
		const logger = new Logger();
		const message = 'Error message';

		// Act
		logger.logError(message);

		// Assert
		const entry = logger.entries[0];
		expect(entry).not.toBeNull();
		expect(entry.severity).toBe(Severity.Error);
		expect(entry.message).toBe(message);
	});
});

describe('LogWarning', () => {
	it('Adds warning entry to list', () => {
		// Arrange
		const logger = new Logger();
		const message = 'Warning message';

		// Act
		logger.logWarning(message);

		// Assert
		const entry = logger.entries[0];
		expect(entry).not.toBeNull();
		expect(entry.severity).toBe(Severity.Warning);
		expect(entry.message).toBe(message);
	});
});

describe('Log', () => {
	it('Adds entry to list', () => {
		// Arrange
		const logger = new Logger();
		const severity = Severity.Fallback;
		const message = 'Fallback message';

		// Act
		logger.log(severity, message);

		// Assert
		let entry = logger.entries[0];
		expect(entry).not.toBeNull();
		expect(entry.severity).toBe(severity);
		expect(entry.message).toBe(message);

		logger.log(Severity.Error, 'Error message', 'Property', 1, 'Rule', 'Value', { key: 'value' });
		entry = logger.entries[1];
		expect(entry).not.toBeNull();
		expect(entry.severity).toBe(Severity.Error);
		expect(entry.message).toBe('Error message');
		const args = entry.args;
		expect(args['property']).toBe('Property');
		expect(args['recordNumber']).toBe(1);
		expect(args['rule']).toBe('Rule');
		expect(args['value']).toBe('Value');
		expect(args['key']).toBe('value');
	});
});
