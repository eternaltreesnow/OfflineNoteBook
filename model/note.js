define(function(require, exports, module) {
    var Folder = require('../model/folder');

    function _getMaxNoteId() {
        var max_id = JSON.parse(localStorage.getItem('max-id'));
        var id = parseInt(max_id.note_id) + 1;
        max_id.note_id = id;
        localStorage.setItem('max-id', JSON.stringify(max_id));
        return id;
    }

    function _getNoteList() {
        return JSON.parse(localStorage['note']);
    }

    function _setNote(noteList) {
        localStorage.setItem('note', JSON.stringify(noteList));
    }

    function _create(id, folderId, title) {
        var note = {
            id: parseInt(id),
            f_id: parseInt(folderId),
            title: title,
            date: new Date(),
            text: ''
        }
        var noteList = _getNoteList();
        noteList.push(note);
        _setNote(noteList);
        return note;
    }

    function _delete(id) {
        var noteList = _getNoteList();
        var resultList = new Array();
        for (var i = 0, n = 0; i < noteList.length; i++) {
            if (noteList[i].id !== parseInt(id)) {
                resultList[n] = noteList[i];
                n++;
            }
        }
        _setNote(resultList);
    }

    exports.initial = function _init() {
        if (localStorage['note'] === undefined) {
            localStorage.setItem('note', '[]');
        }
    }

    exports.getNoteByFolderId = function _getNoteByFolderId(folderId) {
        var note = _getNoteList();
        var noteList = new Array();
        note.map(function(item) {
            if (item.f_id === parseInt(folderId)) {
                noteList.push(item);
            }
        });
        return noteList;
    }

    exports.createNote = function _createNote(folderId, title) {
        var id = _getMaxNoteId();
        var title = title || '';
        return _create(id, folderId, title);
    }

    exports.getNoteById = function _getNoteById(noteId) {
        var noteList = _getNoteList();
        var note = new Object();
        noteList.map(function(item) {
            if (item.id === parseInt(noteId)) {
                note = item;
            }
        });
        return note;
    }

    exports.saveNote = function _save(id, title, text) {
        if (id === '0' || id === undefined) {
            return JSON.stringify({
                'status': 400,
                'info': 'Note id is invalid'
            });
        } else {
            var noteList = _getNoteList();
            noteList.map(function(item) {
                if (item.id === parseInt(id)) {
                    item.title = title;
                    item.text = text;
                }
            });
            _setNote(noteList);
            return JSON.stringify({
                'status': 200,
                'info': 'Save successfully'
            });
        }
    }

    exports.deleteNote = function _deleteNote(id) {
        if (id === '0' || id === undefined) {
            return JSON.stringify({
                'status': 400,
                'info': 'Note id is invalid'
            });
        } else {
            _delete(id);
            return JSON.stringify({
                'status': 200,
                'info': 'Delete successfully'
            });
        }
    }
});
