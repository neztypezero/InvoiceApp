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

app.get("/", (req, res) => { 
	sendFile('/html/index.html', res);
});

app.get("/favicon.ico", (req, res) => { 
	sendFile('/img/favicon.svg', res);
});

app.post("/save-invoice", (req, res) => {
	saveInvoice(req, res);
});

app.post("/load-invoice", (req, res) => { 
	loadInvoice(req, res);
});

app.all("/print-invoice", (req, res) => {
	let printHtmlPath = path.join(__dirname, '../html/print.html');
	fs.readFile(printHtmlPath, 'utf-8', (err, printHtml) => {
		res.contentType("print.html");
		let json = JSON.stringify(req.body);
		res.send(printHtml.replace('${json}', json));
	}); 
});

app.post("/load-bill-to-company-name-list", (req, res) => { 
	loadBillToCompanyNameList(res);
});

app.post("/load-invoice-list", (req, res) => { 
	loadInvoiceList(req, res);
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

function saveInvoice(req, res) {
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
}

function loadBillToCompanyNameList(res) {
	const dir = path.join(__dirname, '../.save/');
	let billToCompanyNameList = getDirList(dir);
	res.send(billToCompanyNameList);
}

function getDirList(dir) {
	let dirList = [];

	const stat = fs.lstatSync(dir);
	if (stat.isDirectory()) {
		fs.readdirSync(dir).forEach((f) => {
			const dirStat = fs.lstatSync(path.join(dir, f));
			if (dirStat.isDirectory()) {
				dirList.push(f);
			}
		});
	}

	return dirList;
}

function loadInvoiceList(req, res) {
	let invoiceList = [];
	if (req && req.body && req.body.billToCompanyName) {
		const dir = path.join(__dirname, '../.save/'+req.body.billToCompanyName);
		let fileList = getFileList(dir);
		for (let file of fileList) {
			invoiceList.push(file.replace('.json', ''));
		}
	}
	res.send(invoiceList);
}

function getFileList(dir) {
	let fileList = [];

	const stat = fs.lstatSync(dir);
	if (stat.isDirectory()) {
		fs.readdirSync(dir).forEach((f) => {
			const dirStat = fs.lstatSync(path.join(dir, f));
			if (dirStat.isFile()) {
				fileList.push(f);
			}
		});
	}

	return fileList;
}

function loadInvoice(req, res) {
	let newestFilePath = null;
	if (req && req.body && req.body.billToCompanyName && req.body.invoice) {
		const invoicePath = path.join(__dirname, '../.save/'+req.body.billToCompanyName+'/'+req.body.invoice+'.json');
		fs.exists(invoicePath, (exists) => {
			if (exists) {
				res.contentType(invoicePath);
				res.sendFile(invoicePath);
			} else {
				res.send({});
			}
		});
	} else {
		res.send({});
	}
}

module.exports = app;