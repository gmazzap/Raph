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
            $check = $this->formData->check();
            $check or wp_send_json_error();
            $this->buildContext($check);
            $data = [
                'success' => true,
                'data'    => ['content' => do_shortcode($check['content'])],
            ];
            @header('Content-Type: application/json; charset='.get_option('blog_charset'));
            echo wp_json_encode($data, JSON_PRETTY_PRINT);
            wp_die();
        }
    }

    private function buildContext(array $data)
    {
        global $wp, $wp_the_query, $post;
        $v = $data['type'] === 'page' ? 'page_id' : 'p';
        $wp->query_vars = [$v => $data['pid'], 'suppress_filters' => true];
        $wp->build_query_string();
        add_action('parse_query', function () {
            remove_all_actions('pre_get_posts');
        }, PHP_INT_MAX);
        $wp_the_query->query($wp->query_vars);
        $post = $wp_the_query->post;
        setup_postdata($post);
    }
}
