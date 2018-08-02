let fs = require('fs'),
    Command = require('./Command'),
    path = require('path');

module.exports = class Application {
    constructor() {
        this.commands = {};
        this.executing = {}
    }

    command(commandName, func) {
        if (typeof func !== 'function') {
            throw new Error('This must be a closure/function');
        }

        let commandKey = commandName.split(' ')[0]
        let that = this;
        this.commands[commandKey] = new (class extends Command {
            constructor() {
                super(that, commandName);
                this.signature = commandName;
            }

            handle() {
                func.bind(this).apply(this, [])
            }
        })(commandName);

        return this.commands[commandKey];
    }

    register(directory, arrayOfCommands) {
        if (!Array.isArray(arrayOfCommands)) {
            arrayOfCommands = [arrayOfCommands]
        }

        arrayOfCommands = arrayOfCommands.map(command => {
            return path.join(directory, command);
        })

        let justCommandDirectories = arrayOfCommands.filter(file => fs.lstatSync(file).isDirectory()).map(
            dir => fs.readdirSync(dir).map(file => path.join(dir, file))
        ).reduce((thing, thing2) => { return thing.concat(thing2) });

        let justCommandFiles = arrayOfCommands.filter(file => (!fs.lstatSync(file).isDirectory()));

        [...new Set(justCommandFiles.concat(justCommandDirectories))].forEach(command => {
            this.registerCommand( command)
        })
    }

    registerCommand(command) {
        if (!fs.lstatSync(command).isDirectory()) {
            command = require(command.replace(/\.js$/, ''));
            let cmd = new command(this);
            cmd.parseSignature();
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
            let Table = require('cli-table');
            let table = new Table({head: ["id", "name", "description"]});

            let id = 0;
            for (let command in this.commands) {
                if (!this.commands.hasOwnProperty(command)) {
                    continue;
                }
                table.push([
                    id++,
                    this.commands[command].signature,
                    this.commands[command].description || ''
                ])
            }
            console.log(table.toString())
            return;
        }

        this.executing.call(args);
    }
};