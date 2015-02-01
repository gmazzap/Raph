/**
 * Part of Raph WordPress plugin
 * Author: Giuseppe Mazzapica <giuseppe.mazzapica@gmail.com>
 * License: MIT
 */

(function ( $, T, R, ajaxurl, document ) {

    R.methods = {};
    R.backup = {};

    /**
     * First function launched when Raph button is clicked.
     *
     * @param editor {Object} TinyMCE Editor
     */
    R.methods.updateEditor = function ( editor ) {
        var content = editor.getContent();
        if ( content.search( /\[.+\]/ ) !== -1 ) {
            if ( $( '#raph-notice' ).length ) {
                $( '#raph-notice' ).remove();
            }
            R.methods.render( content, editor );
        } else {
            R.methods.htmlNotice( R.i18n.no_shortcodes, 'error' );
        }
    };

    /**
     * Launches the AJAX call, and output a notice in both cases request was successful or not.
     *
     * @param content {String} Current editor content
     * @param editor {Object} TinyMCE Editor object
     */
    R.methods.render = function ( content, editor ) {
        R.methods.backup( editor, content );
        R.methods.ajaxCall( content )
            .done( function ( result ) {
                R.methods.ajaxDone( result, editor );
            } ).fail( function () {
                R.methods.htmlNotice( R.i18n.ajax_error, 'error' );
                R.backup = {};
            } );
    };

    /**
     * Performs the AJAX request.
     *
     * @param {String} content Current shortcode content
     * @returns {jqXHR}
     */
    R.methods.ajaxCall = function ( content ) {
        return $.ajax( {
            type:     "POST",
            url:      ajaxurl,
            dataType: "json",
            cache:    false,
            data:     {
                action:     'raph-render',
                pid:        R.data.pid,
                type:       R.data.type,
                raph_check: R.data.raph_check,
                content:    content
            }
        } );
    };

    /**
     * Runs when AJAx request was successful.
     * Updates editor content and print success notice.
     * Finally adds an event to editor to see when editor content has been changed.
     *
     * @param result {Object} JSON returned by AJAX
     * @param editor {Object} TinyMCE Editor object
     */
    R.methods.ajaxDone = function ( result, editor ) {
        if ( result.success && result.data.content ) {
            editor.setContent( result.data.content );
            var text = R.i18n.notice;
            text += ' <a id="raph-restore" href="#wp-content-wrap">' + R.i18n.restore + '</a>';
            R.methods.htmlNotice( text, 'updated' );
            editor.onChange.add( function () {
                if ( R.backup.editor ) {
                    R.backup[ 'changed' ] = true;
                }
            } );
        } else {
            R.methods.htmlNotice( R.i18n.ajax_error, 'error' );
            R.backup = {};
        }
    };

    /**
     * Used to print both success and error notice.
     * Error notices are auto deleted via timeout.
     *
     * @param text {String} Notice text
     * @param type {String} Used for HTML class of the notics
     */
    R.methods.htmlNotice = function ( text, type ) {
        $( '#wp-content-wrap' ).prepend(
            '<div id="raph-notice" class="' + type + '"><p>' + text + '</p></div>'
        );
        if ( type === 'error' ) {
            setTimeout( function () {
                $( '#raph-notice' ).remove();
            }, 5000 );
        }
    };

    /**
     * Stores original content and editor object to be used for restoring if required.
     *
     * @param editor {Object} TinyMCE Editor object
     * @param content {String} Content before rendering
     */
    R.methods.backup = function ( editor, content ) {
        R.backup[ 'editor' ] = editor;
        R.backup[ 'content' ] = content;
        R.backup[ 'changed' ] = false;
    };

    /**
     * Runs when a content restore is required by user.
     * If the content has changed a confirmation is required, because new content will be lost.
     */
    R.methods.restoreContentConfirm = function () {
        if ( R.backup.editor ) {
            var should = !R.backup[ 'changed' ];
            if ( !should ) {
                should = confirm( R.i18n.conf1 + "\n" + R.i18n.conf2 );
            }
            if ( should ) {
                R.methods.restoreContent();
                $( '#raph-notice' ).remove();
                R.backup = {};
            }
        }

    };

    /**
     * Actually restores editor content to how it was before rendering.
     */
    R.methods.restoreContent = function () {
        if ( R.backup.editor ) {
            R.backup.editor.setContent( R.backup.content );
        }
    };

    /**
     * Uses TinyMCE API to add Raph custom button.
     */
    T.PluginManager.add( 'raph_render', function ( editor, url ) {
        editor.addButton( 'raph_render', {
            title:   R.i18n.button_title,
            icon:    'raph dashicons-admin-appearance',
            onclick: function () {
                R.methods.updateEditor( editor );
            }
        } );
    } );

    // Events

    $( document ).on( 'click', '#raph-restore', function ( e ) {
        e.preventDefault();
        R.methods.restoreContentConfirm();
    } );

})( jQuery, tinymce, Raph, ajaxurl, document );