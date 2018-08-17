import http from "http";

declare class FS {
	public static openFile(filePath: string): Promise<number | never>;
	public static closeFile(fd: number): Promise<{} | never>;
	public static createDir(fullpath: string): Promise<void | never>
}

declare class Request {
	public static get(_OPTIONS: http.RequestOptions, checkLength?: boolean): Promise<string | never> 
	public static getJson(_OPTIONS: http.RequestOptions, checkLength?: boolean): Promise<object | never> 
	public static getResponse(_OPTIONS: http.RequestOptions): Promise<http.IncomingMessage | never> 
}