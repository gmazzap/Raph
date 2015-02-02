/**
 * Part of Raph WordPress plugin
 * Author: Giuseppe Mazzapica <giuseppe.mazzapica@gmail.com>
 * License: MIT
 */

(function ( $, T, R, ajaxurl, document ) {

    "use strict";

    R.methods = {};
    R.backup = {};
    R.info = {};

    /**
     * First function launched when Raph button is clicked.
     * Gets data, performs checks and launches rendering.
     *
     * @param {tinymce.Editor} editor TinyMCE Editor object
     */
    R.methods.updateEditor = function ( editor ) {
        if ( R.info.whileRendering ) {
            return false;
        }
        var get = R.methods.getContent( editor );
        if ( get.content.search( /\[.+\]/ ) !== -1 ) {
            if ( !get.isSelection ) {
                editor.windowManager.confirm( R.i18n.confAll, function ( confirm ) {
                    if ( confirm ) {
                        R.methods.render( editor, get.content, get.isSelection );
                    }
                } );
            } else {
                R.methods.render( editor, get.content, get.isSelection );
            }
        } else {
            R.methods.htmlNotice( R.i18n.noShortcodes, 'error' );
        }
    };

    /**
     * Get content to process from editor, and check if is a selection or the whole post content.
     *
     * @param {String} editor
     * @returns {{content: String, isSelection: Boolean}}
     */
    R.methods.getContent = function ( editor ) {
        var content, isSelection;
        if ( !editor.selection.isCollapsed() ) {
            content = editor.selection.getContent();
            isSelection = true;
            R.info.currentSelection = content;
        } else {
            content = editor.getContent();
            isSelection = false;
        }
        return {
            content:     content,
            isSelection: isSelection
        };
    };

    /**
     * Launches the AJAX call, and output a notice in both cases request was successful or not.
     *
     * @param {tinymce.Editor} editor TinyMCE Editor object
     * @param {String}  content Current editor content
     * @param {Boolean} isSelection When true content is a selection
     */
    R.methods.render = function ( editor, content, isSelection ) {
        R.methods.startRendering( editor );
        R.methods.backup( editor, editor.getContent() );
        if ( $( '#raph-notice' ).length ) {
            $( '#raph-notice' ).remove();
        }
        R.methods.ajaxCall( content )
            .done( function ( result ) {
                R.methods.ajaxDone( result, editor, isSelection );
            } ).fail( function () {
                R.methods.htmlNotice( R.i18n.ajaxError, 'error' );
                R.backup = {};
            } ).always( function () {
                R.methods.endRendering( editor );
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
                action:    'raph-render',
                pid:       R.data.pid,
                type:      R.data.type,
                raphCheck: R.data.raphCheck,
                content:   content
            }
        } );
    };

    /**
     * Runs when AJAx request was successful.
     * Updates editor content and print success notice.
     * Finally adds an event to editor to see when editor content has been changed.
     *
     * @param {Object} result JSON returned by AJAX
     * @param {tinymce.Editor} editor TinyMCE Editor object
     * @param {Boolean} selection When true content is a selection
     */
    R.methods.ajaxDone = function ( result, editor, selection ) {
        if ( result.success && result.data.content ) {
            if ( selection && editor.selection.getContent() !== R.info.currentSelection ) {
                R.backup = {};
                return false;
            } else if ( !selection ) {
                editor.setContent( result.data.content );
            } else {
                editor.selection.setContent( result.data.content );
            }
            var text = R.i18n.notice;
            text += ' <a id="raph-restore" href="#wp-content-wrap">' + R.i18n.restore + '</a>';
            R.methods.htmlNotice( text, 'updated' );
            editor.onChange.add( function () {
                if ( R.backup.editor ) {
                    R.backup.changed = true;
                }
            } );
        } else {
            R.methods.htmlNotice( R.i18n.ajaxError, 'error' );
            R.backup = {};
        }
    };

    /**
     * Used to print both success and error notice.
     * Error notices are auto deleted via timeout.
     *
     * @param {String} text Notice text
     * @param {String} type Used for HTML class of the notics
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
     * @param {tinymce.Editor} editor TinyMCE Editor object
     * @param {String} content Content before rendering
     */
    R.methods.backup = function ( editor, content ) {
        R.backup.editor = editor;
        R.backup.content = content;
        R.backup.changed = false;
    };

    /**
     * Runs when a content restore is required by user.
     * If the content has changed a confirmation is required, because new content will be lost.
     */
    R.methods.restoreContentConfirm = function () {
        if ( R.backup.editor ) {
            var should = !R.backup.changed;
            if ( !should ) {
                R.backup.editor.windowManager.confirm(
                    R.i18n.conf1 + "\n" + R.i18n.conf2,
                    function ( confirm ) {
                        R.methods.restoreContent();
                    }
                );
            } else {
                R.methods.restoreContent();
            }
        }

    };

    /**
     * Actually restores editor content to how it was before rendering.
     */
    R.methods.restoreContent = function () {
        if ( R.backup.editor ) {
            R.backup.editor.setContent( R.backup.content );
            $( '#raph-notice' ).remove();
            R.backup = {};
        }
    };

    /**
     * Set flags variable, add modal and disable button when rendering starts
     *
     * @param {tinymce.Editor} editor TinyMCE Editor object
     */
    R.methods.startRendering = function ( editor ) {
        var button = editor.controlManager.buttons.raphRender;
        button.icon( 'raph dashicons-clock' );
        button.disabled( true );
        R.info.whileRendering = true;
    };

    /**
     * Set flags variable, remove modal and re-enable button when rendering ends
     *
     * @param {tinymce.Editor} editor TinyMCE Editor object
     */
    R.methods.endRendering = function ( editor ) {
        var button = editor.controlManager.buttons.raphRender;
        button.icon( 'raph dashicons-admin-appearance' );
        button.disabled( false );
        R.info = {};
    };

    /**
     * Uses TinyMCE API to add Raph custom button.
     */
    T.PluginManager.add( 'raphRender', function ( editor ) {
        editor.addButton( 'raphRender', {
            title:   R.i18n.buttonTitle,
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