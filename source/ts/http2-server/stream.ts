import { ServerHttp2Stream, IncomingHttpHeaders, OutgoingHttpHeaders } from "http2";
import { Router } from "./router";

export class Stream {
	private readonly stream: ServerHttp2Stream;
	private readonly headers: IncomingHttpHeaders;
	private readonly flags: number;

	private data: string | Buffer;

	constructor(stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) {
		this.stream = stream;
		this.headers = headers;
		this.flags = flags;

		new Router(stream, headers, this.headers[":method"], this.headers[":path"]);

		this.handlers();
	}

	public static handler(stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number): Stream {
		const streamObject = new Stream(stream, headers, flags);
		return streamObject;
	}

	public getData(): string | Buffer {
		return this.data;
	}

	private handlers(): void {
		this.stream.on("error", this.onError.bind(this));

		this.data = "";
		this.stream.on("data", this.onData.bind(this));
	}

	private onData(chunk: string): void {
		this.data += chunk;
		console.log(`received: ${chunk}`);
	}

	private onError(err: Error): void {
		console.log(`Stream error: ${err.message}`);
	}
}

export default Stream.handler;
