const bcrypt = require("bcrypt");
const DB = require("./DB.cjs");

hash = async (string) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(string, 10, (err, hash) => {
			if (err) reject(err);
			else resolve(hash);
		});
	});
};
hash_verify = async (string, hash) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(string, hash, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		});
	});
};
Query = async (sql, params) => {
	const database = new DB();
	const con = database.cn();
	return new Promise((resolve, reject) => {
		con.query(sql, params, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		});
	});
};

module.exports = { hash, Query, hash_verify };
