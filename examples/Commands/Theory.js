const Command = require('../../src/Command');

module.exports = class Theory extends Command {
    constructor(context) {
        super(context);
        this.signature = 'test-the-thing';
    }

    handle() {
        this.info('This is an [info] test')
        this.warning('This is a [warning] test')
        this.danger('This is a [danger] test')
    }
}