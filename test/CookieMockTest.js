const assert = require('node:assert/strict');

const CookieMock = require('../src/CookieMock');

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

    assert.equal(mock.cookie, '');
    mock.cookie = foo;
    assert.equal(mock.cookie, foo);
    mock.cookie = hello;
    assert.equal(mock.cookie, `${foo};${hello}`);
  });
  it('replacing a cookie', () => {
    const foo = 'foo=bar; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1';
    const foo2 = 'foo=baz; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1';

    assert.equal(mock.cookie, '');
    mock.cookie = foo;
    assert.equal(mock.cookie, foo);
    mock.cookie = foo2;
    assert.equal(mock.cookie, foo2);
    mock.cookie = foo;
    assert.equal(mock.cookie, foo);
  });
  it('expiring a cookie', () => {
    const expires = new Date();

    assert.equal(mock.cookie, '');
    expires.setTime(expires.getTime() + 60000); // 60 sec in the future
    let foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    assert.equal(mock.cookie, foo);

    expires.setTime(expires.getTime() - 120000); // 60 sec in the past
    foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    assert.equal(mock.cookie, '');
  });
  it('expiring a single cookie when multiple exist', () => {
    const expires = new Date();

    assert.equal(mock.cookie, '');

    expires.setTime(expires.getTime() + 60000); // 60 s in the future
    let foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    assert.equal(mock.cookie, foo);

    const hello = `hello=world; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = hello;
    assert.equal(mock.cookie, `${foo};${hello}`);

    expires.setTime(expires.getTime() - 120000); // 60s in the past
    foo = `foo=bar; expires=${expires.toUTCString()}; path=/; domain=127.0.0.1`;
    mock.cookie = foo;
    assert.equal(mock.cookie, hello);
  });

  it('preserves cookie and attribute values containing equal signs', () => {
    const cookieWithEquals = 'token=abc=123==; path=/a=b; domain=127.0.0.1; secure';

    mock.cookie = cookieWithEquals;
    assert.equal(mock.cookie, cookieWithEquals);
  });

  it('handles reserved attributes case-insensitively', () => {
    const cookieWithLowercaseFlags = 'foo=bar; expires=Fri, 01 Jan 3017 12:00:00 GMT; path=/; domain=127.0.0.1; httponly; SECURE';

    mock.cookie = cookieWithLowercaseFlags;
    assert.equal(mock.cookie, cookieWithLowercaseFlags);
  });
});
