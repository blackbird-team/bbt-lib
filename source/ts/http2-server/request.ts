import { Http2ServerResponse, Http2ServerRequest } from "http2";

const _STATUS_SUCCESS = 200;

export default (req: Http2ServerRequest, res: Http2ServerResponse): void => {
	if (req.httpVersion === "2.0") return;
	res.writeHead(_STATUS_SUCCESS, { "content-type": "application/json" });
	res.end(
		JSON.stringify({
			httpVersion: req.httpVersion
		})
	);
	req.on(
		"aborted",
		(hadError: boolean, code: number): void => {
			console.log(`request eborted with error?: ${hadError}; code: ${code}`);
		}
	);

	res.on(
		"error",
		(err: Error): void => {
			console.log(`response error: ${err.message}`);
		}
	);

	console.log("get request");

	res.end("by");
};
