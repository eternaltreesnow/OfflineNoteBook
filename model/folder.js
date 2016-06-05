define(function(require, exports, module) {
    var Note = require('../model/Note');

    function _getMaxFolderId() {
        var max_id = JSON.parse(localStorage.getItem('max-id'));
        var id = parseInt(max_id.folder_id) + 1;
        max_id.folder_id = id;
        localStorage.setItem('max-id', JSON.stringify(max_id));
        return id;
    }

    function _getFolderList() {
        return JSON.parse(localStorage['folder']);
    }

    function _setFolder(folderList) {
        localStorage.setItem('folder', JSON.stringify(folderList));
    }

    exports.initial = function _init() {
        if (localStorage['folder'] === undefined) {
            localStorage.setItem('folder', '[]');
        }
    }

    exports.getFoldersByUserId = function _getFoldersByUserId(userId) {
        var folder = _getFolderList();
        var folderList = new Array();
        folder.map(function(item) {
            if (item.u_id === parseInt(userId)) {
                folderList.push(item);
            }
        });
        return folderList;
    }

    exports.createFolder = function _create(userId, title) {
        var folderList = _getFolderList();
        var folder = new Object();
        folder.id = _getMaxFolderId();
        folder.u_id = parseInt(userId);
        folder.title = title;
        folderList.push(folder);
        localStorage.setItem('folder', JSON.stringify(folderList));
        return folder;
    }

    exports.deleteFolderById = function _deleteById(folderId, userId) {
        if (folderId === undefined) {
            return JSON.stringify({
                'status': 400,
                'info': 'Delete failed, folder id is null'
            });
        } else if (parseInt(userId) === 0 || userId === undefined) {
            return JSON.stringify({
                'status': 300,
                'info': 'User invalid'
            });
        }
        var folderList = _getFolderList();
        var resultList = new Array();
        for (var i = 0, n = 0; i < folderList.length; i++) {
            if (folderList[i].id !== parseInt(folderId)) {
                resultList[n] = folderList[i];
                n++;
            }
        }
        _setFolder(resultList);
        return JSON.stringify({
            'status': 200,
            'info': 'Delete folder successfully'
        });
    }

    exports.getTitleById = function _getTitleById(folderId) {
        var folderList = _getFolderList();
        var title = '';
        folderList.map(function(item) {
            if (item.id === parseInt(folderId)) {
                title = item.title;
            }
        });
        return title;
    }
});
