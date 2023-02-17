window.addEventListener = function noop() {};
window.location = {
  href: ''
};
global.document = {
    currentScript: null,
    location: {
            href: ''
    },
    getElementsByTagName() {
      return {
          length: 0
      }
    }
};