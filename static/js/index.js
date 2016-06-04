define(function(require) {
    require('bootstrap/js/bootstrap.min');
    require('bootstrap-wysiwyg/external/jquery.hotkeys');
    require('bootstrap-wysiwyg/bootstrap-wysiwyg');
    var User = require('../../model/user');
    var Session = require('../../model/session');
    var setAlert = require('../js/alert');
    $(function() {
        $("#wysiwygEditor").wysiwyg({
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
            initialUserStatus();
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
                initialUserStatus();
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

        initial();

        function initial() {
            initialUserStatus();
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
    });
});
