const DB = require("./DB.cjs");
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
