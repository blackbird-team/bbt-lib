import fs from "fs";
import { FS } from "./../source/ts/fs";

const check = (path: string, file: boolean = false): void => {
	try {
		if (file) fs.unlinkSync(__dirname + path);
		else fs.rmdirSync(__dirname + path);
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
};

const clearUp = (): void => {
	check("/test/test2");
	check("/test");
	check("/test.txt", true);
	check("/ww/test.txt", true);
	check("/ww");
};

describe("File System service test case", () => {
	beforeEach(clearUp);
	afterAll(clearUp);

	it("create folder", async () => {
		const dir = __dirname + "/test";

		expect(() => fs.statSync(dir)).toThrow();

		await FS.createDir(dir);
		expect(fs.statSync(dir).isDirectory()).toBeTruthy();
	});

	it("create recursive folders", async () => {
		const dir = __dirname + "/test/test2";

		expect(() => fs.statSync(dir)).toThrow();

		await FS.createDir(dir);
		expect(fs.statSync(dir).isDirectory()).toBeTruthy();
	});

	it("open file with create", async () => {
		const file = __dirname + "/test.txt";

		expect(() => fs.statSync(file)).toThrow();

		const fd = await FS.openFile(file);
		expect(fs.statSync(file).isFile()).toBeTruthy();
		fs.closeSync(fd);
	});

	it("open file with create dir", async () => {
		const file = __dirname + "/ww/test.txt";

		expect(() => fs.statSync(file)).toThrow();

		const fd = await FS.openFile(file);
		expect(fs.statSync(file).isFile()).toBeTruthy();
		fs.closeSync(fd);
	});

	xit("close file", () => {
		// Close file
	});
});
