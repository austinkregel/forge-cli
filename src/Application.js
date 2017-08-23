let fs = require('fs'),
    Command = new require('./Command');
module.exports = class Application {
    constructor() {
        this.commands = {};
        this.executing = {}
    }

    command(commandName, func) {
        if (typeof func !== 'function') {
            throw new Error('This must be a closure/function');
        }

        let tmpCmp = new class extends Command {
            constructor() {
                super(commandName);
                this.handle = func;
                this.call = super.call
                this.stripTags = super.stripTags
                this.argument = super.argument;
                this.option = super.option;
                this.signature = commandName;
            }
        }(commandName);

        this.commands[tmpCmp.name] = tmpCmp

        return tmpCmp;
    }

    registerCommand(command) {
        if (!fs.lstatSync(command).isDirectory()) {
            let cmd = new require(command.replace(/\.js$/, ''));
            this.commands[cmd.name] = cmd
        }
    }

    parseArgs(args) {
        this.executing = this.commands[args[0]]
        return this;
    }

    start(argv) {
        let args = argv.args.splice(2);

        this.parseArgs(args);

        if(!this.executing){
            throw new Error('No command is registered by that signature!')
        }

        this.executing.call(args);
    }
};