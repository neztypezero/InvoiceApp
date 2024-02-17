const express = require("express");

const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());

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

app.get("/favicon.ico", (req, res) => { 
	sendFile('/img/favicon.svg', res);
});

app.post("/save-invoice", (req, res) => {
	let billToCompanyName = req.body.billToSection.billToCompanyInfo.billToCompanyName;
	let fromInvoiceNumber = req.body.fromSection.fromInvoiceInfo.fromInvoiceNumber;
	const dir = path.join(__dirname, '../.save/'+billToCompanyName+'/');
	const file = fromInvoiceNumber+'.json';

	fs.mkdir(dir, { recursive: true }, (err) => {
		if (err) {
			res.send({err:err});
		} else {
			fs.writeFile(dir+file, JSON.stringify(req.body), err => {
				if (err) {
					res.send({err:err});
				} else {
					res.send({saved:dir});
				}
			});
		}
	});
});

app.post("/load-latest-invoice", (req, res) => { 
	loadLatestInvoice(req, res);
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

function loadLatestInvoice(req, res) {
	let newestFilePath = null;
	if (req && req.body && req.body.billToCompanyName) {
		const dir = path.join(__dirname, '../.save/'+req.body.billToCompanyName);
		fs.exists(dir, (exists) => {
			if (exists) {
				newestFilePath = getNewestFile(dir);
			}
			if (newestFilePath) {
				let jsonFilePath = path.join(dir, newestFilePath);
				res.contentType(path.basename(jsonFilePath));
				res.sendFile(jsonFilePath);
			} else {
				res.send({});
			}
		});
	} else {
		newestFilePath = getNewestFile(path.join(__dirname, '../.save'));
		if (newestFilePath) {
			let jsonFilePath = path.join(__dirname, '../.save/'+newestFilePath);
			res.contentType(path.basename(jsonFilePath));
			res.sendFile(jsonFilePath);
		} else {
			res.send({});
		}
	}
}

function getNewestFile(dir) {
	let currentNewestFile = null;

	const files = [dir];
	do {
		const filepath = files.pop();
		const stat = fs.lstatSync(filepath);
		if (stat.isDirectory()) {
			fs.readdirSync(filepath).forEach(f => files.push(path.join(filepath, f)));
		} else if (stat.isFile()) {
			if (!currentNewestFile) {
				currentNewestFile = path.relative(dir, filepath);
			}
		}
	} while (files.length !== 0);

	return currentNewestFile;
}

module.exports = app;