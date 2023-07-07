const d = new Date();
const year = d.getFullYear();
const month = d.getMonth();
const day = d.getDate();
const cA = new Date(year - 18, month, day).toDateString();
const cB = new Date(year - 35, month, day).toDateString();

module.exports = { cA, cB };
