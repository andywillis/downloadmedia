(function () {

  const illegal = /[%&{}<>*?/ $!"':\\;,^#|@]/g;
  const mouse = { x: 0, y: 0 };

  function processUrl(url) {
    const filenameArr = url.split('/').pop().split('.');
    const extension = filenameArr.pop().substr(0, 3);
    const withIllegal = `${filenameArr.join('.')}.${extension}`;
    const filename = withIllegal.replace(illegal, '-');
    browser.runtime.sendMessage({ type: 'single', url, filename });
  }

  function handleKeyup(e) {
    if (e.key === 'l') {
      const el = document.elementFromPoint(mouse.x, mouse.y);
      if (el.tagName === 'IMG') {
        const url = el.parentNode.href;
        processUrl(url);
      }
    }
  }

  function handleMouse(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  document.addEventListener('keyup', handleKeyup, false);
  document.addEventListener('mousemove', handleMouse, false);

}());
