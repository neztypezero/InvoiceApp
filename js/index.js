const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
const { ruruHTML } = require("ruru/server")

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);


// The rootValue provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return "Hello world!"
  },
}

const app = express();

// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.get("/", (req, res) => { 
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
}); 

const PORT = process.env.PORT || 9874; app.listen(PORT, () => { 
	console.log(`Server is running on port ${PORT}`); 
});


module.exports = app;