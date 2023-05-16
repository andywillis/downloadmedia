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
    id: 'audio',
    level: 1,
    title: 'Audio',
    icons: {
      16: 'icons/red-16.png',
      32: 'icons/red-32.png'
    }
  },
  {
    id: 'document',
    level: 1,
    title: 'Document',
    icons: {
      16: 'icons/blue-16.png',
      32: 'icons/blue-32.png'
    }
  },
  {
    id: 'image',
    level: 1,
    title: 'Image',
    icons: {
      16: 'icons/green-16.png',
      32: 'icons/green-32.png'
    }
  },
  {
    id: 'video',
    level: 1,
    title: 'Video',
    icons: {
      16: 'icons/gray-16.png',
      32: 'icons/gray-32.png'
    }
  },

  // Level 2... that show the types of media under those main sections.

  // id:         must be UNIQUE.
  // title:      the text that appears in the menu.
  // parentId:   must link to the id of the parent menu the item.
  // extensions: a string describing the extension(s) associated with that
  //             media type. If there is more than one extension (for example
  //             jpg might have both "jpg" and "jpeg" associated with it)
  //             they should be separated by a pipe operator '|'
  //             e.g. 'jpg|jpeg'
  // icons:      the icon set to be used. This generally mirrors the set used
  //             by its parent

  // Audio subsection
  {
    id: 'mp3',
    level: 2,
    title: 'MP3',
    parentId: 'audio',
    extensions: '.mp3',
    icons: {
      16: 'icons/red-16.png',
      32: 'icons/red-32.png'
    }
  },

  // Documents subsection
  {
    id: 'pdf',
    level: 2,
    title: 'PDF',
    parentId: 'document',
    extensions: '.pdf',
    icons: {
      16: 'icons/blue-16.png',
      32: 'icons/blue-32.png'
    }
  },
  {
    id: 'txt',
    level: 2,
    title: 'TXT',
    parentId: 'document',
    extensions: '.txt',
    icons: {
      16: 'icons/blue-16.png',
      32: 'icons/blue-32.png'
    }
  },

  // Image subsection
  {
    id: 'gif',
    level: 2,
    title: 'GIF',
    parentId: 'image',
    extensions: '.gif',
    icons: {
      16: 'icons/green-16.png',
      32: 'icons/green-32.png'
    }
  },
  {
    id: 'jpg',
    level: 2,
    title: 'JPG',
    parentId: 'image',
    extensions: '.jpg|.jpeg',
    icons: {
      16: 'icons/green-16.png',
      32: 'icons/green-32.png'
    }
  },
  {
    id: 'png',
    level: 2,
    title: 'PNG',
    parentId: 'image',
    extensions: '.png',
    icons: {
      16: 'icons/green-16.png',
      32: 'icons/green-32.png'
    }
  },

  // Video subsection
  {
    id: 'mp4',
    level: 2,
    title: 'MP4',
    parentId: 'video',
    extensions: '.mp4',
    icons: {
      16: 'icons/gray-16.png',
      32: 'icons/gray-32.png'
    }
  },
  {
    id: 'mpg',
    level: 2,
    title: 'MPG',
    parentId: 'video',
    extensions: '.mpg',
    icons: {
      16: 'icons/gray-16.png',
      32: 'icons/gray-32.png'
    }
  }

];
