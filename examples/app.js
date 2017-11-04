let Application = require('forge-cli');

Application.command('basicCommand', function() {
    console.log('This is a basic command.')
}).describe('this is a command');

Application.register(__dirname, [
    '../src/Commands/List'
]);

const args =  Object.assign({}, { args: process.argv });

Application.start(args);