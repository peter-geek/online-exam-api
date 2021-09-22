const User = require("./modules/user.cjs");

const express = require("express");
const app = express();

app.use((req, res, next) => {
	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	next();
});
app.use(express.json());

app.post("/signin", (req, res) => {
	// res.json({ txt: "Hello" });
	const body = req.body;
	// console.log(body);
	User.Signin(body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => console.log(err));
});
app.post("/signup", async (req, res) => {
	const body = req.body;
	User.Register(body)
		.then((data) => {
			// return data to the client
			res.json(data);
		})
		.catch((err) => {
			console.log(err);
		});
});

app.listen(4000);
