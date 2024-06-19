import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const exception = {
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
	}
};

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	exception
);
