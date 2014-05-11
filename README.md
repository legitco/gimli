# Gimli
##### Github Issues Messenger

Gimli is currently a work in progress.

![Under Construction](http://png-3.findicons.com/files/icons/990/vistaico_toolbar/256/under_construction.png)

## Build Status

[![Build Status](https://travis-ci.org/legitco/gimli.png?branch=develop)](https://travis-ci.org/legitco/gimli)
[![Coverage Status](https://coveralls.io/repos/legitco/gimli/badge.png?branch=develop)](https://coveralls.io/r/legitco/gimli?branch=develop)
[![Code Climate](https://codeclimate.com/github/legitco/gimli.png)](https://codeclimate.com/github/legitco/gimli)
[![Dependency Status](https://david-dm.org/legitco/gimli.png)](https://david-dm.org/legitco/gimli)

## Usage

* Install [Node.js](http://nodejs.org/)
* Clone this repo
* Run `npm install` from the project folder to install server dependencies
* Run `npm install -g bower` to be able to install client dependencies
* Run `npm install -g grunt-cli` to be able to run tasks

### Required Environmental Variables

All required environmental variables except two will be setup by our
`gruntfile.js` tasks. To hook up to github authentication you'll need to
[create an application](https://github.com/settings/applications) and then setup
two environment variables. You can do this by creating a `~/.env` file with the
following content:

    GITHUB_CLIENT_ID=<client id for your github application>
    GITHUB_CLIENT_SECRET=<client secret for your github application>

You can look at our `gruntfile.js` to see what other environment variables you
can override.

### Building

**You don't need to run bower install!** Our bower settings are contained in
`gruntfile.js` and bower will be run as part of our build task.

    grunt build

### Running

    grunt start

or

    npm start

### Tests

    grunt test

or

    npm test
