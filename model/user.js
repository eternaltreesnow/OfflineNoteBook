define(function(require, exports, module) {
    var Session = require('../model/session');

    function _getMaxUserId() {
        var max_id = JSON.parse(localStorage.getItem('max-id'));
        var id = parseInt(max_id.user_id) + 1;
        max_id.user_id = id;
        localStorage.setItem('max-id', JSON.stringify(max_id));
        return id;
    }

    function _setUser(username, name, password) {
        var id = _getMaxUserId();
        var user = new Object();
        user.id = id;
        user.username = username;
        user.name = name;
        user.password = password;
        _updateUser(user);
        return user;
    }

    function _updateUser(user) {
        var userList = _getUserList();
        userList.push(user);
        localStorage.setItem('user', JSON.stringify(userList));
    }

    function _getUserList() {
        var user = localStorage['user'];
        if (user !== undefined) {
            return JSON.parse(localStorage['user']);
        } else {
            return '';
        }

    }

    function _getUserById(id) {
        var user = '';
        var userList = _getUserList();
        userList.map(function(item) {
            if (item.id === id) {
                user = item;
            }
        });
        return user;
    }

    function _checkUsername(username) {
        var userList = _getUserList();
        if (userList.length === 0) {
            return false;
        } else {
            userList.map(function(item) {
                if (item.username === username) {
                    return true;
                }
            });
            return false;
        }
    }

    exports.initial = function _init() {
        if (localStorage['user'] === undefined) {
            localStorage.setItem('user', '[]');
        }
        if (localStorage['max-id'] === undefined) {
            var max_id = {
                user_id: 0,
                note_id: 0,
                folder_id: 0
            }
            localStorage.setItem('max-id', JSON.stringify(max_id));
        }
    }

    exports.checkUser = function _checkUser(username, password) {
        var userList = _getUserList();
        var status = 0;
        var id;
        userList.map(function(item) {
            if (item.username === username) {
                status = 1;
                if (item.password === password) {
                    id = item.id;
                    status = 2;
                }
            }
        });
        if (status === 0) {
            return JSON.stringify({
                'status': 300,
                'info': 'User not exist'
            });
        } else if (status === 1) {
            return JSON.stringify({
                'status': 400,
                'info': 'Invalid password'
            });
        } else if (status === 2) {
            var user = _getUserById(id);
            return JSON.stringify({
                'status': 200,
                'info': 'Login successfully',
                'user': user
            });
        }
    }

    exports.registerUser = function _register(username, name, password) {
        if (_checkUsername(username)) {
            return JSON.stringify({
                'status': 300,
                'info': 'Username exist'
            });
        } else {
            var user = _setUser(username, name, password);
            Session.setSession(user);
            return JSON.stringify({
                'status': 200,
                'info': 'Register successfully'
            });
        }
    }
});
