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

let data = window.InvoiceJSON;

let invoiceContainer = document.querySelector('.invoice-container');
let fromSection = invoiceContainer.querySelector('.from.section');
let fromPersonalInfo = fromSection.querySelector('.from-personal-info');

let name = fromPersonalInfo.querySelector('.name');
name.innerHTML = data.fromSection.fromPersonalInfo.fromName;

let fromAddressInfo = fromPersonalInfo.querySelector('.from-address-info');
for (let fromAddressLine of data.fromSection.fromPersonalInfo.fromAddressInfo) {
	fromAddressInfo.appendChild(createElement('div', 'row', null, fromAddressLine));
}

let fromAccountInfo = fromPersonalInfo.querySelector('.from-account-info');
for (let fromAccountLine of data.fromSection.fromPersonalInfo.fromAccountInfo) {
	fromAccountInfo.appendChild(createElement('div', 'row', null, '<span class="label">'+fromAccountLine.label+'</span><span class="separator"> : </span><span class="value">'+fromAccountLine.value+'</span>'));
}

let fromInvoiceInfo = fromSection.querySelector('.from-invoice-info');

let fromInvoiceNumber = fromInvoiceInfo.querySelector('.from-invoice-number');
fromInvoiceNumber.innerHTML = '<div class="heading">INVOICE</div><div class="row">'+data.fromSection.fromInvoiceInfo.fromInvoiceNumber+'</div>'

let fromInvoiceDate = fromInvoiceInfo.querySelector('.from-invoice-date');
let dateString = data.fromSection.fromInvoiceInfo.fromInvoiceDate+"T08:00:00Z";
let date = new Date(dateString);
fromInvoiceDate.innerHTML = '<div class="heading">INVOICE</div><div class="row">'+date.toLocaleString('default', { month: 'short' })+' '+date.getDate()+', '+date.getFullYear()+'</div>';

let billToSection = invoiceContainer.querySelector('.bill-to.section');
let billToCompanyInfo = billToSection.querySelector('.bill-to-company-info');

let billToCompanyName = billToSection.querySelector('.name');
billToCompanyName.innerHTML = data.billToSection.billToCompanyInfo.billToCompanyName;

let billToAddressInfo = billToSection.querySelector('.bill-to-address-info');
for (let billToAddressLine of data.billToSection.billToCompanyInfo.billToAddressInfo) {
	billToAddressInfo.appendChild(createElement('div', 'row', null, billToAddressLine));
}

let descriptionSection = invoiceContainer.querySelector('.description.list.section');
let balanceTotal = 0.0;
for (let descriptionLine of data.descriptionSection) {
	let rate = parseFloat(descriptionLine.rate);
	let qty = parseFloat(descriptionLine.qty);
	let amount = rate*qty;

	if (balanceTotal > 0.0) {
		descriptionSection.appendChild(createElement('div', 'spacer'));
	}

	balanceTotal += amount;

	let descriptionHTML = `
		<div class="heading">${descriptionLine.heading}</div>
		<div class="rate">${rate.toFixed(2)}</div>
		<div class="qty">${descriptionLine.qty}</div>
		<div class="amount">${amount.toFixed(2)}</div>
		<div class="description">${descriptionLine.description}</div>
	`;
	descriptionSection.appendChild(createElement('div', 'description-row', null, descriptionHTML));
}

let fromInvoiceBalance = fromInvoiceInfo.querySelector('.from-invoice-balance');
fromInvoiceBalance.innerHTML = '<div class="heading">BALANCE DUE</div><div class="row">USD '+balanceTotal.toFixed(2)+'</div>'

let subtotal = invoiceContainer.querySelector('.total.section > .row > .subtotal');
subtotal.innerHTML = 'USD '+balanceTotal.toFixed(2);

let total = invoiceContainer.querySelector('.total.section > .row > .balance-total');
total.innerHTML = '<span>USD '+balanceTotal.toFixed(2)+'</span>';
