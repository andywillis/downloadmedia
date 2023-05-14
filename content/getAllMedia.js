(function () {

  const illegal = /[%&{}<>*? $!"'\\;,^#|@]/g;

  function decodeURI(url) {
    return decodeURIComponent(url);
  }

  function wrangleURL(url, type) {

    // check for redirect
    const arr = url.split('q=http');
    const regex = new RegExp(`^(http.*.${type})`);
    const decoded = arr.length > 1 ? decodeURI(`http${arr[1]}`) : decodeURI(url);
    return decoded.match(regex)[1];
  }

  function fixURL(url) {
    return url.replace(illegal, '-');
  }

  function getExtension(href) {
    return href.split('.').at(-1);
  }

  function getMedia(extensions) {

    const selector = extensions
      .split('|')
      .map(type => `a[href*=".${type}"]`)
      .join(', ');

    return [...document.querySelectorAll(selector)].map(({ href }) => {
      return fixURL(wrangleURL(href, getExtension(href)));
    });

  }

  function wrangleMedia({ extensions }) {
    const media = getMedia(extensions);
    if (media.length) {
      browser.runtime.sendMessage({ type: 'all', media });
    }
  }

  browser.runtime.onMessage.addListener(wrangleMedia);

}());
