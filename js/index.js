const express = require("express");

var { createHandler } = require("graphql-http/lib/use/express");
var { buildSchema } = require("graphql");

const app = express(); 

app.get("/", (req, res) => { 
	res.send("Express on Vercel"); 
}); 

const PORT = process.env.PORT || 9874; app.listen(PORT, () => { 
	console.log(`Server is running on port ${PORT}`); 
});

module.exports = app;