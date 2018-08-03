const inquire = require('inquirer');
const chalk = require('chalk');
module.exports = class Command {
    constructor(context, signature) {
        this.signature = signature || '';
        this.inquirer = inquire;
        this.name = '';
        this.options = {};
        this.arguments = {};
        this.chalk = chalk;
        if (signature) {
            this.parseSignature()
        }
        this.Application = context;
    }

    /**
     * Parse the signature of the command and return name, options, and arguments.
     *
     * @returns {{name: *, options: ({}|*), arguments: ({}|*)}}
     */
    parseSignature() {
        let options = [];

        let name = this.name = this.signature.split(' ')[0]

        // grab all optional options
        this.signature.split(' ')
            .map(part => {
                part = this.stripTags(part);
                if(part[0].match(/\-\-(.*?)/g)) {
                    this.options[part[0] || part] = part[1] || false;
                } else {
                    this.arguments[part[0] || part] = part[1] || null;
                }
            });

        return {
            name,
            options: this.options,
            arguments: this.arguments
        }
    }

    /**
     * Check to see if an option exists, if it does return it's value. If not return false.
     *
     * @param option
     * @returns {*|boolean}
     */
    option(option) {
        return this.options[option] || false
    }

    /**
     * Stips the tags that declare an option or an argument.
     */
    stripTags(text) {
        return text.trim().replace(/(^\{)|(\-{2})|(\}$)+/g, '').split('=')
    }

    /**
     * Check to see if an argument exists, if it does return it. If not return null.
     *
     * @param arg
     * @returns {*}
     */
    argument(arg) {
        if (!this.arguments[arg]) {
            return null;
        }

        return this.arguments[arg][0];
    }

    call(sysArgs) {
        // splice to remove the root part of the given command
        let tmpArgs = this.signature.split(' ').splice(1);

        this.systemArguments = sysArgs.join(' ');

        let argCount = 0;
        sysArgs.forEach((part, i)=> {
            let part_ = this.stripTags(part);
            if(part.match(/\-\-(.*?)/g)) {
                this.options[part_[0] || part_] = part_[1] || true;
            } else {
                this.arguments[Object.keys(this.arguments)[argCount]] = part_;
                argCount++;
            }
        });

        if (this.handle) {
            return this.handle.apply(this)
        }
    }

    _values(obj) {
        if (typeof obj !== 'object') {
            return null;
        }

        if (Object.hasOwnProperty('values')) {
            return Objet.values(obj);
        }

        let values = [];

        for (let key in obj) {
            values.push(obj[key])
        }

        return values;
    }

    ask(message) {
        return inquire.prompt({
            type: 'input',
            name: 'input',
            message
        })
    }

    confirm(message) {
        return inquire.prompt({
            type: 'confirm',
            name: 'confirm',
            message,
            default: false
        })
    }

    askList(message, choices) {
        return inquire.prompt({
            type: 'list',
            name: 'list',
            message,
            choices
        })
    }

    describe(description){
        this.description = description;
        return this;
    }

    info(loggableText, context) {
        console.log(this.chalk.bgGreen(this.chalk.black(loggableText)), context || '')
    }

    warning(loggableText, context) {
        console.log(this.chalk.bgYellow(this.chalk.black(loggableText)), context || '')
    }

    danger(loggableText, context) {
        console.log(this.chalk.bgRed(this.chalk.white(loggableText)), context || '')
    }

    log(loggableText, context) {
        console.log(loggableText, context || '')
    }

    handle() {
        throw new Error('Default function')
    }
}
