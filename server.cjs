const User = require("./modules/user.cjs");

const express = require("express");
const app = express();

app.use((req, res, next) => {
	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.get("/login", (req, res) => {
	res.json({ txt: "Hello" });
});
app.use(express.json());
app.post("/signup", async (req, res) => {
	let error_message = "";
	const body = req.body;
	// const u = new User();
	User.Register(body)
		.then((data) => {
			// console.log(data);
			res.json(data);
		})
		.catch((err) => {
			console.log(err);
		});
	// result = User.result;
	// console.log(result);
	error_message = User.error_message;
	// console.log(data);

	// res.json({ error: error_message, result });
	// res.json({ result });
});

app.listen(4000);
