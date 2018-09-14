import Parser from "../../parser";
import { Method, Handler } from "./../_interfaces";
import { Layer } from "./layer";

interface IRouter {
	get(path: string, cb: Handler): void;
	post(path: string, cb: Handler): void;
	put(path: string, cb: Handler): void;
	options(path: string, cb: Handler): void;
	delete(path: string, cb: Handler): void;
}

export class Router extends Layer implements IRouter {
	constructor() {
		super();

		/*
		// for (const method in Method)
		// 	this[method] = (path: string, cb: Handler): void => {
		// 		const parsed = Parser.pathFromUrl(path);
		// 		this.set(Method[Method[method]], parsed.path, cb);
		// 	};
		*/
	}

	public static getInstance(): Router {
		return new Router();
	}

	public use(): void {
		// Middleware
	}

	public get(path: string, cb: Handler): void {
		this.set(Method.GET, this.pathParse(path), cb);
	}

	public post(path: string, cb: Handler): void {
		this.set(Method.POST, this.pathParse(path), cb);
	}

	public put(path: string, cb: Handler): void {
		this.set(Method.PUT, this.pathParse(path), cb);
	}

	public options(path: string, cb: Handler): void {
		this.set(Method.OPTIONS, this.pathParse(path), cb);
	}

	public delete(path: string, cb: Handler): void {
		this.set(Method.DELETE, this.pathParse(path), cb);
	}

	private pathParse(path: string): string[] {
		return Parser.pathFromUrl(path).path;
	}
}

export default Router.getInstance();
