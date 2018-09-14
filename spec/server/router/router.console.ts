import router, { Router } from "./../../../source/ts/server/router";
import { Method } from "./../../../source/ts/server/_interfaces";

type fv = () => void;
const handler = (desc: string): ((stream: any, next: fv) => void) => (stream: any, next: fv): void => {
	console.log(desc);
	next();
};

router.get("/", handler("/"));
router.get("/*", handler("/*"));
router.get("/sub-layer", handler("/sub-layer"));
router.get("/sub-layer/*", handler("/sub-layer/*"));
router.get("/sub-layer/sub-double/", handler("/sub-layer/sub-double"));
router.get("/sub-layer/sub-double/*", handler("/sub-layer/sub-double*"));
router.get("/sub-layer/sub-double/sub-triple/*", handler("/sub-layer/sub-double/sub-triple/*"));

console.log("----------> /");
router.callSubStack([], Method.GET);

console.log("----------> /sub-layer");
router.callSubStack(["sub-layer"], Method.GET);

console.log("----------> /sub-layer/sub-double");
router.callSubStack(["sub-layer", "sub-double"], Method.GET);

console.log("----------> /sub-layer/sub-double/sub-triple/*");
router.callSubStack(["sub-layer", "sub-double", "sub-triple", "sub"], Method.GET);
