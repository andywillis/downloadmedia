(async function () {

  function Downloader() {

    this.stack = {
      anchorObjs: [],
      urlObjs: [],
      compiled: [],
      idObjs: []
    };

    this.defaultSettings = {
      downloadFolder: ''
    };

    this.tabId = null;
    this.illegal = /[%&{}<>*?/ $!"':\\;,^#|@]/g;

    this.inProgress = {};
    this.completed = 0;
    this.total = 0;
    this.intervalsRunning = false;
    this.intervalTime = 750;
    this.intervals = [];
    this.downloadLimit = 5;

    this.init();

  }

  Downloader.prototype.init = async function () {
    this.initBadge();
    const settings = this.loadSettings();
    this.setSettings(settings);
    this.hosts = hosts;
    this.sites = Object.keys(this.hosts);
    this.regexes = this.extractRegexes();
  };

  Downloader.prototype.extractRegexes = function () {
    return this.sites.reduce((obj, c) => {
      obj[c] = new RegExp(hosts[c].regex);
      return obj;
    }, {});
  };

  Downloader.prototype.loadSettings = async function () {
    try {
      const { settings } = await browser.storage.local.get('settings');
      if (!settings || !Object.keys(settings).length) {
        this.settings = this.defaultSettings;
      } else {
        this.settings = settings;
      }
      console.log('Settings loaded');
    } catch (err) {
      console.error(err);
    }
  };

  Downloader.prototype.saveSettings = async function () {
    const { settings } = this;
    await browser.storage.local.set({ settings });
    console.log('Settings saved');
  };

  Downloader.prototype.initBadge = function () {
    browser.browserAction.setBadgeBackgroundColor({ color: 'black' });
    browser.browserAction.setBadgeTextColor({ color: 'white' });
  };

  Downloader.prototype.updateBadge = function () {
    if (this.total > 1000) {
      const str = `>${Math.floor(this.total / 1000)}K`;
      browser.browserAction.setBadgeText({ text: str });
    } else {
      browser.browserAction.setBadgeText({
        text: this.total > 0 ? this.total.toString() : ''
      });
    }
  };

  Downloader.prototype.clearIntervals = function () {
    this.intervals.forEach(timer => clearInterval(timer));
    this.intervalsRunning = false;
    console.log('Intervals stopped');
  };

  Downloader.prototype.phaseURLs = async function () {
    if (this.stack.anchorObjs.length) {
      const anchorObj = this.stack.anchorObjs.shift();
      const site = this.sites.find(site => anchorObj.url.includes(site));
      if (site) {
        const { type } = hosts[site];
        const { url, filename, extension } = anchorObj;
        if (type === 'shallow') {
          const { fn } = hosts[site];
          const deepUrl = fn(url);
          this.stack.urlObjs.push({ url: deepUrl, filename, extension });
        } else {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const text = await res.text();
              const regex = this.regexes[site];
              if (regex.test(text)) {
                const deepUrl = hosts[site].fn(text, regex, url);
                if (deepUrl !== null && deepUrl !== undefined) {
                  this.stack.urlObjs.push({ url: deepUrl, filename, extension });
                }
              }
            } else {
              throw new Error(url);
            }
          } catch (url) {
            this.updateBadge(--this.total);
            // this.updateBar();
            console.log(`Cannot process URL: ${url}`);
          }
        }
      } else {
        this.stack.urlObjs.push(anchorObj);
      }
    }
  };

  Downloader.prototype.phaseCompile = function () {
    if (this.stack.urlObjs.length) {
      const { url, filename, extension } = this.stack.urlObjs.shift();
      const endpoint = `${extension}/${filename}`;
      this.stack.compiled.push({ url, filename: endpoint, conflictAction: 'uniquify' });
    }
  };

  Downloader.prototype.phaseDownload = async function () {
    const inProgress = await browser.downloads.search({ state: 'in_progress' });
    if (this.stack.compiled.length && inProgress.length <= this.downloadLimit) {
      try {
        const obj = this.stack.compiled.shift();
        const id = await browser.downloads.download(obj);
        this.stack.idObjs.push({ ...obj, id });
      } catch (e) {
        console.log('Error downloading file');
      }
    }
  };

  Downloader.prototype.isStackEmpty = function () {
    return Object.values(this.stack).every(({ length }) => length === 0);
  };

  Downloader.prototype.startIntervals = function () {
    this.intervals[0] = setInterval(this.phaseURLs.bind(this), this.intervalTime);
    this.intervals[1] = setInterval(this.phaseCompile.bind(this), this.intervalTime);
    this.intervals[2] = setInterval(this.phaseDownload.bind(this), this.intervalTime);
    this.intervals[3] = setInterval(this.checkDone.bind(this), this.intervalTime * 4);
    this.intervalsRunning = true;
    console.log('Intervals started');
  };

  Downloader.prototype.clearDownload = function (id, url) {
    browser.downloads.erase({ id });
    browser.history.deleteUrl({ url });
  };

  Downloader.prototype.cancelDownload = function (id) {
    browser.downloads.cancel(id);
    browser.downloads.erase({ id });
  };

  Downloader.prototype.checkDownload = function (obj) {
    const { id: downloadId, totalBytes, state: { current } } = obj;
    const index = this.stack.idObjs.findIndex(({ id }) => id === downloadId);
    if (current === 'complete' && index !== null) {
      const { url } = this.stack.idObjs.splice(index, 1)[0];
      this.clearDownload(downloadId, url);
      this.updateBadge(--this.total);
      ++this.completed;
      // this.updateBar();
      if (totalBytes < 1024) browser.downloads.removeFile({ downloadId });
      if (this.total === 0) {
        this.completed = 0;
      }
    }
  };

  Downloader.prototype.checkDone = async function () {
    if (this.total === 0 && this.isStackEmpty()) {
      this.clearIntervals();
    } else {
      const inProgress = await browser.downloads.search({ state: 'in_progress' });
      // console.log(inProgress, this.total, this.stack.idObjs);
      if (inProgress.length) {
        inProgress.forEach((item) => {
          const { bytesReceived, id, url } = item;
          if (!this.inProgress[id]) {
            this.inProgress[id] = { attempts: 0, bytesReceived };
          } else {
            if (this.inProgress[id].bytesReceived === bytesReceived
              && this.inProgress[id].attempts < 5) {
              const index = this.stack.idObjs.findIndex(({ id: downloadId }) => downloadId === id);
              this.stack.idObjs.splice(index, 1);
              this.cancelDownload(id);
              const urlObj = this.createFilenameObj(url);
              this.stack.urlObjs.push(urlObj);
              ++this.inProgress[id].attempts;
            } else {
              this.cancelDownload(id);
              delete this.inProgress[id];
              --this.total;
            }
          }
        });
      }
    }
  };

  Downloader.prototype.createFilenameObj = function (url) {
    const temp1 = url.split('/');
    const temp2 = temp1.slice(temp1.length - 1)[0];
    const temp3 = temp2.split('=');
    const temp4 = temp3.slice(temp3.length - 1)[0];
    const temp5 = temp4.split('.');
    const extension = temp5[1];
    const withIllegal = `${temp5[0]}.${extension}`;
    const filename = withIllegal.replace(this.illegal, '-');
    return { url, filename, extension };
  };

  Downloader.prototype.wrangleRedirect = function (url) {
    const arr = url.split('q=http');
    return arr.length > 1
      ? decodeURIComponent(`http${arr[1]}`)
      : decodeURIComponent(url);
  };

  Downloader.prototype.fixUrls = function (urls) {
    return urls.map((url) => {
      const decoded = this.wrangleRedirect(url);
      return this.createFilenameObj(decoded);
    });
  };

  Downloader.prototype.filterUrls = function (host, urls) {
    return urls.filter((url) => {
      if (this.sites.includes(host)) {
        const { root } = this.hosts[host];
        return url.includes(root);
      }
      return url;
    });
  };

  Downloader.prototype.downloadMedia = function (host, urls) {
    const filtered = this.filterUrls(host, urls);
    const updated = this.fixUrls(filtered);
    this.stack.anchorObjs.push(...updated);
    this.total = this.stack.anchorObjs.length;
    this.updateBadge();
    if (!this.intervalsRunning) this.startIntervals();
  };

  Downloader.prototype.processMessage = function (msg) {
    const { trigger, data } = msg;
    switch (trigger) {
      case 'downloadMedia': {
        const { host, urlArray } = data;
        this.downloadMedia(host, urlArray);
        break;
      }
    }
  };

  Downloader.prototype.setTabId = function (tabId) {
    this.tabId = tabId;
  };

  Downloader.prototype.setSettings = function (settings) {
    this.settings = settings;
  };

  const downloader = new Downloader();

  browser.downloads.onChanged.addListener(function (msg) {
    downloader.checkDownload(msg);
  });

  browser.runtime.onMessage.addListener(function (msg) {
    downloader.processMessage(msg);
  });

}());
