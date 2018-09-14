import { Handler } from "../_interfaces";

type StackItem = () => void;

export class CallStack {
	protected stack: StackItem[] = [(): void => { /* -- */ }];
	protected _pointer: number = 0;

	public get size(): number {
		return this.stack.length;
	}

	public add(handler: Handler): void {
		const next = (i: number): void => {
			if (i < 1) this.reset();
			handler(undefined, this.stack[i]);
		};

		this.stack.push(next.bind(this, this._pointer));
		this._pointer += 1;
	}

	public run(): void {
		this.stack[this._pointer]();
	}

	private reset(): void {
		this.stack = [(): void => { /* -- */ }];
		this._pointer = 0;
	}
}
