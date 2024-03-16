import type { JestConfigWithTsJest } from 'ts-jest';

export default (): JestConfigWithTsJest => {
	return {
		rootDir: '.',
		preset: 'ts-jest',
		testEnvironment: 'node',
		testRegex: '.*\\.spec\\.ts$',
		collectCoverage: false,
		collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
		coverageDirectory: '<rootDir>/coverage',
		passWithNoTests: true,
		verbose: true,
	};
};
