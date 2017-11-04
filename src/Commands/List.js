const Command = new require('../Command');
let Table = require('cli-table');
let table = new Table({ head: ["id", "name", "description"] });

module.exports = class List extends Command {
    constructor() {
        super('list');
        // I'm probably implementing the classes wrong, but I had to register
        // the methods like this to make the work because the
        this.call = super.call
        this.stripTags = super.stripTags
        this.argument = super.argument;
        this.option = super.option;
        this.describe = super.describe
        this.signature = 'list';
        this.description = 'This will list all commands registered with an application.'
        this.handle = () => {
            let id = 0;
            for (let command in Application.commands){
                table.push([
                    id ++,
                    Application.commands[command].signature,
                    Application.commands[command].description || ''
                ])
            }
            console.log(table.toString())
        }
    }
};