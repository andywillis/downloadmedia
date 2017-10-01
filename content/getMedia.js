(function () {

  function qsa(selector, context = document) {
    return context.querySelectorAll(selector);
  }

  function getMedia(type) {
    return [...qsa(`a[href$=".${type}"]`)].map((el) => {
      return el.href;
    });
  }

  function wrangleMedia(info) {
    const media = getMedia(info.type);
    if (media.length) {
      browser.runtime.sendMessage({ media });
    }
  }

  browser.runtime.onMessage.addListener(wrangleMedia);

}());
