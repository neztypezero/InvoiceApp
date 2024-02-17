document.addEventListener("DOMContentLoaded", onLoad);

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  for(let header of response.headers.entries()) {
  	if (header[0] == 'content-type' && header[1].indexOf('text/html;') != -1) {
  		return response.text();
  	}
  }
  return response.json(); // parses JSON response into native JavaScript objects
}

function createElement(type, className, id, innerHTML, attributes) {
	let element = document.createElement(type);
	if (id) {
		element.id = id;
	}
	if (className) {
		element.className = className;
	}
	if (innerHTML) {
		element.innerHTML = innerHTML;
	}
	if (attributes) {
		for (let attributeName in attributes) {
			element.setAttribute(attributeName, attributes[attributeName]);
		}
	}
	return element;
}

function loadInvoice(data) {
	if (data.fromSection) {
		let fromSection = document.querySelector('.invoice-container > .from-section');
		let fromPersonalInfo = fromSection.querySelector('.from-personal-info');

		let fromNameInput = fromPersonalInfo.querySelector('.from-name > .input-row > input.text-input');
		fromNameInput.value = data.fromSection.fromPersonalInfo.fromName;

		if (data.fromSection.fromPersonalInfo.fromAddressInfo.length > 0) {
			let fromAddressInfo = fromPersonalInfo.querySelector('.from-address-info');
			fromAddressInfo.innerHTML = '';
			for (let addressLine of data.fromSection.fromPersonalInfo.fromAddressInfo) {
				appendInput(fromAddressInfo, 'text', true, {value:addressLine});
			}
		}

		if (data.fromSection.fromPersonalInfo.fromAccountInfo.length > 0) {
			let fromAccountInfo = fromPersonalInfo.querySelector('.from-account-info');
			fromAccountInfo.innerHTML = '';
			for (let accountLine of data.fromSection.fromPersonalInfo.fromAccountInfo) {
				appendInfoInput(fromAccountInfo, accountLine);
			}
		}

		let fromInvoiceInfo = fromSection.querySelector('.from-invoice-info');

		let fromInvoiceNumberInput = fromInvoiceInfo.querySelector('.from-invoice-number > .input-row > input.text-input');
		fromInvoiceNumberInput.value = data.fromSection.fromInvoiceInfo.fromInvoiceNumber;

		let fromInvoiceDateInput = fromInvoiceInfo.querySelector('.from-invoice-date > .input-row > input.date-input');
		fromInvoiceDateInput.value = data.fromSection.fromInvoiceInfo.fromInvoiceDate;
	}
	if (data.billToSection) {
		let billToSection = document.querySelector('.invoice-container > .bill-to-section');
		let billToCompanyInfo = billToSection.querySelector('.bill-to-company-info');

		let billToCompanyNameInput = billToCompanyInfo.querySelector('.bill-to-company-name > .input-row > input.text-input');
		billToCompanyNameInput.value = data.billToSection.billToCompanyInfo.billToCompanyName;

		if (data.billToSection.billToCompanyInfo.billToAddressInfo.length > 0) {
			let billToAddressInfo = billToCompanyInfo.querySelector('.bill-to-address-info');
			billToAddressInfo.innerHTML = '';
			for (let addressLine of data.billToSection.billToCompanyInfo.billToAddressInfo) {
				appendInput(billToAddressInfo, 'text', true, {value:addressLine});
			}
		}
	}
	if (data.descriptionSection) {
		let descriptionSection = document.querySelector('.invoice-container > .description-section');
		descriptionSection.innerHTML = '';
		for (let description of data.descriptionSection) {
			appendDecription(descriptionSection, description);
		}
	}
}

function appendInvoiceCopier(parentElement, input) {
	let inputRow = createElement('div', 'input-row');
	parentElement.appendChild(inputRow);

	let button = createElement('button', 'copy-button', null, 'Copy Latest Invoice', {type:'button'});
	button.addEventListener('click', (e) => {
		postData("/load-latest-invoice", { billToCompanyName: input.value }).then((data) => {
			loadInvoice(data); // JSON data parsed by `data.json()` call
		});
	});
	inputRow.appendChild(button);
}

function loadBillToCompanyNameSelect(selectElement, data) {
	for (let companyName of data) {
		let option = createElement('option', 'bill-to-company-name-option', null, companyName);
		selectElement.appendChild(option);
	}
}

function appendBillToCompanyNameSelect(parentElement) {
	let inputRow = createElement('div', 'input-row');
	parentElement.appendChild(inputRow);

	let selectElement = createElement('select', 'load-bill-to-company-name-select');
	inputRow.appendChild(selectElement);

	postData("/load-bill-to-company-name-list", {}).then((data) => {
		loadBillToCompanyNameSelect(selectElement, data); // JSON data parsed by `data.json()` call
		appendInvoiceListSelect(parentElement);
	});
}

function loadInvoiceListSelect(selectElement, data) {
	if (data.length == 0) {
			let option = createElement('option', 'invoice-option', null, "No Invoices", {selected:"true", disabled:"disabled"});
			selectElement.appendChild(option);
	} else {
		let option = createElement('option', 'invoice-option', null, "Choose Invoice...", {selected:"true", disabled:"disabled"});
		selectElement.appendChild(option);
		for (let invoice of data) {
			let option = createElement('option', 'invoice-option', null, invoice);
			selectElement.appendChild(option);
		}
	}
}

function appendInvoiceListSelect(parentElement) {
	let inputRow = parentElement.querySelector('.input-row');
	let selectElement = inputRow.querySelector('select.load-bill-to-company-name-select');

	let invoiceSelectElement = inputRow.querySelector('select.invoice-select');
	if (invoiceSelectElement) {
		invoiceSelectElement.innerHTML = '';
	} else {
		invoiceSelectElement = createElement('select', 'invoice-select');
		inputRow.appendChild(invoiceSelectElement);

		invoiceSelectElement.addEventListener('change', function(e) {
			postData("/load-invoice", { billToCompanyName: selectElement.value, invoice: invoiceSelectElement.value }).then((data) => {
				loadInvoice(data); // JSON data parsed by `data.json()` call
			});
		});
	}
	
	postData("/load-invoice-list", { billToCompanyName: selectElement.value }).then((data) => {
		loadInvoiceListSelect(invoiceSelectElement, data); // JSON data parsed by `data.json()` call
	});
}

function appendInput(parentElement, type, addable, attributes) {
	let inputRow = createElement('div', 'input-row');
	if (!attributes) {
		attributes = {};
	}
	attributes.type = type;

	let input = createElement('input', type+'-input', null, null, attributes);
	inputRow.appendChild(input);

	if (addable) {
		let button = createElement('button', 'add-button', null, '+', {type:'button'});
		button.addEventListener('click', (e) => {
			appendInput(parentElement, type, addable);
		});
		inputRow.appendChild(button);
	}
	parentElement.appendChild(inputRow);

	return input;
}

function appendInfoInput(parentElement, accountLine = {label:'', value:''}) {
	let inputRow = createElement('div', 'input-row info');
	inputRow.appendChild(createElement('input', 'text-input label', null, null, {type:'text', value: accountLine.label}));
	inputRow.appendChild(createElement('span', 'separator', null, ' : '));
	inputRow.appendChild(createElement('input', 'text-input value', null, null, {type:'text', value: accountLine.value}));

	let button = createElement('button', 'add-button', null, '+', {type:'button'});
	button.addEventListener('click', (e) => {
		appendInfoInput(parentElement);
	});
	inputRow.appendChild(button);

	parentElement.appendChild(inputRow);
}

function appendDecription(parentElement, descriptionRow = {heading:'', description:'', rate:'', qty:'', amount:''}) {
	let inputRow = createElement('div', 'description-row');
	inputRow.appendChild(createElement('input', 'text-input heading', null, null, {type:'text', value:descriptionRow.heading}));
	let rateInput = createElement('input', 'text-input rate', null, null, {type:'text', value:descriptionRow.rate});
	let qtyInput = createElement('input', 'text-input qty', null, null, {type:'text', value:descriptionRow.qty});
	let amountInput = createElement('input', 'text-input amount', null, null, {type:'text', value:descriptionRow.amount, disabled:"disabled"});
	let onChangeMultiply = function() {
		let rate = parseFloat(rateInput.value);
		let qty = parseFloat(qtyInput.value);
		if (!isNaN(rate) && !isNaN(qty)) {
			amountInput.value = (rate*qty).toFixed(2);
		} else {
			amountInput.value = '';
		}
	}
	rateInput.addEventListener('keyup', onChangeMultiply);
	qtyInput.addEventListener('keyup', onChangeMultiply);

	inputRow.appendChild(rateInput);
	inputRow.appendChild(qtyInput);
	inputRow.appendChild(amountInput);

	let button = createElement('button', 'add-button', null, '+', {type:'button'});
	button.addEventListener('click', (e) => {
		appendDecription(parentElement);
	});
	inputRow.appendChild(button);

	inputRow.appendChild(createElement('textarea', 'description', null, descriptionRow.description, {rows:4}));

	parentElement.appendChild(inputRow);
}

function getInvoiceJSON() {
	let invoiceJSON = {
		fromSection: {
			fromPersonalInfo: {
				fromName: "",
				fromAddressInfo: [],
				fromAccountInfo: []
			},
			fromInvoiceInfo: {
				fromInvoiceNumber: "",
				fromInvoiceDate: ""
			}
		},
		billToSection: {
			billToCompanyInfo: {
				billToCompanyName: "",
				billToAddressInfo: []
			}
		},
		descriptionSection: []
	};

	let fromSection = document.querySelector('.invoice-container > .from-section');
	let fromPersonalInfo = fromSection.querySelector('.from-personal-info');

	let fromNameInput = fromPersonalInfo.querySelector('.from-name > .input-row > input.text-input');
	invoiceJSON.fromSection.fromPersonalInfo.fromName = fromNameInput.value;

	let fromAddressInfoInputList = fromPersonalInfo.querySelectorAll('.from-address-info > .input-row > input.text-input');
	for (let fromAddressInfo of fromAddressInfoInputList) {
		invoiceJSON.fromSection.fromPersonalInfo.fromAddressInfo.push(fromAddressInfo.value);
	}

	let fromAccountInfoRowList = fromPersonalInfo.querySelectorAll('.from-account-info > .input-row');
	for (let fromAccountInfoRow of fromAccountInfoRowList) {
		let labelInput = fromAccountInfoRow.querySelector('input.text-input.label');
		let valueInput = fromAccountInfoRow.querySelector('input.text-input.value');
		invoiceJSON.fromSection.fromPersonalInfo.fromAccountInfo.push({label:labelInput.value, value:valueInput.value});
	}
	let fromInvoiceInfo = fromSection.querySelector('.from-invoice-info');

	let fromInvoiceNumberInput = fromInvoiceInfo.querySelector('.from-invoice-number > .input-row > input.text-input');
	invoiceJSON.fromSection.fromInvoiceInfo.fromInvoiceNumber = fromInvoiceNumberInput.value;

	let fromInvoiceDateInput = fromInvoiceInfo.querySelector('.from-invoice-date > .input-row > input.date-input');
	invoiceJSON.fromSection.fromInvoiceInfo.fromInvoiceDate = fromInvoiceDateInput.value;

	let billToSection = document.querySelector('.invoice-container > .bill-to-section');
	let billToCompanyInfo = billToSection.querySelector('.bill-to-company-info');

	let billToCompanyName = billToCompanyInfo.querySelector('.bill-to-company-name > .input-row > input.text-input');
	invoiceJSON.billToSection.billToCompanyInfo.billToCompanyName = billToCompanyName.value;

	let billToAddressInfoInputList = billToCompanyInfo.querySelectorAll('.bill-to-address-info > .input-row > input.text-input');
	for (let billToAddressInfo of billToAddressInfoInputList) {
		invoiceJSON.billToSection.billToCompanyInfo.billToAddressInfo.push(billToAddressInfo.value);
	}

	let descriptionRowList = document.querySelectorAll('.invoice-container > .description-section > .description-row');
	for (let descriptionRow of descriptionRowList) {
		let headingInput = descriptionRow.querySelector('input.text-input.heading');
		let rateInput = descriptionRow.querySelector('input.text-input.rate');
		let qtyInput = descriptionRow.querySelector('input.text-input.qty');
		let amountInput = descriptionRow.querySelector('input.text-input.amount');
		let descriptionTextarea = descriptionRow.querySelector('textarea.description');

		invoiceJSON.descriptionSection.push(    {
        "heading": headingInput.value,
        "rate": rateInput.value,
        "qty": qtyInput.value,
        "amount": amountInput.value,
        "description": descriptionTextarea.value,
    });
	}
	return invoiceJSON;
}

function appendSaveAndPrint(parentElement) {
	let inputRow = createElement('div', 'input-row');

	let saveButton = createElement('button', 'save-button', null, 'Save', {type:'button'});
	saveButton.addEventListener('click', (e) => {
		let invoiceJSON = getInvoiceJSON();
		postData("/save-invoice", invoiceJSON).then((data) => {
			console.log(data);
		});
	});
	inputRow.appendChild(saveButton);

	let printPutton = createElement('button', 'print-button', null, 'Print', {type:'button'});
	printPutton.addEventListener('click', (e) => {
		let invoiceJSON = getInvoiceJSON();
		postData("/print-invoice", invoiceJSON).then((data) => {
			const printWindow = window.open('', '_blank');
			printWindow.document.write(data);

		});
	});
	inputRow.appendChild(printPutton);

	parentElement.appendChild(inputRow);
}

function lastDayOfMonthString() {
	let now  = new Date();
	let date = new Date(now.getFullYear(), now.getMonth()+1, 0);
	return date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getDate().toString().padStart(2, '0');
}

function onLoad(event) {
	let invoiceContainer = createElement('div', 'invoice-container');
	document.body.appendChild(invoiceContainer);

	let fromSection = createElement('div', 'from-section');
	invoiceContainer.appendChild(fromSection);

	let fromPersonalInfo = createElement('div', 'from-personal-info');
	fromSection.appendChild(fromPersonalInfo);

	let fromName = createElement('div', 'from-name');
	fromPersonalInfo.appendChild(fromName);
	appendInput(fromName, 'text');

	let fromAddressInfo = createElement('div', 'from-address-info addable');
	fromPersonalInfo.appendChild(fromAddressInfo);
	appendInput(fromAddressInfo, 'text', true);

	let fromAccountInfo = createElement('div', 'from-account-info addable');
	fromPersonalInfo.appendChild(fromAccountInfo);
	appendInfoInput(fromAccountInfo);

	let fromInvoiceInfo = createElement('div', 'from-invoice-info');
	fromSection.appendChild(fromInvoiceInfo);

	let billToCompanyNameList = createElement('div', 'bill-to-company-name-list');
	fromInvoiceInfo.appendChild(billToCompanyNameList);
	appendBillToCompanyNameSelect(billToCompanyNameList);

	invoiceContainer.appendChild(createElement('div', 'spacer'));

	let billToSection = createElement('div', 'bill-to-section');
	invoiceContainer.appendChild(billToSection);

	let billToCompanyInfo = createElement('div', 'bill-to-company-info');
	billToSection.appendChild(billToCompanyInfo);

	let billToCompanyName = createElement('div', 'bill-to-company-name');
	billToCompanyInfo.appendChild(billToCompanyName);
	let billToCompanyNameInput = appendInput(billToCompanyName, 'text');

	let fromInvoiceNumber = createElement('div', 'from-invoice-number');
	fromInvoiceInfo.appendChild(fromInvoiceNumber);
	appendInput(fromInvoiceNumber, 'text', false);

	let fromInvoiceDate = createElement('div', 'from-invoice-date');
	fromInvoiceInfo.appendChild(fromInvoiceDate);
	appendInput(fromInvoiceDate, 'date', false, {value:lastDayOfMonthString()});

	let billToAddressInfo = createElement('div', 'bill-to-address-info addable');
	billToCompanyInfo.appendChild(billToAddressInfo);
	appendInput(billToAddressInfo, 'text', true);

	invoiceContainer.appendChild(createElement('div', 'spacer dark'));

	let descriptionSection = createElement('div', 'description-section');
	invoiceContainer.appendChild(descriptionSection);
	appendDecription(descriptionSection);

	invoiceContainer.appendChild(createElement('div', 'spacer dark'));

	let saveSection = createElement('div', 'save-section');
	invoiceContainer.appendChild(saveSection);
	appendSaveAndPrint(saveSection);
}