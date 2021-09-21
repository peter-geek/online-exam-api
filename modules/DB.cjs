const mysql = require("mysql");

class DB {
	// this.con = {};
	constructor() {
		this.con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "exam",
			port: 33067,
		});
		this.con.connect((err) => {
			if (err) throw err;
			// console.log("Connected");
		});
	}
	cn() {
		// console.log(this.con);
		return this.con;
	}
	db_query(sql, params) {
		con.query(sql, params);
	}
}
module.exports = DB;
