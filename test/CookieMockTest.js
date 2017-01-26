const chai = require('chai');

const CookieMock = require('../src/CookieMock');

chai.should();

describe('Mock Cookie', () => {
  let mock;
  beforeEach(() => {
    mock = new CookieMock();
  });
  afterEach(() => {
    mock = undefined;
  });
  it('adding cookies', () => {
    const foo = 'foo=bar; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1; secure';
    const hello = 'hello=world; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1; HttpOnly';

    mock.cookie.should.be.equal('');
    mock.cookie = foo;
    mock.cookie.should.be.equal(foo);
    mock.cookie = hello;
    mock.cookie.should.be.equal(`${foo};${hello}`);
  });
  it('replacing a cookie', () => {
    const foo = 'foo=bar; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1';
    const foo2 = 'foo=baz; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1';

    mock.cookie.should.be.equal('');
    mock.cookie = foo;
    mock.cookie.should.be.equal(foo);
    mock.cookie = foo2;
    mock.cookie.should.be.equal(foo2);
    mock.cookie = foo;
    mock.cookie.should.be.equal(foo);
  });
  it('expiring a cookie', () => {
    const expires = new Date();

    mock.cookie.should.be.equal('');
    expires.setTime(expires.getTime() + 60000); // 60 sec in the future
    let foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    mock.cookie.should.be.equal(foo);

    expires.setTime(expires.getTime() - 120000); // 60 sec in the past
    foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    mock.cookie.should.be.equal('');
  });
  it('expiring a single cookie when multiple exist', () => {
    const expires = new Date();

    mock.cookie.should.be.equal('');

    expires.setTime(expires.getTime() + 60000); // 60 s in the future
    let foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    mock.cookie.should.be.equal(foo);

    const hello = `hello=world; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = hello;
    mock.cookie.should.be.equal(`${foo};${hello}`);

    expires.setTime(expires.getTime() - 120000); // 60s in the past
    foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    mock.cookie.should.be.equal(hello);
  });
});
