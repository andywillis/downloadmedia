// Modified icons from <a href="https://www.flaticon.com/free-icons/jpg" title="jpg icons">Jpg icons created by Dimitry Miroliubov - Flaticon</a>

// There are six sets of icons.
// Each icon set has both a 16 pixel and a 32 pixel PNG image,
// and is one of six colours. Red, yellow, green, purple, blue, and gray.

// eslint-disable-next-line no-unused-vars
const config = [

  // Level 1 - these objects without parentIds are the
  // top level menu items describing the types of media
  // that can be downloaded. These are further broken down
  // into sub-objects (see level 2).
  // Currently there are four main types:
  // Audio, Documents, Image, and Video.

  // id:    must be UNIQUE.
  // title: the text that appears in the menu.
  // icons: the icon set to be used.
  {
    id: 'pdf',
    level: 1,
    title: 'PDF',
    extensions: '.pdf',
    icons: {
      16: 'icons/red-16.png',
      32: 'icons/red-32.png'
    }
  },
  {
    id: 'jpg',
    level: 1,
    title: 'JPG',
    extensions: '.jpg|.jpeg',
    icons: {
      16: 'icons/blue-16.png',
      32: 'icons/blue-32.png'
    }
  },
  {
    id: 'mp3',
    level: 1,
    title: 'MP3',
    extensions: '.mp3',
    icons: {
      16: 'icons/green-16.png',
      32: 'icons/green-32.png'
    }
  }
];
