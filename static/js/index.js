define(function(require) {
    require('bootstrap/js/bootstrap.min');
    require('bootstrap-wysiwyg/external/jquery.hotkeys');
    require('bootstrap-wysiwyg/bootstrap-wysiwyg');
    $(function() {
        $("#wysiwygEditor").wysiwyg({
            activeToolbarClass: 'btn-active'
        });
    });
});
