import { ServerHttp2Stream, OutgoingHttpHeaders, IncomingHttpHeaders } from "http2";
import Parser, { IPath } from "./../parser";
import Files from "./middleware/static-files";

interface ILayers {
	get: IMethodLayer;
	post: IMethodLayer;
}

interface IMethodLayer {
	[key: string]: ILayer | IMethodLayer;
}

interface ILayer {
	__handlers: LayerHandler[];
}

type LayerHandler = (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => void;

interface IStatic {
	[key: string]: typeof Files;
}

/* Example
const example: ILayers = {
	get: {
		"": {
			__handlers: [],
			section: {
				__handlers: [],
				page: {
					__handlers: []
				}
			}
		}
	}
};
*/

export class Router {
	private static readonly _layers: ILayers = { get: { "": { __handlers: [] } }, post: { "": { __handlers: [] } } };
	private static readonly _static: IStatic = {};

	private readonly _stream: ServerHttp2Stream;
	private readonly _method: string;
	private readonly _origin: string;
	private readonly _parsed: IPath;

	constructor(stream: ServerHttp2Stream, headers: IncomingHttpHeaders, method: string = "get", path: string = "") {
		this._stream = stream;
		this._method = method;
		this._origin = path;
		this._parsed = Parser.pathFromUrl(path);

		try {
			for (const s in Router._static)
				if (this._origin.startsWith(s)) {
					Router._static[s].call(null, this._stream, headers);
					return;
				}
		} catch (err) {
			console.log(err.message);
		}

		try {
			let layer = Router._layers[this._method][""] as ILayer;
			for (const l of this._parsed.path) {
				if (typeof layer[l] === "undefined") continue;
				layer = layer[l];
			}

			for (const cb of layer.__handlers) cb.call(null, this._stream, headers);

			return;
		} catch (err) {
			console.log(err.message);
		}

		this._stream.respond(
			{
				":status": 404
			}
		);

		this._stream.end("<h1 style='margin: 50px 100px'>Not found</h1>");
	}

	public static get(path: string, cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => void): void {
		Router.setHandler("get", path, cb);
	}

	public static post(path: string, cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => void): void {
		Router.setHandler("post", path, cb);
	}

	public static static(pathurl: string, dirpath: string): void {
		Router._static[pathurl] = Files.bind(null, pathurl, dirpath);
	}

	public static reset(): void {
		Router._layers[""] = { __handlers: [] };
	}

	private static setHandler(
		method: string,
		path: string,
		cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) => void
	): void {
		const parsed = Parser.pathFromUrl(path);
		try {
			let layer: ILayer = Router._layers[method][""] as ILayer;
			for (const l of parsed.path) {
				if (l === "") continue;
				if (typeof layer[l] === "undefined") layer[l] = { __handlers: [] };
				layer = layer[l];
			}

			layer.__handlers.push(cb);
		} catch (err) {
			console.log(err.message);
		}
	}
}
