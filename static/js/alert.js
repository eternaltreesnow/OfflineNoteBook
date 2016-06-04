define(function(require, exports, module) {
    var timeOut, modalTimeOut;

    var alert = function(text, type, time) {
        $("#infoAlertText").text(text);
        $("#infoAlert").removeClass("alert-success").removeClass("alert-warning").removeClass("alert-danger").addClass("alert-" + type + " in");
        if (timeOut) {
            window.clearTimeout(timeOut);
        }
        timeOut = setTimeout(function() {
            $("#infoAlert").removeClass("in");
        }, time);
    }

    var modalAlert = function(text, type, time) {
        $("#modalAlertText").text(text);
        $("#modalAlert").removeClass("alert-success").removeClass("alert-warning").removeClass("alert-danger").addClass("alert-" + type + " in");
        if (modalTimeOut) {
            window.clearTimeout(modalTimeOut);
        }
        modalTimeOut = setTimeout(function() {
            $("#modalAlert").removeClass("in");
        }, time);
    }

    exports.alert = alert;

    exports.modalAlert = modalAlert;
});
