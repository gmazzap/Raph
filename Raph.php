<?php
/*
Plugin Name: Raph
Plugin URI: http://github.com/Giuseppe-Mazzapica/Raph
Description: Add a button on Editor toolbar that when clicked render all shortcodes to actual HTML.
Version: 0.1
Author: Giuseppe Mazzapica
Author URI: http://gm.zoomlab.it
License: MIT
*/

/*
The MIT License (MIT)

Copyright (c) 2015 Giuseppe Mazzapica

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
namespace Raph;

if (! is_admin()) {
    return;
}

require_once __DIR__.'/vendor/autoload.php';

if (defined('DOING_AJAX') && DOING_AJAX) {
    add_action('wp_ajax_raph-render', [new Renderer(new FormData()), 'render']);
} elseif (in_array($GLOBALS['pagenow'], ['post.php', 'post-new.php'], true)) {
    add_action('admin_init', [new AdminForm(new FormData((new PostProvider())->init())), 'setup']);
}
