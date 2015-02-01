# Raph

> **WordPress plugin that helps you render shortcodes to actual HTML.**

----

## Sorry?

Shortcodes may be useful, but rendering them "on the fly" can be a performance killer.

Moreover, shortcodes added by themes or by plugins, lock you in with those products, because you if you change
theme or uninstall plugins that add shortcodes, your content will be bungled when not lost.

## How it Works

Raph adds a button in in post editor toolbar. When you click that button,
all the shortcodes in the post are converted to the same HTML they would output in frontend.

HTML is generated via AJAX and is not saved until you save post.
You also have possibility to immediately restore shortcodes.

----

## Demo

![Raph demo](http://zoomlab.it/public/raph_plugin.gif)

----

## Requirements

- PHP 5.4+
- WordPress 4.0+

----

## Installation

The plugin is a Composer package and can be installed in plugin directory via:

    composer create-project gmazzap/raph
    
Alternatively, you can

 - download [last release](https://github.com/Giuseppe-Mazzapica/Raph/releases) zip file
 - clone this repo using git

----

## License

Raph is licensed under [MIT](http://opensource.org/licenses/MIT)
