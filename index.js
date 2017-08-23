'use strict';
let App = require('./src/Application'),
    Application = new App();

Application.register(__dirname, [
    './src/Commands/List'
])

module.exports = Application;