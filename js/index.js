const express = require("express");

const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server");

const app = express(); 

app.get("/", (req, res) => { 
	res.send("Express on Vercel"); 
}); 

const PORT = process.env.PORT || 9874; app.listen(PORT, () => { 
	console.log(`Server is running on port ${PORT}`); 
});

module.exports = app;