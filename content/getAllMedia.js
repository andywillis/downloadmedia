(function () {

  function qsa(selector, context = document) {
    return context.querySelectorAll(selector);
  }

  const illegal = /[%&{}<>*? $!"'\\;,^#|@]/g;

  function decodeURI(url) {
    return decodeURIComponent(url);
  }
  
  function wrangleURL(url, type) {

    // check for redirect
    const arr = url.split('q=http');
    const regex = new RegExp(`^(http.*\.${type})`);
    const decoded = arr.length > 1 ? decodeURI(`http${arr[1]}`) : decodeURI(url); 
    return decoded.match(regex)[1];
  }
    
  function fixURL(url) {
    return url.replace(illegal, '-');
  }

  function getMedia(type) {
    return [...qsa(`a[href*=".${type}"]`)].map(({ href }) => {
      return fixURL(wrangleURL(href, type));
    });
  }

  function wrangleMedia(info) {
    const media = getMedia(info.type);
    if (media.length) {
      browser.runtime.sendMessage({ type: 'all', media });
    }
  }

  browser.runtime.onMessage.addListener(wrangleMedia);

}());
