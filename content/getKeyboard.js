(function () {

  const { host } = new URL(window.location.href);

  const mouse = { x: 0, y: 0 };

  function handleKeyup(e) {
    if (e.key === 'l') {
      const el = document.elementFromPoint(mouse.x, mouse.y);
      if (el.tagName === 'IMG') {
        const urlArray = [];
        if (/.(jpg|gif|bmp|jpeg)/.test(el.parentNode.href)) {
          urlArray.push(el.parentNode.href);
        } else {
          urlArray.push(el.src);
        }
        const data = { host, urlArray };
        const msg = { trigger: 'downloadMedia', data };
        browser.runtime.sendMessage(msg);
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
