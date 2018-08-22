import fs from "fs";
import path from "path";

export class FS {
	public static async openFile(filePath: string, flags: string | number = "w"): Promise<number | never> {
		return new Promise(
			async (resolve: (fd: number) => void, reject: (err: NodeJS.ErrnoException) => void): Promise<void> => {
				const current = process.cwd();
				const fullpath = path.relative(current, filePath);

				const dirname = path.dirname(fullpath);
				if (flags === "w") await this.createDir(dirname);

				fs.open(
					fullpath,
					flags,
					(err: NodeJS.ErrnoException | null, fd: number): void => {
						if (err) reject(err);
						else resolve(fd);
					}
				);
			}
		);
	}

	public static async closeFile(fd: number): Promise<{} | never> {
		return new Promise(
			(resolve: () => void, reject: (err: NodeJS.ErrnoException) => void): void => {
				fs.close(
					fd,
					(err: NodeJS.ErrnoException | null): void => {
						if (err) reject(err);
						else resolve();
					}
				);
			}
		);
	}

	public static async createDir(fullpath: string): Promise<void | never> {
		let current = process.cwd();

		const dirname = path.relative(current, fullpath);
		const dirs = dirname.split(/\/|\/\/|\\/g);

		for (const dir of dirs) {
			current += "/" + dir;
			await this.mkdir(current);
		}
	}

	private static async mkdir(dirname: string): Promise<{} | NodeJS.ErrnoException> {
		return new Promise(
			(resolve: () => void, reject: (err: NodeJS.ErrnoException) => void): void => {
				const cb = (err: NodeJS.ErrnoException | null): void => {
					if (err && err.code !== "EEXIST") reject(err);
					else if (err === null || err.code === "EEXIST") {
						resolve();
						return;
					}
				};

				fs.mkdir(dirname, cb);
			}
		);
	}
}
