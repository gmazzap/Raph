# Raph

> **WordPress plugin that helps you to covert shortcodes to HTML.**

----

## Sorry?

Shortcodes may be useful, but rendering them "on the fly" can be a performance killer.

Moreover, shortcodes added by themes or by plugins, lock you in with those products, because you if you change
theme or uninstall plugins that add shortcodes, your content will be bungled when not lost.

Have you ever desired get rid of a plugin, but can't because of shorteds? Now you can.

## How it Works

Raph adds a button in in post editor toolbar. When you click that button

- if *nothing is selected* all the shortcodes in the post are converted to the same HTML they would output in frontend
- if *something is selected*, than only shortcodes in selection are converted

HTML is generated via AJAX and isn't saved until post is saved.

When post is saved, shortcodes are definitely converted to HTML, it means you can even disable the plugin (or switch the theme) that added the original shortcode.

After having rendered shortcodes there is the possibility to immediately restore shortcodes by clicking a link.

----

## Demo

![Raph demo](http://zoomlab.it/public/raph_plugin_03.gif)

----

## FAQ

 - ***How can I bulk convert shortcodes?***

   At the moment that isn't possible. *Maybe* it will be in future versions.
  
 - ***I selected a shortcode and clicked render button, but nothing happen, is it broken?***
 - 
   No. When you select some text, you have to keep the selection as is until rendering is complete. Otherwise Raph don't know where to put rendered HTML, and to avoid to mess up your post content it does nohing.



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

Raph is licensed under [MIT](http://opensource.org/licenses/MIT).
