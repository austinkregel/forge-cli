'use strict';
let App = require('./src/Application'),
    Application = new App();


Application.command('http:post {url} {--https}', function() {

});

const args =  Object.assign({}, { args: process.argv });

Application.start(
    args
);