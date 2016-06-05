define(function(require) {
    require('bootstrap/js/bootstrap.min');
    require('bootstrap-wysiwyg/external/jquery.hotkeys');
    require('bootstrap-wysiwyg/bootstrap-wysiwyg');
    var User = require('../../model/user');
    var Session = require('../../model/session');
    var Folder = require('../../model/folder');
    var Note = require('../../model/note');
    var setAlert = require('../js/alert');
    $(function() {
        var $noteEditor = $("#wysiwygEditor");
        $noteEditor.wysiwyg({
            activeToolbarClass: 'btn-active'
        });

        // Logout logic
        var $logoutContainer = $("#logoutContainer");
        var $logoutBtn = $("#logoutBtn");
        var $loginContainer = $("#loginContainer");
        var $loginId = $("#loginId");
        var $userName = $("#userName");
        $logoutBtn.on('click', function() {
            // clear session items
            Session.removeSession();
            initial();
        });
        // Login logic
        var $loginBtn = $("#loginBtn");
        var $loginModal = $("#loginModal");
        $loginBtn.on('click', function() {
            $loginModal.modal('show');
        });
        var $loginUsername = $("#loginForm #usernameInput");
        var $loginPassword = $("#loginForm #passwordInput");
        var $loginModalBtn = $("#loginModalBtn");
        $loginModalBtn.on('click', function() {
            var username = $loginUsername.val();
            var password = $loginPassword.val();
            var data = JSON.parse(User.checkUser(username, password));
            if (data.status === 200) {
                $loginModal.modal('hide');
                Session.setSession(data.user);
                setAlert.alert(data.info, 'success', 3000);
                initial();
            } else if (data.status === 300 || data.status === 400) {
                setAlert.modalAlert('用户名或密码错误...', 'danger', 3000);
            }
        });
        var $registerModal = $("#registerModal");
        var $registerBtn = $("#registerBtn");
        $registerBtn.on('click', function() {
            $registerModal.modal('show');
        })
        var $linkRegisterBtn = $("#linkRegisterBtn");
        $linkRegisterBtn.on('click', function() {
            $loginModal.modal('hide');
            $registerModal.modal('show');
        });
        var $linkLoginBtn = $("#linkLoginBtn");
        $linkLoginBtn.on('click', function() {
            $loginModal.modal('show');
            $registerModal.modal('hide');
        });
        var $registerUsername = $("#registerForm #usernameInput");
        var $registerName = $("#registerForm #nameInput");
        var $registerPassword = $("#registerForm #passwordInput");
        var $registerModalBtn = $("#registerModalBtn");
        $registerModalBtn.on('click', function() {
            var username = $registerUsername.val();
            var name = $registerName.val();
            var password = $registerPassword.val();
            var data = JSON.parse(User.registerUser(username, name, password));
            if (data.status === 200) {
                $registerModal.modal('hide');
                setAlert.alert('注册成功...', 'success', 3000);
            } else if (data.status === 300) {
                setAlert.modalAlert('用户名已存在...', 'danger', 3000);
            }
            initialUserStatus();
        });
        var $createModal = $("#createModal");
        var $folderTitleInput = $("#folderTitleInput");
        var $selectFolder = $("#selectFolder");
        var $noteTitleInput = $("#noteTitleInput");
        var $createBtn = $("#createBtn");
        $createBtn.on('click', function() {
            initialFolderTitle(Folder.getFoldersByUserId($loginId.val()));
            $folderTitleInput.val('');
            $noteTitleInput.val('');
            $createModal.modal('show');
        });
        var $folderForm = $("#folderForm");
        var $noteForm = $("#noteForm");
        var $createType = $("#createType");
        $('input:radio[name="createType"]').on('change', function() {
            if ($('input:radio[name="createType"]:checked').val() === 'folder') {
                $folderForm.show();
                $noteForm.hide();
                $createType.val(0);
            } else {
                $folderForm.hide();
                $noteForm.show();
                $createType.val(1);
            }
        });
        var $createModalBtn = $("#createModalBtn");
        $createModalBtn.on('click', function() {
            if ($createType.val() === '0') {
                var title = $folderTitleInput.val();
                var userId = $loginId.val();
                if (Folder.createFolder(userId, title) !== undefined) {
                    $createModal.modal('hide');
                    initialFolder($loginId.val());
                }
            } else if ($createType.val() === '1') {
                var title = $noteTitleInput.val();
                var folderId = $selectFolder.val();
                var note = Note.createNote(folderId, title);
                $createModal.modal('hide');
                setAlert.alert('Create note successfully', 'success', 3000);
                $('#folderMenu li a[folder-id=' + folderId + ']').click();
            }
        });
        var $deleteFolderModal = $("#deleteFolderModal");
        var $deleteFolderId = $("#deleteFolderId");
        var $deleteFolderBtn = $("#deleteFolderBtn");
        $deleteFolderBtn.on('click', function() {
            $deleteFolderId.val($("#folderMenu li.active a").attr('folder-id'));
            $deleteFolderModal.modal('show');
        });

        var $deleteFolderModalBtn = $("#deleteFolderModalBtn");
        $deleteFolderModalBtn.on('click', function() {
            var folderId = $deleteFolderId.val();
            var userId = $loginId.val();
            var data = JSON.parse(Folder.deleteFolderById(folderId, userId));
            if (data.status == 200) {
                $deleteFolderId.val(0);
                $deleteFolderModal.modal('hide');
                setAlert.alert(data.info, 'success', 3000);
                initial();
            } else {
                setAlert.modalAlert(data.info, 'danger', 3000);
            }
        });

        var $noteId = $("#noteId");
        var $noteTitle = $("#noteTitle");

        var $saveNoteBtn = $("#saveNoteBtn");
        $saveNoteBtn.on('click', function() {
            var id = $noteId.val();
            var title = $noteTitle.val();
            var text = $noteEditor.html();
            var data = JSON.parse(Note.saveNote(id, title, text));
            if (data.status === 200) {
                setAlert.alert('Save successfully', 'success', 3000);
            } else {
                setAlert.alert('Save failed...', 'danger', 3000);
            }
        });

        var $deleteNoteBtn = $("#deleteNoteBtn");
        $deleteNoteBtn.on('click', function() {
            var id = $noteId.val();
            var data = JSON.parse(Note.deleteNote(id));
            if (data.status === 200) {
                initialNoteMenu($("#folderMenu li.active a").attr('folder-id'));
                $noteId.val('');
                $noteTitle.val('');
                $noteEditor.html('');
                setAlert.alert('Delete successfully', 'success', 3000);
            } else {
                setAlert.alert('Delete failed...', 'danger', 3000);
            }
        });

        var $folderMenu = $("#folderMenu");
        var $noteMenu = $('#noteMenu');

        initial();

        function initial() {
            User.initial();
            Folder.initial();
            Note.initial();
            initialUserStatus();
            initialFolder($loginId.val());
            initialNoteMenu();
            $deleteFolderBtn.addClass('disabled');
            bindBtnEvent();
        }

        function initialUserStatus() {
            if (Session.checkSession()) {
                $loginId.val(Session.getIdFromSession());
                $userName.text(Session.getNameFromSession());
                $loginContainer.hide();
                $logoutContainer.show();
            } else {
                $loginId.val(0);
                $userName.text('未登录');
                $loginContainer.show();
                $logoutContainer.hide();
            }
        }

        function initialFolder(userId) {
            if (userId === '0') {
                clearFolderMenu();
            } else {
                var folderList = Folder.getFoldersByUserId(userId);
                var items = '';
                if (folderList.length !== 0) {
                    folderList.map(function(folder) {
                        items += initialFolderItem(folder);
                    });
                }
                $folderMenu.html(items);
                bindBtnEvent();
            }
        }

        function initialNoteMenu(folderId) {
            if (folderId === undefined || folderId === '0') {
                clearNoteMenu();
            } else {
                var noteList = Note.getNoteByFolderId(folderId);
                var items = '';
                if (noteList.length !== 0) {
                    noteList.map(function(note) {
                        items += initialNoteItem(note);
                    })
                }
                $noteMenu.html(items);
                bindBtnEvent();
            }
        }

        function clearFolderMenu() {
            $folderMenu.html('');
        }

        function clearNoteMenu() {
            $noteMenu.html('');
        }

        function initialFolderItem(folder) {
            return '<li><a href="javascript:void(0);" folder-id="' + folder.id + '" data-link="folder"><span class="glyphicon glyphicon-folder-close"></span>&nbsp;' + folder.title + '</a></li>';
        }

        function initialNoteItem(note) {
            return '<li><a href="javascript:void(0);" note-id="' + note.id + '" data-link="note"><span class="glyphicon glyphicon-tag"></span>&nbsp;' + note.title + '</a></li>';
        }

        function initialFolderTitle(folderList) {
            var options = '';
            folderList.map(function(item) {
                options += '<option value="' + item.id + '">' + item.title + '</option>';
            });
            $selectFolder.html(options);
        }

        function initialNoteContent(noteId) {
            if (noteId !== '0' & noteId !== undefined) {
                var note = Note.getNoteById(noteId);
                $noteId.val(note.id);
                $noteTitle.val(note.title);
                $noteEditor.html(note.text);
            } else {
                setAlert.alert('Initial note failed, note id is null');
            }
        }

        function bindBtnEvent() {
            var $folderTitle = $("#folderTitle");
            var $folderLink = $('[data-link="folder"]');
            $folderLink.unbind();
            $folderLink.on('click', function() {
                var $this = $(this);
                $('.glyphicon-folder-open').each(function() {
                    $(this).removeClass('glyphicon-folder-open');
                });
                $($this.children()[0]).addClass('glyphicon-folder-open');
                $this.parent().siblings().each(function() {
                    $(this).removeClass('active');
                });
                $($this.parent()).addClass('active');
                initialNoteMenu($this.attr('folder-id'));
                $deleteFolderBtn.removeClass('disabled');
                $folderTitle.text(Folder.getTitleById($this.attr('folder-id')));
            });

            var $noteLink = $('[data-link="note"]');
            $noteLink.unbind();
            $noteLink.on('click', function() {
                var $this = $(this);
                $this.parent().siblings().each(function() {
                    $(this).removeClass('active');
                });
                $($this.parent()).addClass('active');
                initialNoteContent($this.attr('note-id'));
            });
        }
    });
});
