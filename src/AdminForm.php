<?php
/**
 * @author  Giuseppe Mazzapica <giuseppe.mazzapica@gmail.com>
 * @license http://opensource.org/licenses/MIT MIT
 */
namespace Raph;

/**
 * Adds plugin scripts and scripts data.
 *
 * @package Raph
 */
class AdminForm
{
    /**
     * @var \Raph\FormData
     */
    private $formData;

    /**
     * @param \Raph\FormData $formData
     */
    public function __construct(FormData $formData)
    {
        $this->formData = $formData;
    }

    /**
     * Adds Raph button to TinyMCE toolbar and connect it with javascript file.
     * Runs on 'admin_init' hook (se in main plugin file).
     */
    public function setup()
    {
        add_action('admin_head', function () {
            echo "
              <style>
              i.mce-i-raph { font: 400 20px/1 dashicons; background-color: #777; }
              i.mce-i-raph:before { color: #fff!important; }
              </style>
            ";
        });
        add_action('admin_enqueue_scripts', function () {
            wp_localize_script('editor', 'Raph', $this->formData->data());
        });
        add_filter('mce_buttons', function (array $buttons) {
            return array_merge($buttons, ['raph_render']);
        });
        add_filter('mce_external_plugins', function (array $plugins) {
            return array_merge($plugins, ['raph_render' => $this->scriptUrl()]);
        });
    }

    private function scriptUrl()
    {
        $name = defined('WP_DEBUG') && WP_DEBUG ? "/js/raph.js" : "/js/raph.min.js";

        return plugins_url($name, dirname(__DIR__).'/Raph.php');
    }
}
