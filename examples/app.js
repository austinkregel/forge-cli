let Application = require('../index');

Application.command('basicCommand', function() {
    console.log('This is a basic command.')
}).describe('this is a command');

Application.command('new {type} {name}', function() {
    console.log(this.argument('type'))
}).describe('this is a command');

Application.register(__dirname, [
    'Commands/Theory.js',
    // You can register either a whole directory or a single command, or both!
    'Commands'
]);

const args =  Object.assign({}, { args: process.argv });

Application.start(args);
