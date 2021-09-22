require("dotenv").config();
const DB = require("./DB.cjs");
const jwt = require("jsonwebtoken");
const conf = require("./config.cjs");
const bcrypt = require("bcrypt");
const { response } = require("express");
const db = new DB();

const connection = db.cn();
// console.log(connection);
let user_data = {};
let msg = "";
let message = "";
let result = {};
let token = "";

const Signin = async (data) => {
	// console.log(data);
	let email = data.email;
	let password = data.password;
	if (email == "") message = "Please include your email address.";
	else if (password == "") message = "Your password is required.";
	else {
		let userRecord = await getUserByEmail(email);
		if (userRecord.length == 0)
			message = "Your email looks incorrect. Try again.";
		else {
			let hash_verify = await conf.hash_verify(
				password,
				userRecord[0].password
			);
			if (!hash_verify) message = "Your password is incorrect.";
			else {
				// console.log(process.env);
				// CREATING JSON WEB TOKEN
				const userId = userRecord[0].id;
				const email = userRecord[0].email;
				token = jwt.sign(
					{ userId, email },
					process.env.ACCESS_TOKEN_SECRET
				);
				// console.log(token);
				message = "ok";
			}
		}
	}
	return {
		msg: message,
		token,
	};
};

const Register = async (data) => {
	let name = data.name;
	let email = data.email;
	let new_pass = data.new_pass;
	let pass_confirm = data.pass_confirm;
	if (name == "") message = "Please include your name";
	else if (email == "") message = "Please include your email";
	else if (new_pass == "" || pass_confirm == "")
		message = "Password is required";
	else if (new_pass != pass_confirm) message = "Your passwords do not match.";
	else {
		let existingUser = await getUserByEmail(email);
		if (existingUser.length > 0) {
			message = "Account already exists. Please login.";
		} else {
			let hashed_pass = await conf.hash(new_pass);
			let sql =
				"INSERT INTO `user` (`name`, `email`, `password`) values (?,?,?)";
			let query = await conf.Query(sql, [name, email, hashed_pass]);
			console.log(query);
			message = "ok";
		}
	}
	return {
		msg: message,
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
				// console.log(rows);
				if (err) reject(err);
				else resolve(rows);
			}
		);
	});
};
tokenAuth = async (req, res, next) => {
	const header = req.headers["authorization"];
	const token = header && header.split(" ")[1];
	if (token == null) res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) res.sendStatus(403);
		req.user = user;
		next();
	});
};
module.exports = { Register, getUserByEmail, checker, Signin, tokenAuth };
