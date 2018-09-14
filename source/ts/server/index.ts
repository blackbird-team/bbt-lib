import { createSecureServer, createServer, Http2SecureServer, Http2Server } from "http2";
import { readFileSync } from "fs";

import { ErrorScope, ErrorHandler } from "./_interfaces";
import { Router } from "./router";
import Stream from "./stream";
// import Request from "./request";

const _DEFAULT_PORT = 3000;
const _DEFAULT_HOST = "localhost";

const errorHandlerDefault: ErrorHandler = (scope: ErrorScope, err: Error): void => {
	console.log(`${ErrorScope[scope]} error \r\n${err.message}`);
};

export class Server extends Router {
	private readonly http2: Http2SecureServer | Http2Server;
	private readonly port: number;

	constructor(port: number = _DEFAULT_PORT, secure?: { cert: string; key: string }) {
		super();
		this.port = port;
		if (secure) {
			const cert = readFileSync(secure.cert);
			const key = readFileSync(secure.key);

			this.http2 = createSecureServer({ cert, key });
		} else this.http2 = createServer({ allowHTTP1: true });
	}

	public static init(port: number, cert?: { cert: string; key: string }): Server {
		return new Server(port, cert);
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

	private handlers(): void {
		this.http2.on("error", errorHandlerDefault.bind(null, ErrorScope.SERVER));
		this.http2.on("sessionError", errorHandlerDefault.bind(null, ErrorScope.SESSION));
		// this.http2.on("request", Request);
		this.http2.on("stream", Stream);
	}
}
