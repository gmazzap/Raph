<?php
/**
 * @author  Giuseppe Mazzapica <giuseppe.mazzapica@gmail.com>
 * @license http://opensource.org/licenses/MIT MIT
 */
namespace Raph;

/**
 * Used to render post shortcodes via AJAX.
 *
 * @package Raph
 */
class Renderer
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
     * Does security checks then takes content from AJAX POST data and send back rendered content
     * as JSON. Runs on 'wp_ajax_raph-render' action (set in main plugin file).
     */
    public function render()
    {
        if (defined('DOING_AJAX') && DOING_AJAX) {
            $this->formData->check() or wp_send_json_error();
            $data = [
                'success' => true,
                'data'    => ['content' => do_shortcode(filter_input(INPUT_POST, 'content'))],
            ];
            @header('Content-Type: application/json; charset='.get_option('blog_charset'));
            echo wp_json_encode($data, JSON_PRETTY_PRINT);
            wp_die();
        }
    }
}
