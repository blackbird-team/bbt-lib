import {
	createSecureServer,
	createServer,
	Http2SecureServer,
	ServerHttp2Stream,
	Http2Server,
	IncomingHttpHeaders
} from "http2";
import { readFileSync } from "fs";

import { Router } from "./router";
import Stream from "./stream";
import Request from "./request";

const _DEFAULT_PORT = 3000;
const _DEFAULT_HOST = "localhost";

const errorHandler = (type: "server" | "session", err: Error): void => {
	console.log(`${type} error \r\n${err.message}`);
};

export class Server {
	private readonly http2: Http2SecureServer | Http2Server;
	private readonly port: number;

	constructor(port: number = _DEFAULT_PORT, secure?: { cert: string; key: string }) {
		this.port = port;
		if (secure) {
			const cert = readFileSync(secure.cert);
			const key = readFileSync(secure.key);

			this.http2 = createSecureServer({ cert, key });
		} else this.http2 = createServer({ allowHTTP1: true });
	}

	public static init(port: number, cert?: { cert: string; key: string }): Server {
		const server = new Server(port, cert);
		return server;
	}

	public async start(): Promise<{}> {
		this.handlers();

		return new Promise(
			(resolve: () => void): void => {
				this.http2.listen(this.port, _DEFAULT_HOST, resolve);
			}
		);
	}

	public async close(): Promise<{}> {
		return new Promise(
			(resolve: () => void): void => {
				this.http2.close(resolve);
			}
		);
	}

	public get(path: string, cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => void): void {
		Router.get(path, cb);
	}

	public post(path: string, cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => void): void {
		Router.post(path, cb);
	}

	public static(urlpath: string, dirpath: string): void {
		Router.static(urlpath, dirpath);
	}

	private handlers(): void {
		Router.reset();

		this.http2.on("error", errorHandler.bind(null, "server"));
		this.http2.on("request", Request);
		this.http2.on("stream", Stream);
		this.http2.on("sessionError", errorHandler.bind(null, "session"));
	}
}
