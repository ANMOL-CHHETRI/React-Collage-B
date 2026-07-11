const assert = require('assert');

const phone = "123456";
const isPhoneValid = /^\d{10}$/.test(phone.trim());
console.log("Is phone valid?", isPhoneValid);
