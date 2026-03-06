const CookieMock = function CookieMock() {
  let cookieStore = [];
  const reserved = [
    'path',
    'domain',
    'max-age',
    'expires',
    'secure',
    'httponly',
  ];

  function isReserved(key) {
    return reserved.indexOf(key.toLowerCase()) !== -1;
  }

  function splitCookieItem(item) {
    const trimmed = item.trim();
    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      return [trimmed, undefined];
    }

    return [
      trimmed.slice(0, separatorIndex).trim(),
      trimmed.slice(separatorIndex + 1).trim(),
    ];
  }

  function name(cookie) {
    return cookie.split('=')[0].trim();
  }

  function toObject(cookieString) {
    const cookieName = name(cookieString);
    return cookieString.split(';')
    .reduce((obj, item) => {
      const [k, v] = splitCookieItem(item);
      if (!isReserved(k)) {
        obj.name = cookieName;
        obj.value = v;
      } else {
        obj[k] = v === undefined ? k : v;
      }
      return obj;
    }, {});
  }

  function toString(cookieObject) {
    return Object.keys(cookieObject)
    .reduce((cookieString, k) => {
      if (!isReserved(k)) {
        return cookieString;
      }
      return `${cookieString}; ${k === cookieObject[k] ? k : `${k}=${cookieObject[k]}`}`;
    }, `${cookieObject.name}=${cookieObject.value}`);
  }

  function getAllString() {
    let out = cookieStore.reduce((outString, cookie) => `${outString};${toString(cookie)}`, '');
    if (out.indexOf(';') === 0) {
      out = out.substr(1);
    }
    return out;
  }

  function expireCookies() {
    const now = new Date();
    cookieStore = cookieStore.filter(cookie => !cookie.expires || now < new Date(cookie.expires));
  }

  Object.defineProperty(this, 'cookie', {
    get: () => {
      expireCookies();
      return getAllString();
    },
    set: (cookieString) => {
      const cookieName = name(cookieString);
      cookieStore = cookieStore.filter(cookie => cookie.name !== cookieName);
      cookieStore.push(toObject(cookieString));
      return getAllString();
    },
  });
};

module.exports = CookieMock;
