import http from "http";
// -- import Logger from "./logger";

type TResolve = (data: string) => void;
type TReject = (err: Error) => void;

type TRequest = http.ClientRequest;
type TResponse = http.IncomingMessage;

export class Request {
	private rawData: string = "";
	private headers: http.IncomingHttpHeaders;

	public static async get(_OPTIONS: http.RequestOptions): Promise<string | never> {
		try {
			const request: Request = new Request();
			const data: string = await request._get(_OPTIONS);
			return data;
		} catch (err) {
			// Logger.error(err.message, "sync-module");
			throw err;
		}
	}

	public static async getJson(_OPTIONS: http.RequestOptions): Promise<object | never> {
		const data: string = await this.get(_OPTIONS);
		return JSON.parse(data);
	}

	public static async getResponse(_OPTIONS: http.RequestOptions): Promise<TResponse | never> {
		return new Promise(
			(resolve: (response: TResponse) => void, reject: TReject): void => {
				const req: TRequest = http.get(_OPTIONS);
				req.on("error", reject);
				req.on("response", resolve);
			}
		);
	}

	private async _get(_OPTIONS: http.RequestOptions): Promise<string> {
		return new Promise(
			(resolve: TResolve, reject: TReject): void => {
				const req: TRequest = http.get(_OPTIONS);
				req.on("response", this.responseHandler.bind(this, resolve, reject));
				req.on("error", this.errorHandler.bind(this, req, reject));
				req.on("close", this.closeHandler.bind(this));
			}
		);
	}

	private responseHandler(resolve: TResolve, reject: TReject, res: TResponse): void {
		res.setEncoding("utf8");
		this.headers = res.headers;

		res.on("data", this.onData.bind(this)).on("end", this.onEnd.bind(this, resolve, reject));
	}

	private onData(chunk: string): void {
		this.rawData += chunk;
	}

	private onEnd(resolve: TResolve, reject: TReject): void {
		const conlength = this.headers["content-length"];

		if (Number(conlength) !== this.rawData.length)
			reject(new Error(`Length did not match ${this.rawData.length}/${conlength}`));
		else resolve(this.rawData);
	}

	private errorHandler(req: TRequest, reject: TReject, err: Error): void {
		req.end((): void => reject(err));
	}

	private closeHandler(): void {
		console.log("close");
	}
}
