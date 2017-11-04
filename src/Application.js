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
                this.call = super.call;
                this.stripTags = super.stripTags;
                this.argument = super.argument;
                this.option = super.option;
                this.describe = super.describe;
                this.signature = commandName;
            }
        }(commandName);

        this.commands[tmpCmp.name] = tmpCmp;

        return tmpCmp;
    }

    register(directory, arrayOfCommands) {
        if (!Array.isArray(arrayOfCommands)) {
            arrayOfCommands = [arrayOfCommands]
        }

        arrayOfCommands.forEach(command => {
            this.registerCommand(directory + "/" + command + ".js")
        })
    }

    registerCommand(command) {
        if (!fs.lstatSync(command).isDirectory()) {
            command = new require(command.replace(/\.js$/, ''));
            let cmd = new command();
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

        if (!this.executing) {
            this.commands['list'].call([]);
            return;
        }

        this.executing.apply(this, args);
    }
};