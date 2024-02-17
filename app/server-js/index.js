const express = require("express");

const fs = require('fs');
const path = require('path');

const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const root = {
  rollDice: args => {
    var output = []
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
    }
    return output
  },
};

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.get("/js/*", (req, res) => {
	sendFile(req.path, res);
}); 

app.get("/css/*", (req, res) => {
	sendFile(req.path, res);
}); 

app.get("/html/*", (req, res) => {
	sendFile(req.path, res);
}); 

app.get("/", (req, res) => { 
	sendFile('/html/index.html', res);
}); 

const PORT = process.env.PORT || 9874; app.listen(PORT, () => { 
	console.log(`Server is running on port ${PORT}`); 
});

function sendFile(filePath, res) {
	let fullPath = path.join(__dirname, '..'+filePath);

	fs.exists(fullPath, (exists) => {
		if (exists) {
			res.contentType(path.basename(filePath));
			res.sendFile(fullPath);
		} else {
			res.sendStatus(404);
		}
	});
}

module.exports = app;