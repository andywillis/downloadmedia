# downloadmedia

A web extension that allows media to be batch-downloaded from a web page.

## Usage

1) Right click to display the context menu. The default menu displays a default configuration:




2) Users can download the configuration file, amend it, and upload it to the extension to modify their menus.

## Configuration

The configuration file is a JSON file that contains the information to build the menu.

At its most basic a menu item is `id`, `level`, `title`. `icons` can also be added. For sub-menu items (those that are at "level 2" a `parentId` is also necessary to link to the `id` of the object of which it's a child).

The configuration file can be imported/exported/reset from the extension options menu.
