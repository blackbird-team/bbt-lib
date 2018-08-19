import { ServerHttp2Stream, OutgoingHttpHeaders } from "http2";
import Parser, { IPath } from "./../parser";

interface ILayers {
	[key: string]: ILayer | ILayers;
}

interface ILayer {
	__handlers: LayerHandler[];
}

type LayerHandler = (stream?: ServerHttp2Stream) => void;

const example: ILayers = {
	"": {
		__handlers: [],
		section: {
			__handlers: [],
			page: {
				__handlers: []
			}
		}
	}
};

export class Router {
	private static readonly _layers: ILayers = { "": { __handlers: [] } };

	private readonly _stream: ServerHttp2Stream;
	private readonly _method: string;
	private readonly _origin: string;
	private readonly _parsed: IPath;

	constructor(stream: ServerHttp2Stream, method: string = "get", path: string = "") {
		this._stream = stream;
		this._method = method;
		this._origin = path;
		this._parsed = Parser.pathFromUrl(path);

		try {
			let layer = Router._layers[""] as ILayer;
			for (const l of this._parsed.path) {
				if (typeof layer[l] === "undefined") continue;
				layer = layer[l];
			}

			for (const cb of layer.__handlers) cb.call(null, this._stream);

			return;
		} catch (err) {
			console.log(err.message);
		}

		this._stream.respond(
			{
				"content-type": "text/html",
				":status": 200,
				"access-control-allow-origin": "*",
				"access-control-allow-headers": "content-type"
			},
			{
				endStream: false, // Default
				getTrailers: (trailers: OutgoingHttpHeaders): void => {
					console.log("Trailers", trailers);
				}
			}
		);

		this._stream.end("<h1>Hello World</h1>");
	}

	public static get(path: string, cb: (stream?: ServerHttp2Stream) => void): void {
		const parsed = Parser.pathFromUrl(path);
		try {
			let layer: ILayer = Router._layers[""] as ILayer;
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

	public static reset(): void {
		Router._layers[""] = { __handlers: [] };
	}
}
