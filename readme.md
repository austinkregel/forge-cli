# What is forge-cli?
It's the beginning of a simple cli framework heavily inspired by [Laravel Artisan](https://laravel.com/docs/master/artisan). Specifically the way they handle anonymous cli commands and registering new commands. I'm not saying the code base is based upon it. Just the way you interact with everything.

## So how do I use it?

For starters this repo is not on an NPM repo just yet that's mainly because I haven't figured out how to do that yet... But I will.

## docs

#### Registering new commands
Eventually this will be done more simply; however, at this moment I have only added support though.


If we wanted to register the usage of the following command
`node index.js your:command MyArgument --yourOption=no`

the code we would need to make it work is below.
```javascript
Application.command('your:command {yourArgument} {--yourOption}', function() {
    // Your code to execute when the command is called.
    // this.option('yourOption') will either return the 
    // value it's set equal to (in the example it would be the word "no",
    // true if it exists, or false if it doesn't exist.
    
    // this.argument('yourArgument') will return the text that's passed
    // in it's place (in the example it would be the word "MyArgument") or null
});
```
#### Real life example.

If you have a webhook that you want to post to you might do something like:

```javascript
'use strict';
let Application = require('forge-cli');
    // I'm using axios to make an http request, you can use anything in this closure,
    // I just like axios for http requests...
let axios = require('axios');

// Register your command
Application.command('http:post {url} {--https}', function() {
    let isSecure = this.option('https'),
        urlToPostTo = this.argument('url');
    // Use axios to post to the url
    axios.post((isSecure? 'https://' : 'http://') + urlToPostTo, {})
        .then(response => {
            console.log(response.status)
        })
});

let args = Object.assign({}, {args: process.argv});

// This "starts" the application
Application.start(args);
```
Then to use this command you can just type (in your console)

`node index.js http:post example.com` or `node index.js http:post example.com --https`
And the url's they'll hit are http://example.com and https://example.com respectively.

### Helpers?

You have full access to the [inquirer](https://github.com/SBoudrias/Inquirer.js) library via `this.inquirer` in your command's closure.
