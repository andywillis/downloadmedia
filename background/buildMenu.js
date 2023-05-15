const documentUrlPatterns = ['<all_urls>'];

async function getConfig() {
  const checkConfig = await browser.storage.local.get('config');
  if (!Object.keys(checkConfig).length) {
    await browser.storage.local.set({ config });
  }
  return browser.storage.local.get('config');
}

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

function downloadMedia({ extensions }) {
  getCurrentTab().then(function (tabInfo) {
    browser.tabs.sendMessage(tabInfo[0].id, { extensions });
  });
}

async function buildMenu() {

  await browser.menus.removeAll();

  (await getConfig()).config.forEach(item => {

    const {
      id,
      title,
      parentId,
      icons = undefined,
      extensions
    } = item;

    browser.menus.create({
      id,
      title,
      parentId,
      icons,
      contexts: ['all'],
      documentUrlPatterns,
      onclick: () => downloadMedia({ extensions })
    }, onCreated);

  });

}

buildMenu();

browser.runtime.onMessage.addListener(({ action }) => {
  if (action === 'rebuildMenu') buildMenu();
});
