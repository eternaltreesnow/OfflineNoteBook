define(function(require, exports, module) {
    exports.setSession = function _setSession(user) {
        localStorage.setItem('session', JSON.stringify(user));
    }

    exports.removeSession = function _removeSession() {
        localStorage.removeItem('session');
    }

    exports.checkSession = function _checkSession() {
        if (localStorage['session'] !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    exports.getIdFromSession = function _getId() {
        var user = JSON.parse(localStorage['session']);
        return user.id;
    }
    exports.getUsernameFromSession = function _getUsername() {
        var user = JSON.parse(localStorage['session']);
        return user.username;
    }
    exports.getNameFromSession = function _getName() {
        var user = JSON.parse(localStorage['session']);
        return user.name;
    }
});
