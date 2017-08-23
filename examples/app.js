let Application = require('forge-cli');

Application.command('http:post {url} {--https}', function() {
    console.log(this)
}).describe('this is a command');

Application.register(__dirname, [
    '../src/Commands/List'
])

const args =  Object.assign({}, { args: process.argv });

Application.start(args);