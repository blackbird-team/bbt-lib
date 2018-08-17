import mongoose from "mongoose";

export interface IOptions {
	host?: string;
	port?: number;
	options?: mongoose.ConnectionOptions;
}

const _HOST_DEFAULT: string = "localhost";
const _PORT_DEFAULT: number = 27017;

const _OPTIONS_DEFAULT: mongoose.ConnectionOptions = {
	useNewUrlParser: true,
	poolSize: 10
};

export default class MongoConnector {
	private readonly db: { [s: string]: mongoose.Connection };
	private readonly host: string;
	private readonly port: number;
	private readonly options: mongoose.ConnectionOptions;

	constructor(options?: IOptions) {
		this.host = options ? options.host || _HOST_DEFAULT : _HOST_DEFAULT;
		this.port = options ? options.port || _PORT_DEFAULT : _PORT_DEFAULT;
		this.options = this.parseOptions(options ? options.options || {} : {});
		this.db = {};
	}

	public getConn(db: string): mongoose.Connection | never {
		try {
			if (typeof this.db[db] === "undefined") this.initConn([db]);
		} catch (err) {
			throw err;
		}

		return this.db[db];
	}

	private initConn(dbList: string[]): void | never {
		try {
			const host = `mongodb://${this.host}:${this.port}/`;
			for (const db of dbList) this.db[db] = mongoose.createConnection(`${host}${db}`, this.options);
		} catch (err) {
			if (err instanceof mongoose.Error) console.log(err.message);
			throw err;
		}
	}

	private parseOptions(options: mongoose.ConnectionOptions): mongoose.ConnectionOptions {
		for (const field in _OPTIONS_DEFAULT) {
			const f = _OPTIONS_DEFAULT[field];
			if (!options[field]) options[field] = f;
			else for (const row in f) if (!options[field][row]) options[field][row] = f[row];
		}

		return options;
	}
}
