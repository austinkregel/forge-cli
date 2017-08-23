const Command = new require('../Command')
module.exports = class Help extends Command {
    constructor() {
        super('help');
    }
}