module.exports = {
	preset: '@vue/cli-plugin-unit-jest',
	transform: {
		'^.+\\.vue$': 'vue-jest'
	},
	testMatch: [
		"**/tests/**/*.test.[jt]s?(x)",
		"**/tests/**/*.spec.[jt]s?(x)",
	]
}
