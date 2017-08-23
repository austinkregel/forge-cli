const Command = new require('../Command');
var Table = require('cli-table');
var table = new Table({ head: ["id", "name", "description"] });

module.exports = class List extends Command {
    constructor() {
        super('list');
        this.call = super.call
        this.stripTags = super.stripTags
        this.argument = super.argument;
        this.option = super.option;
        this.describe = super.describe
        this.signature = 'list';
        this.handle = () => {
            let list = [];
            for(let name in this.systemArguments) {
                list.push(this.systemArguments[name])
            }

            let ids = [],
                names = [],
                descriptions= []
            list.forEach((command, id)=> {
                table.push([
                    id+1,
                    command.signature,
                    command.description || ''
                ])
            });
            console.log(table.toString())
        }

    }
};