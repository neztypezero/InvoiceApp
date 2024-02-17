document.addEventListener("DOMContentLoaded", onLoad);

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

function appendInvoiceCopier(parentElement) {
	let inputRow = createElement('div', 'input-row');
	parentElement.appendChild(inputRow);

	let button = createElement('button', 'copy-button', null, 'Copy Latest Invoice', {type:'button'});
	button.addEventListener('click', (e) => {
		//appendInput(parentElement, type, addable);
	});
	inputRow.appendChild(button);
}

function appendInput(parentElement, type, addable, attributes) {
	let inputRow = createElement('div', 'input-row');
	if (!attributes) {
		attributes = {};
	}
	attributes.type = type;
	inputRow.appendChild(createElement('input', type+'-input', null, null, attributes));
	if (addable) {
		let button = createElement('button', 'add-button', null, '+', {type:'button'});
		button.addEventListener('click', (e) => {
			appendInput(parentElement, type, addable);
		});
		inputRow.appendChild(button);
	}

	parentElement.appendChild(inputRow);
}

function appendInfoInput(parentElement) {
	let inputRow = createElement('div', 'input-row info');
	inputRow.appendChild(createElement('input', 'text-input', null, null, {type:'text'}));
	inputRow.appendChild(createElement('span', 'separator', null, ' : '));
	inputRow.appendChild(createElement('input', 'text-input', null, null, {type:'text'}));

	let button = createElement('button', 'add-button', null, '+', {type:'button'});
	button.addEventListener('click', (e) => {
		appendInfoInput(parentElement);
	});
	inputRow.appendChild(button);

	parentElement.appendChild(inputRow);
}

function appendDecription(parentElement) {
	let inputRow = createElement('div', 'description-row');
	inputRow.appendChild(createElement('textarea', 'description', null, null));
	inputRow.appendChild(createElement('input', 'text-input rate', null, null, {type:'text'}));
	inputRow.appendChild(createElement('input', 'text-input qty', null, null, {type:'text'}));
	inputRow.appendChild(createElement('input', 'text-input amount', null, null, {type:'text'}));

	let button = createElement('button', 'add-button', null, '+', {type:'button'});
	button.addEventListener('click', (e) => {
		appendDecription(parentElement);
	});
	inputRow.appendChild(button);

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

	let invoiceCopier = createElement('div', 'invoice-copier');
	fromInvoiceInfo.appendChild(invoiceCopier);
	appendInvoiceCopier(invoiceCopier);

	let fromInvoiceDate = createElement('div', 'from-invoice-date');
	fromInvoiceInfo.appendChild(fromInvoiceDate);
	appendInput(fromInvoiceInfo, 'date', false, {value:lastDayOfMonthString()});

	invoiceContainer.appendChild(createElement('div', 'spacer'));

	let billToSection = createElement('div', 'bill-to-section');
	invoiceContainer.appendChild(billToSection);

	let billToCompanyInfo = createElement('div', 'bill-to-company-info');
	billToSection.appendChild(billToCompanyInfo);

	let billToCompanyName = createElement('div', 'bill-to-company-name');
	billToCompanyInfo.appendChild(billToCompanyName);
	appendInput(billToCompanyName, 'text');

	let billToAddressInfo = createElement('div', 'bill-to-address-info addable');
	billToCompanyInfo.appendChild(billToAddressInfo);
	appendInput(billToAddressInfo, 'text', true);

	invoiceContainer.appendChild(createElement('div', 'spacer dark'));

	let descriptionSection = createElement('div', 'description-section');
	invoiceContainer.appendChild(descriptionSection);
	appendDecription(descriptionSection);

	invoiceContainer.appendChild(createElement('div', 'spacer dark'));
}