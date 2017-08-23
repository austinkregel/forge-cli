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
        this.signature.replace(/\{\-\-(.*?)\s*\}/g, (match) => {
            options.push(match)
        })
        // grab all the non-optional values.
        .replace(/\s\-\-(.*)\s/g, (match) => {
            options.push(match.trim())
        })
        // grab the arguments.
        .replace(/\{\s*[^\-\-](.*?)\s*\}/g, (match) => {
            let arg = this.stripTags(match);
            this.arguments[arg[0] || arg] = arg[1] || null;
        })

        // Loop through the current options and parse/set the defaults
        options.forEach((match) => {
            let optionName = this.stripTags(match);
            this.options[optionName[0] || optionName] = optionName[1] || false;
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
        if(sysArgs.hasOwnProperty('splice')) {
            sysArgs = sysArgs.splice(1)
        }

        this.systemArguments = sysArgs;

        // This should match arguments with the given system passed argument...
        // I know this will break... I know it will... I'm just messing with you...
        Object.keys(this.arguments).forEach((argument, i) => {
            sysArgs.forEach(sysArg => {
                if (sysArg.match(/^(?![\-]+)/g) !== null) {
                    this.arguments[argument] = sysArg
                }
            })
        });
        // Some as above, but for the options...
        Object.keys(this.options).forEach((option) => {
            sysArgs.forEach(sysArg => {
                if(sysArg.match('--' + option)) {
                    this.options[option] = this.stripTags(sysArg)[1] || true;
                }
            })
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