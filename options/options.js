(async function () {

  let settings = {};

  function getArchiveLength(archive) {
    return archive ? Object.values(archive).reduce((acc, c) => {
      return acc + c.length;
    }, 0) : 0;
  }

  const qs = selector => document.querySelector(selector);

  const hashCount = qs('td[data-value="hashCount"]');
  const buttons = qs('section.buttons');
  const imageFolder = qs('input[data-value="imageFolder"]');
  const archiveFolder = qs('input[data-value="archiveFolder"]');
  const yesButton = qs('button.yes');
  const noButton = qs('button.no');

  function pad(str) {
    return str.toString().length === 1 ? `0${str}` : str;
  }

  async function updateArchiveCount() {
    const { archive } = await browser.storage.local.get('archive');
    hashCount.textContent = `${getArchiveLength(archive).toLocaleString()} images`;
  }

  async function updateInputs() {
    const { settings } = await browser.storage.local.get('settings');
    imageFolder.value = settings.imageFolder;
    archiveFolder.value = settings.archiveFolder;
  }

  updateInputs();
  updateArchiveCount();

  function formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${pad(day)}-${pad(month + 1)}-${year}`;
  }

  async function handleExport() {
    const { archive } = await browser.storage.local.get('archive');
    const { settings } = await browser.storage.local.get('settings');
    const type = 'application/json';
    const data = JSON.stringify(archive === undefined ? {} : archive);
    const blob = new Blob([data], { type });
    const urlObj = URL.createObjectURL(blob);
    try {
      const id = await browser.downloads.download({
        filename: `${settings.archiveFolder}/archive-${formatDate()}.json`,
        url: urlObj,
        saveAs: true,
        conflictAction: 'overwrite'
      });
      browser.downloads.erase({ id });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLoadArchive(e) {
    const { result: data } = e.target;
    const archive = JSON.parse(data);
    await browser.storage.local.set({ archive });
    updateArchiveCount();
  }

  function handleChange(e) {
    e.target.removeEventListener('change', handleChange);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.addEventListener('loadend', handleLoadArchive, false);
    reader.addEventListener('error', err => console.error(err), false);
  }

  function handleImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.acceptCharset = 'utf-8';
    input.click();
    input.addEventListener('change', handleChange, false);
  }

  function handleClear() {
    [yesButton, noButton].forEach(button => button.classList.add('visible'));
  }

  function removeOptionButtons() {
    [yesButton, noButton].forEach(button => button.classList.remove('visible'));
  }

  function handleNo() {
    removeOptionButtons();
  }

  async function handleYes() {
    const archive = {};
    browser.storage.local.set({ archive });
    updateArchiveCount();
    removeOptionButtons();
  }

  function handleInput(e) {
    const { dataset: { value: prop }, value } = e.target;
    settings = { ...settings, [prop]: value };
    browser.storage.local.set({ settings });
  }

  function handleClick(e) {
    const { dataset: { action } } = e.target;
    switch (action) {
      case 'import': handleImport(); break;
      case 'export': handleExport(); break;
      case 'clear': handleClear(); break;
      case 'yes': handleYes(); break;
      case 'no': handleNo(); break;
    }
  }

  imageFolder.addEventListener('change', handleInput, false);
  archiveFolder.addEventListener('change', handleInput, false);
  buttons.addEventListener('click', handleClick, false);

  browser.runtime.onMessage.addListener(({ trigger }) => {
    if (trigger === 'updateCount') updateArchiveCount();
  });

}());
