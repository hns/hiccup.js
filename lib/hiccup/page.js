var html = require("hiccup").html;

var html4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n' +
            '   "http://www.w3.org/TR/html4/strict.dtd">\n',
    xhtmlStrict =
            '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n' +
            '   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n',
    xhtmlTransitional =
            '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n' +
            '   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n',
    html5 = '<!DOCTYPE html>\n';

exports.html4 = function() {
    return html(html4, ["html", toArray(arguments)]);
};

exports.xhtmlStrict = function() {
    return html(xhtmlStrict, ["html", toArray(arguments)]);
};

exports.xhtmlTransitional = function() {
    return html(xhtmlTransitional, ["html", toArray(arguments)]);
};

exports.html5 = function() {
    return html(html5, ["html", toArray(arguments)]);
};

exports.css = function() {
    var buffer = [];
    buildCss(arguments, buffer);
    return buffer.join("");
};

function buildCss(list, buffer) {
    var length = list.length;
    var selector;
    for (var i = 0; i < length; i++) {
        var item = list[i];
        if (typeof item === "string") {
            selector = selector ?
                selector + ", " + item : item;
        } else if (item && typeof item === "object") {
            if (selector != null) {
                buffer.push(selector);
                writeStyle(item, buffer);
                selector = null;
            }
        }
    }
}

function writeStyle(item, buffer) {
    buffer.push(" {");
    for (var key in item) {
        buffer.push(toDash(key), ":", item[key], ";");
    }
    buffer.push("}\n");
}

// convert arguments object to proper array
function toArray(args) {
    return Array.prototype.slice.call(args);
}

// convert camelCase to dash-notation
function toDash(str) {
    return str.replace(/([A-Z])/g, function($1){
        return "-" + $1.toLowerCase();
    });
}
