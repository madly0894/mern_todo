const getAge = date => new Date().getFullYear() - new Date(date).getFullYear();

module.exports = { getAge };
