import { parse } from "url";
import { parse as querystring } from "querystring";

export interface IPath {
	path: string[];
	ext: string | undefined;
	params: { [key: string]: string | string[] | undefined };
}

export default class Parser {
	public static localeNow(): string {
		const d = new Date();
		return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
	}

	public static pathFromUrl(url: string): IPath {
		const parsed = parse(url);
		const { pathname, query } = parsed;
		const pathAndExt = (pathname && pathname.substr(1).split(".")) || "";
		const [pathArr, ext] = pathAndExt.length > 0 ? [pathAndExt[0], pathAndExt[1]] : ["", ""];
		const path = pathArr.split("/");
		const params = querystring(query || "");
		return { path, ext, params };
	}
}
