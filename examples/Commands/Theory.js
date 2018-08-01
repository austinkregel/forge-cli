const Command = require('../../src/Command');

module.exports = class Theory extends Command {
    constructor() {
        super();
        this.signature = 'test-the-thing';
    }

    handle() {
        console.log('This is a thing that is testable')
    }
}