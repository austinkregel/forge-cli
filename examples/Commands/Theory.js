const Command = require('../../src/Command');

module.exports = class Theory extends Command {
    constructor(context) {
        super(context);
        this.signature = 'test-the-thing';
    }

    handle() {
      this.info('This is an [info] test')
      this.warning('This is a [warning] test')
      this.danger('This is a [danger] test')

      let questions = async () => {
        let ask = await this.ask('How old are you?');
        let confirm = await this.confirm('Are you sure that it is a thing?');

        return { ask: ask.input, confirm: confirm.confirm }
      }

      questions().then(({ ask, confirm }) => {
          console.log({ask,confirm})
      })
    }
}