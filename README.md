# downloadmedia

A web extension that allows media to be batch-downloaded from a web page.

## Usage

This extension has two key features.

1) Download all files of a particular media type by using the context menu

![Screenshot of menu](https://github.com/andywillis/downloadmedia/blob/main/documentation/screenshot.png)

2) Download an image from a page by moving the mouse over a thumbnail image and pressing `L` on the keyboard.

## Configuration

New in release 2.0.0 is the option to amend the menu configuration file to better suit users' individual needs.

The configuration file can be imported/exported/reset from the extension options menu. A cursory knowledge of JSON is required.

![Screenshot of menu](https://github.com/andywillis/downloadmedia/blob/main/documentation/screenshot2.png)

The configuration file is a JSON file that contains the information to build the menu.

- `id`: A unique identifier for the menu item (required)
- `level`: what level the menu is (required)
- `title`: The text that appears in the menu item (required)
- `extensions`: A list of extensions associated with that menu item. Each extension is preceded by a period/full-stop, and separated by a pipe (`|`) operator (required only on those menu items responsible for downloading files).
- `parentId`: used to link a child menu item to its parent `id` (required only on sub-menu items that need to link to a parent `id`).
- `icons`: Adds an icon set (available in six colours: red, yellow, green, purple, blue, and gray) to the menu item.

### Examples of configuration files

[Here is the default configuration](https://github.com/andywillis/downloadmedia/blob/main/documentation/configuration-examples/default.json). There are two levels of menu. The first to define "Audio", "Document", "Image", and "Video", and a second level that specifies individual _types_ of media linked back to the parent by the `parentId` property.

[Here is an example of how the configuration in version 1.0.0 looked](https://github.com/andywillis/downloadmedia/blob/main/documentation/configuration-examples/version1.json). This is just one level

[Here is an example of a one-level "grouped" menu](https://github.com/andywillis/downloadmedia/blob/main/documentation/configuration-examples/grouped.json). Here clicking on any of the menu items downloads _all_ of the associated file types.

### Import

Import a configuration JSON file. The import procedure does some basic error checking and warns if there's a problem.

Note 1: you can use a site like [json.parser.online.fr/](json.parser.online.fr/) to test that the updated configuration parses properly.

Note 2: if the updated configuration doesn't work you can reset to the default configuration. 

### Export

Export the current configuration file to a location of the users' choosing as JSON.

### Reset

Reset the menu to its default configuration.
