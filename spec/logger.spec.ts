import Logger from "./../source/ts/logger";

describe("Logger service case", (): void => {
	it("simple log", () => {
		Logger.log(`Simple log`, `sync-module`);
		expect(1).toEqual(1);
	});
});
