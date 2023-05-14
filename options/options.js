(async function () {

  const buttons = document.querySelector('.buttons');
  const message = document.querySelector('.message');

  function pad(str) {
    return str.toString().length === 1 ? `0${str}` : str;
  }

  function formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${pad(day)}-${pad(month + 1)}-${year}`;
  }

  async function handleExport() {
    const { config } = await browser.storage.local.get('config');
    const type = 'application/json';
    const data = JSON.stringify(config === undefined ? {} : config);
    const blob = new Blob([data], { type });
    const urlObj = URL.createObjectURL(blob);
    try {
      const id = await browser.downloads.download({
        filename: `downloadMedia.config-${formatDate()}.json`,
        url: urlObj,
        saveAs: true,
        conflictAction: 'overwrite'
      });
      browser.downloads.erase({ id });
      message.classList.add('ok');
      message.textContent = 'Configuration exported';
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLoadConfig(e) {
    try {
      const { result: data } = e.target;
      const config = JSON.parse(data);
      await browser.storage.local.set({ config });
      message.classList.add('ok');
      message.textContent = 'Configuration imported';
      browser.runtime.sendMessage({ action: 'rebuildMenu' });
    } catch (err) {
      message.classList.add('error');
      message.textContent = 'Error importing configuration - file invalid';
    }
  }

  function handleChange(e) {
    e.target.removeEventListener('change', handleChange);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.addEventListener('loadend', handleLoadConfig);
    reader.addEventListener('error', err => console.error(err));
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.acceptCharset = 'utf-8';
    input.click();
    input.addEventListener('change', handleChange, false);
  }

  async function handleReset() {
    await browser.storage.local.set({ config });
    message.classList.add('ok');
    message.textContent = 'Configuration reset';
    browser.runtime.sendMessage({ action: 'rebuildMenu' });
  }

  function handleClick(e) {
    const { dataset: { action } } = e.target;
    if (action === 'import') handleImport();
    if (action === 'export') handleExport();
    if (action === 'reset') handleReset();
  }

  buttons.addEventListener('click', handleClick, false);

}());
