import { Method, Handler } from "../_interfaces";
import { Methods } from "./methods";
import { Router } from "./index";
import { CallStack } from "./callStack";

export class Layer {
	protected _root: Methods = new Methods();
	protected _any: Methods = new Methods();

	protected _subLayers: Map<string, Layer> = new Map();

	public callSubStack(subLayers: string[], method: Method, stack: CallStack = new CallStack()): void {
		this.callStack("_any", method, stack);

		if (subLayers.length === 0) this.callStack("_root", method, stack);

		const sub = subLayers.shift();
		if (!sub) {
			stack.run();
			return;
		} else {
			const subLayer = this._subLayers.get(sub) as Router;
			if (!subLayer) return stack.run();
			subLayer.callSubStack(subLayers, method, stack);
		}
	}

	protected set(method: Method, path: string[], handler: Handler): void {
		const first = path.shift();

		if (!first) this._root[method].add(handler);
		else if (first === "*") this._any[method].add(handler);
		else {
			const sub = this._subLayers.get(first);
			if (!sub) {
				const router = new Router();
				this._subLayers.set(first, router);
				router.set(method, path, handler);
			} else sub.set(method, path, handler);
		}
	}

	private callStack(type: string, method: Method, stack: CallStack): void {
		const set = this[type][method] as Set<Handler>;
		set.forEach(
			(h: Handler): void => {
				stack.add(h);
			}
		);
	}
}
