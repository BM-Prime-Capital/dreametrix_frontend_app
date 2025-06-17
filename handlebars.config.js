const Handlebars = require('handlebars/runtime');

// Add any custom helpers you need
Handlebars.registerHelper('exampleHelper', function (value) {
  return value.toUpperCase();
});

module.exports = Handlebars;