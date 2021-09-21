const DB = require("./DB.cjs");
const bcrypt = require("bcrypt");
const db = new DB();

const connection = db.cn();
let user_data = {};
let error_message = "";
let result = {};

const Register = async (data) => {
	let name = data.name;
	let email = data.email;
	let new_pass = data.new_pass;
	let pass_confirm = data.pass_confirm;
	if (name == "") error_message = "Please include your name";
	else if (email == "") error_message = "Please include your email";
	else if (new_pass == "" || pass_confirm == "")
		error_message = "Password is required";
	else if (new_pass != pass_confirm)
		error_message = "Your passwords do not match.";
	else {
		let existingUser = await getUserByEmail(email);
		if (existingUser.length == 1)
			error_message = "Account already exists. Please login.";
		else {
			bcrypt.hash(new_pass, 10, (err, hash) => {
				// console.log(hash);
				new Promise((resolve, reject) => {
					connection.query(
						"INSERT INTO `user` (`name`, `email`, `password`) values (?,?,?)",
						[name, email, hash],
						(err, res) => {
							// console.log(res);
							error_message = "success";
						}
					);
				});
			});
		}
	}
	return {
		error: error_message,
		result,
	};
};
// return user if exists
checker = (email) => {
	getUserByEmail(email).then(async (rows) => {
		xx = rows;
	});
};
getUserByEmail = async (email) => {
	return await new Promise((resolve, reject) => {
		connection.query(
			"SELECT * FROM `user` WHERE `email` = ?",
			[email],
			(err, rows) => {
				console.log(rows);
				if (err) reject(err);
				else resolve(rows);
			}
		);
	});
};
module.exports = { Register, getUserByEmail, checker };
