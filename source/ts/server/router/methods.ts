import { Method, Handler } from "../_interfaces";

export class Methods {
	public readonly [Method.GET]: Set<Handler> = new Set();
	public readonly [Method.HEAD]: Set<Handler> = new Set();
	public readonly [Method.POST]: Set<Handler> = new Set();
	public readonly [Method.PUT]: Set<Handler> = new Set();
	public readonly [Method.DELETE]: Set<Handler> = new Set();
	public readonly [Method.CONNECT]: Set<Handler> = new Set();
	public readonly [Method.OPTIONS]: Set<Handler> = new Set();
	public readonly [Method.TRACE]: Set<Handler> = new Set();
	public readonly [Method.PATCH]: Set<Handler> = new Set();

	public add(method: Method, handler: Handler): void {
		this[method].add(handler);
	}

	public remove(method: Method, handler: Handler): void {
		this[method].delete(handler);
	}

	public clear(method: Method): void {
		this[method].clear();
	}
}
