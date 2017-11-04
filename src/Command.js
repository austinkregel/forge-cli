const inquire = require('inquirer');

class Command {
    constructor(signature) {
        this.signature = signature || '';
        this.inquirer = inquire;
        this.name = '';
        this.options = {};
        this.arguments = {};
        this.handle = () => {
            throw new Error('Default function')
        };
        return this.parseSignature()
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
        let that = this;
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

        this.handle.bind(this).apply( Object.assign(this.options, this.arguments))
    }

    ask(questions, callback) {
        inquire.prompt(questions).then(callback);
    }

    describe(description){
        this.description = description;
        return this;
    }
}

module.exports = Command;