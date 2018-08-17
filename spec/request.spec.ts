import { Server, IncomingMessage } from "http";
import { startServer, _PORT, _MESSAGE } from "./_helpers/server";
import { Request } from "./../source/ts/request";

describe("Request handler case", (): void => {
	let server: Server;

	beforeAll(async () => {
		server = await startServer();
	});

	afterAll(async () => {
		await server.close();
		server = null;
	});

	it("Google.com request", async () => {
		const res = await Request.get({
			protocol: "http:",
			host: "google.com"
		});

		expect(typeof res).toBe("string");
	});

	it("request from Helper Server", async () => {
		const res = await Request.get({
			protocol: "http:",
			host: "localhost",
			port: _PORT
		});

		expect(res).toBe(_MESSAGE);
	});

	it("get json request from Helper Server", async () => {
		const res = await Request.getJson({
			protocol: "http:",
			host: "localhost",
			port: _PORT,
			path: "/json"
		}) as { [key: string]: boolean };

		expect(res.data).not.toBeUndefined();
		expect(res.data).toBeTruthy();
	});

	it("get response stream from Helper Server", async () => {
		const res = await Request.getResponse({
			protocol: "http:",
			host: "localhost",
			port: _PORT,
			path: "/json"
		});

		expect(res).toBeInstanceOf(IncomingMessage);

		res.destroy();
	});
});
