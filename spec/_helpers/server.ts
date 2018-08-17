import http, { Server, IncomingMessage, ServerResponse } from "http";

export const _PORT = 3000;
export const _MESSAGE = "Hello";
export const _JSON = { data: true };
export const _NOT_FOUND = 404;

export const startServer: () => Promise<Server> = (): Promise<Server> =>
	new Promise(
		(resolve: (server: Server) => void): void => {
			const server: Server = http.createServer(
				(req: IncomingMessage, res: ServerResponse): void => {
					if (req.url === "/") res.end(_MESSAGE);
					else if (req.url === "/json") res.end(JSON.stringify(_JSON));
					else res.end(_NOT_FOUND);
				}
			);

			server.listen(
				_PORT,
				"localhost",
				(): void => {
					resolve(server);
				}
			);
		}
	);
