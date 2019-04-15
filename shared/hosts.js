/* eslint no-unused-vars: 0 */
const hosts = {

  'fineartteens.com': {
    frontend: 'img',
    type: 'shallow',
    root: 'http://pic.fineartteens.com/fineartteens/galleries/',
    fn: url => url.replace(/\/t_/g, '/')
  },

  'imagebam.com': {
    type: 'deep',
    regex: /meta property="og:image" content="(http[a-zA-Z:/0-9.%_-]+)"/i,
    fn: (html, regex) => html.match(regex)[1]
  },

  'imagevenue.com': {
    type: 'deep',
    regex: /img id=["']thepic["'].*[src|SRC]=["']([a-zA-Z:/0-9.%_-]+)["']/i,
    fn: (html, regex, url) => {
      const pre = url.match(/img[\d]+.imagevenue.com/);
      const path = html.match(regex)[1];
      return `http://${pre}/${path}`;
    }
  },

  'imgbox.com': {
    type: 'deep',
    regex: /id="img".*?src="(.*?)"/,
    fn: (html, regex) => html.match(regex)[1]
  },

  'pixhost.to': {
    type: 'deep',
    regex: /id="image".*?src="(.*?)"/,
    fn: (html, regex) => html.match(regex)[1]
  },

  'pimpandhost.com': {
    type: 'deep',
    regex: /class="normal".*?src="(.*?)"/,
    fn: (html, regex) => {
      const path = html.match(regex)[1];
      return `https:${path}`;
    }
  },

  'https://sexxypin.com': {
    type: 'deep',
    regex: /id="post-featured-photo"(?:\n|.)*?class="featured-thumb"(?:.*?)src="(.*?)"/,
    fn: (html, regex) => html.match(regex)[1]
  }

};
