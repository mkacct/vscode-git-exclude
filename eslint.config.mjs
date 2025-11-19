import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [{
	files: ["**/*.ts"]
}, {
	plugins: {
		"@typescript-eslint": typescriptEslint
	},

	languageOptions: {
		parser: tsParser,
		ecmaVersion: 2022,
		sourceType: "module"
	},

	rules: {
		"@typescript-eslint/naming-convention": ["warn", {
			selector: "import",
			format: ["camelCase", "PascalCase"],
		}],
		"eqeqeq": ["error", "always"],
		"@typescript-eslint/explicit-member-accessibility": "error",
		"no-unused-private-class-members": "warn",
		"@typescript-eslint/no-empty-object-type": "warn",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-unused-vars": ["warn", {
			argsIgnorePattern: "^_",
			destructuredArrayIgnorePattern: "^_"
		}],
		"curly": "warn",
		"no-throw-literal": "warn",
		"semi": "warn"
	}
}];
