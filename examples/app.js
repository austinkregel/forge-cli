let Application = require('../index');

Application.command('basicCommand', function() {
    console.log('This is a basic command.')
}).describe('this is a command');

Application.command('new {type} {name}', function() {
    console.log(this.argument('type'))
}).describe('this is a command');

Application.register(__dirname, [
    'Commands/Theory.js',
    'Commands'
]);

const args =  Object.assign({}, { args: process.argv });

Application.start(args);