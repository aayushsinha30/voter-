module.exports = new Proxy({}, {
  get: function getter(target, key) {
    return function MockIcon(props) {
      return null;
    };
  }
});
