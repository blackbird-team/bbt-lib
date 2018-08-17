import mongoose from "mongoose";
import MongoConnector from "./../source/ts/mongo";

describe("MongoConnector service case", (): void => {
	const db = new MongoConnector();

	let conn: mongoose.Connection;
	it("Connect without options", () => {
		conn = db.getConn("config");
		expect(conn).toBeInstanceOf(mongoose.Connection);
	});

	xit("Unexpected database name", () => {
		expect(
			(): void | never => {
				const d = db.getConn("!%34#");
			}
		).toThrowError();
	});

	it("Dooble connection", async () => {
		const conn2 = db.getConn("config");

		expect(conn).toBeInstanceOf(mongoose.Connection);
		expect(conn2).toBeInstanceOf(mongoose.Connection);
	});

	it("Close connection", async () => {
		const _CONN_READY = 2;
		expect(conn.readyState).toEqual(_CONN_READY);
		await conn.close();
		expect(conn.readyState).toEqual(0);
	});
});
