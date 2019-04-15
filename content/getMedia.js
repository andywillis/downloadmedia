(function () {

  const sites = Object.keys(hosts);
  const { host } = new URL(window.location.href);

  function qsa(selector, context = document) {
    return context.querySelectorAll(selector);
  }

  function getMedia(type) {
    if (sites.includes(host) && hosts[host].frontend === 'img') {
      return [...qsa(`img[src*=".${type}"]`)].map(({ src }) => src);
    }
    return [...qsa(`a[href*=".${type}"]`)].map(({ href }) => href);
  }

  function wrangleMedia(msg) {
    const { trigger } = msg;
    if (trigger === 'wrangleMedia') {
      const { data: { type } } = msg;
      const urlArray = getMedia(type);
      if (urlArray.length) {
        const data = { host, urlArray };
        const msg = { trigger: 'downloadMedia', data };
        browser.runtime.sendMessage(msg);
      }
    }
  }

  browser.runtime.onMessage.addListener(wrangleMedia);

}());
