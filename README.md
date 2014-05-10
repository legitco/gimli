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
* Install [Bower](http://bower.io/)
* Clone this repo
* Run `npm install` from the project folder to install server dependencies
* Run `npm install -g bower` from the project folder to install clident depencencies

### Required Environmental Variables

We use environment variables for configuration since this is an easy method for
cloud hosting providers.

    COOKIE_SECRET:        Can be anything, string used to encrypt session cookies
    GIMLI_REDIRECT_URL:   OAuth redirect url: ie http://localhost:3000/auth/github/callback
    GITHUB_CLIENT_ID:     OAuth client id from Github
    GITHUB_CLIENT_SECRET: OAuth client secret from Github
    REDISCLOUD_URL:       Redis connection string: ie redis://localhost:6379
    PORT:                 Port to run the server on (We use 3000)

### Running

    npm start

## Development

### Tests

    npm test
