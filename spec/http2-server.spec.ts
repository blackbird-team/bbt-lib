import { ServerHttp2Stream } from "http2";
import { Server } from "./../source/ts/http2-server";
import Request from "./_helpers/http2-request";
import { readFileSync } from "fs";

const _PORT = 45000;

const handler = (res: string): ((stream: ServerHttp2Stream) => void) => (stream: ServerHttp2Stream): void => {
	stream.end(res);
};

describe("Server http2 case", (): void => {
	let server: Server;

	afterAll(async (): Promise<void> => {
		await server.close();
	});

	it("start", (done: () => void) => {
		server = new Server(_PORT);
		server.start().then(done);
	});

	it("get index", async (): Promise<void> => {
		const response = "hello";
		server.get("/", handler(response));

		const res = await Request("http", _PORT, "/");
		expect(res).toEqual(response);
	});

	it("get section", async (): Promise<void> => {
		const response = "section";
		server.get("/section", handler(response));

		const res = await Request("http", _PORT, "/section");
		expect(res).toEqual(response);
	});

	it("close", (done: () => void) => {
		server.close().then(done);
	});

	it("start secure server", (done: () => void) => {
		const key = "config/cert/localhost-privkey.pem";
		const cert = "config/cert/localhost-cert.pem";

		server = new Server(_PORT, { key, cert });
		server.start().then(done);
	});

	it("get secure index", async (): Promise<void> => {
		const response = "hello";
		server.get("/", handler(response));

		const res = await Request("https", _PORT, "/");
		expect(res).toEqual(response);
	});

	it("post secure index", async (): Promise<void> => {
		const response = "helloPost";
		server.post("/", handler(response));

		const res = await Request("https", _PORT, "/", "post");
		expect(res).toEqual(response);
	});

	it("get secure file", async (): Promise<void> => {
		const path = "/index.html";
		server.static("/blabla/", "/spec/_helpers/");

		const res = await Request("https", _PORT, `/blabla${path}`);
		const file = readFileSync(process.cwd() + `/spec/_helpers${path}`);
		expect(res).toEqual(file.toString());
	});
});
