module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+\\.ts?$": "ts-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
	moduleFileExtensions: ["ts", "js", "json"]
};
