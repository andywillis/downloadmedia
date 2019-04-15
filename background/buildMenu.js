(async () => {

  function getCurrentTab() {
    return browser.tabs.query({
      currentWindow: true,
      active: true
    });
  }

  function onCreated() {
    if (browser.runtime.lastError) {
      console.log(`Error: ${browser.runtime.lastError}`);
    } else {
      console.log('Item created successfully');
    }
  }

  async function downloadMedia(menuInfo) {
    const tabInfo = await getCurrentTab();
    const data = { type: menuInfo.menuItemId };
    const msg = { trigger: 'wrangleMedia', data };
    browser.tabs.sendMessage(tabInfo[0].id, msg);
  }

  browser.browserAction.enable();

  browser.menus.create({
    id: 'pdf',
    title: 'PDF',
    contexts: ['all'],
    icons: {
      16: 'icons/pdf-16.png',
      32: 'icons/pdf-32.png'
    },
    onclick: downloadMedia
  }, onCreated);

  browser.menus.create({
    id: 'jpg',
    title: 'JPG',
    contexts: ['all'],
    icons: {
      16: 'icons/jpg-16.png',
      32: 'icons/jpg-32.png'
    },
    onclick: downloadMedia
  }, onCreated);

  browser.menus.create({
    id: 'mp3',
    title: 'MP3',
    contexts: ['all'],
    icons: {
      16: 'icons/mp3-16.png',
      32: 'icons/mp3-32.png'
    },
    onclick: downloadMedia
  }, onCreated);

})();
