const inquire = require('inquirer');
module.exports.stripTags = (text) => {
    "use strict";
    return text.trim().replace(/[(^\{)|(\-{2})|(\}$)]+/g, '').split('=')
};
module.exports = class Command {
    constructor(signature) {
        this.signature = signature || '';
        this.inquire = inquire;
        this.name = '';
        this.options = {};
        this.arguments = {};
        this.handle = () => {
            throw new Error('Default function')
        };
        return this.parseSignature()
    }

    parseSignature() {
        let options = []

        let name = this.name = this.signature.split(' ')[0]

        // grab all optional options
        let that = this;
        this.signature.split(' ')
            .map(part => {
                part = that.stripTags(part);
                if(part[0].match(/\-\-(.*?)/g)) {
                    this.options[part[0] || part] = part[1] || false;
                } else {
                    this.arguments[part[0] || part] = part[1] || null;
                }
            })

        return {
            name,
            options: this.options,
            arguments: this.arguments
        }
    }

    option(option) {
        return this.options[option] || false
    }

    /**
     * Stips the tags that declare an option or an argument.
     */
    stripTags(text) {
        return text.trim().replace(/[(^\{)|(\-{2})|(\}$)]+/g, '').split('=')
    }

    argument(arg) {
        return this.arguments[arg] || null
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

        this.handle.apply(this, Object.assign(this.options, this.arguments))
    }
    describe(description){
        this.description = description;
        return this;
    }
}

// Application.register('signature', () => {
//
// }).describe('This is a thing that does cool stuff.')