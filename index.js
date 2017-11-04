'use strict';
let App = require('./src/Application');
global.ForgeCli= new App();

ForgeCli.register(__dirname, [
    './src/Commands/List'
]);

module.exports = ForgeCli;
