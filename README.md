# ec.cookie-mock

> Mock implementation for document.cookie. By entrecode.

[![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] 

You can use this for testing cookie handling in your project. Simple add it like shown in the usage example.


## Installation

```sh
npm i --save cookie-mock
```

### Usage

```js
document = new CookieMock();

const now = new Date();
const future = new Date(now.now() + 60000) // in 60 seconds
const past = new Date(now.now() - 60000) // before 60 seconds

// add a new cookie
document.cookie = `cookie=hazelnut; expires=${future.toUTCString()}; path=/mouth; secure`;
console.log(document.cookie); // cookie=hazelnut; expires=Fri, 26 Jan 2017 12:01:00 GMT; path=/mouth; secure

// You can update the cookie
document.cookie = `cookie=triplechoc; expires=${future.toUTCString()}; path=/mouth; HttpOnly`;
console.log(document.cookie); // cookie=triplechoc; expires=Fri, 26 Jan 2017 12:01:00 GMT; path=/mouth; HttpOnly

// Delete the cookie by setting expires to be in the past
expires.setTime(expires.getTime() - 120000);
document.cookie = `cookie=; expires=${past.toUTCString()}; path=/mouth; HttpOnly`;
console.log(document.cookie); // empty
```

[npm-image]: https://badge.fury.io/js/ec.cookie-mock.svg
[npm-url]: https://www.npmjs.com/package/ec.cookie-mock
[travis-image]: https://travis-ci.org/entrecode/ec.cookie-mock.svg?branch=master
[travis-url]: https://travis-ci.org/entrecode/ec.cookie-mock
