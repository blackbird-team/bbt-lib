import http2, { ClientHttp2Session } from "http2";
import { readFileSync } from "fs";

export default async (protocol: "http" | "https", port: number, path: string): Promise<{}> =>
	new Promise(
		(resolve: (data: string) => void): void => {
			let client: ClientHttp2Session;
			if (protocol === "https") {
				const ca = readFileSync("config/cert/localhost-cert.pem");
				client = http2.connect(
					`${protocol}://localhost:${port}`,
					{ ca }
				);
			} else client = http2.connect(`${protocol}://localhost:${port}`);

			const req = client.request({ ":path": path });

			req.setEncoding("utf8");
			let data = "";
			req.on(
				"data",
				(chunk: string): void => {
					data += chunk;
				}
			);
			req.on(
				"end",
				(): void => {
					resolve(data);
					client.close();
				}
			);
			req.end();
		}
	);
