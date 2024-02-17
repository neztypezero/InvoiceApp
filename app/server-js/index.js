const express = require("express");

const fs = require('fs');
const path = require('path');

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

app.post("/save-invoice", (req, res) => { 
	sendFile('/html/index.html', res);
});

app.post("/load-latest-invoice", (req, res) => { 
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