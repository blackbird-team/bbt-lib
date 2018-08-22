import { ServerHttp2Stream, IncomingHttpHeaders } from "http2";
import { FS } from "./../../fs";

export default (urlpath: string, dirpath: string, stream: ServerHttp2Stream, headers: IncomingHttpHeaders): void => {
	const getpath: string = headers[":path"] || "";
	const path = dirpath + getpath.split(urlpath)[1];

	FS.openFile(process.cwd() + path, "r")
		.then(
			(fd: number): void => {
				stream.respondWithFD(fd);
			}
		)
		.catch(
			(err: Error): void => {
				if (err.message === "ENOENT") stream.respond({ ":status": 404 });
				else stream.respond({ ":status": 500 });
				console.log(err.message);
			}
		);
};
