# Raph

> **WordPress plugin that helps you render shortcodes to actual HTML.**

----

## Sorry?

Shortcodes may be useful, but rendering them "on the fly" can be a performarce killer.

Moreover, shortcodes added by themes or by plugins, lock you in with those products, because you if you change
theme or unistall plugins that add shortcodes than your content is bungled when not lost. 

## How it Works

Raph adds a button in in post editor toolbar. When you click that button,
all the shortcodes in the post are converted to same HTML they would output in frontend.

HTML is generated via AJAX and is not saved until you save post.
You also have possibility to immedialy restore shortcodes.

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
 - cloning this repo using git

----

## License

Raph is licensed under [MIT](http://opensource.org/licenses/MIT)
