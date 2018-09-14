import router, { Router } from "./../../../source/ts/server/router";
import { Method } from "../../../source/ts/server/_interfaces";

type fv = () => void;
const handler = (desc: string, done: fv): ((stream: any, next: fv) => void) => (stream: any, next: fv): void => {
	// -- console.log(desc);
	done();
	next();
};

describe("Router case", () => {
	it("get instance as default import", (): void => {
		expect(router).toBeInstanceOf(Router);
	});

	it("set root handler", (done: fv): void => {
		router.get("/", handler("/", done));
		router.callSubStack([], Method.GET);
	});

	it("set * handler", (done: fv): void => {
		router.get("/*", handler("/*", done));
		router.callSubStack(["sub"], Method.GET);
	});

	it("call sub layer root", (done: fv): void => {
		router.get("/sub-layer", handler("/sub-layer", done));
		router.callSubStack(["sub-layer"], Method.GET);
	});

	it("call sub layer any", (done: fv): void => {
		router.get("/sub-layer/*", handler("/sub-layer/*", done));
		router.callSubStack(["sub-layer", "sub"], Method.GET);
	});

	it("call double sub layer root", (done: fv): void => {
		router.get("/sub-layer/sub-double", handler("/sub-layer/sub-double", done));
		router.callSubStack(["sub-layer", "sub-double"], Method.GET);
	});

	it("call triple sub layer any", (done: fv): void => {
		router.get("/sub-layer/sub-double/sub-triple/*", handler("/sub-layer/sub-double/sub-triple/*", done));
		router.callSubStack(["sub-layer", "sub-double", "sub-triple", "sub"], Method.GET);
	});
});
