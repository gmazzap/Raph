<?php
/**
 * @author  Giuseppe Mazzapica <giuseppe.mazzapica@gmail.com>
 * @license http://opensource.org/licenses/MIT MIT
 */
namespace Raph;

use WP_Post;

/**
 * Handle post object recognition on post editing admin screen.
 *
 * @package Raph
 */
class PostProvider
{
    /**
     * @var WP_Post
     */
    private $post;

    /**
     * Run on 'admin_init' and get current post object information form request (for existing post)
     * or from 'new_to_auto-draft' hoof for new posts.
     *
     * @return PostProvider
     */
    public function init()
    {
        $this->fromRequest() or $this->onTransition();

        return $this;
    }

    /**
     * @return WP_Post
     */
    public function get()
    {
        return $this->post;
    }

    private function fromRequest()
    {
        if (is_null($this->post)) {
            $p_get = filter_input(INPUT_GET, 'post', FILTER_SANITIZE_NUMBER_INT);
            $p_post = filter_input(INPUT_POST, 'post', FILTER_SANITIZE_NUMBER_INT);
            if ($p_get > 0 || $p_post > 0) {
                $this->post = $p_get > 0 ? get_post($p_get) : get_post($p_post);
            }
        }

        return $this->post instanceof WP_Post;
    }

    private function onTransition()
    {
        if ($GLOBALS['pagenow'] === 'post-new.php' && is_null($this->post)) {
            add_action('new_to_auto-draft', function (WP_Post $post) {
                $this->post = $post;
            }, 0);
        }
    }
}
