define(function(require, exports, module) {
    var Session = require('../model/session');

    function _updateMaxId() {
        var id = _getMaxId();
        localStorage.setItem('max-id', id + 1);
        return id + 1;
    }

    function _getMaxId() {
        return parseInt(localStorage.getItem('max-id'));
    }

    function _setUser(username, name, password) {
        var id = _updateMaxId();
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
        return JSON.parse(localStorage['user']);
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
        userList.map(function(item) {
            if (item.username === username) {
                return true;
            }
        });
        return false;
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
