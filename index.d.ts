declare class FS {
	public static openFile(filePath: string): Promise<number | never>;
	public static closeFile(fd: number): Promise<{} | never>;
	public static createDir(fullpath: string): Promise<void | never>
}