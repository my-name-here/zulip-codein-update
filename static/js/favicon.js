var favicon = (function () {

var exports = {};

var favicon_selector = 'link[rel="shortcut icon"]';

exports.canvas = CanvasFavicon();

$(function () {
    exports.canvas = exports.canvas.init("#favicon").default({});
});

// We need to reset the favicon after changing the
// window.location.hash or Firefox will drop the favicon.  See
// https://bugzilla.mozilla.org/show_bug.cgi?id=519028
exports.reset = function () {
    $(favicon_selector).detach().appendTo('head');
};

exports.set = function () {
    if (/webkit/i.test(navigator.userAgent)) {
        // Works in Chrome 22 at least.
        // Doesn't work in Firefox 10.
        $(favicon_selector).attr('href', exports.canvas.export_png());
    } else {
        // Delete and re-create the node.
        // May cause excessive work by the browser
        // in re-rendering the page (see #882).
        $(favicon_selector).remove();
        $('head').append($('<link>')
            .attr('rel', 'shortcut icon')
            .attr('href', exports.canvas.export_png()));
    }
};

exports.change_favicon = function () {
    exports.canvas.change_favicon();
    setTimeout(function () {
        exports.update_favicon();
    }, 500);
};

exports.update_favicon = function () {
    var unread_count = unread.get_counts();
    var default_count = {
        unread_count: unread_count.home_unread_messages,
        has_pm: unread_count.private_message_count > 0,
    };
    favicon.canvas.default(default_count);
    exports.set();
};

return exports;
}());

if (typeof module !== 'undefined') {
    module.exports = favicon;
}
window.favicon = favicon;
