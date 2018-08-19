import Parser from "./../source/ts/parser";

describe("Parser service case", (): void => {
	xit("parse locale time", () => {
		const now = Parser.localeNow();
		expect(typeof now).toBe("string");
	});

	it("parse url", () => {
		const url = "/section/page.html?primary=1&secondary=34";
		const parsed = Parser.pathFromUrl(url);

		expect(parsed.ext).toBe("html");
		expect(parsed.params.primary).toBe("1");
		expect(parsed.params.secondary).toBe("34");
		expect(parsed.path[0]).toBe("section");
		expect(parsed.path[1]).toBe("page");
	});
});
