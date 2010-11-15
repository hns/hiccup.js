// if running in a CommonJS environment use exports object,
// otherwise set up as hiccup.html()
if (typeof exports === "undefined" || !exports) {
    var hiccup = {};
}

(function(exports) {

    // list of elements that need explicit close tag
    var containerTags = {"a":1, "b":1, "body":1, "dd":1, "div":1, "dl":1, "dt":1,
    "em":1, "fieldset":1, "form":1, "h1":1, "h2":1, "h3":1, "h4":1, "h5":1, "h6":1,
    "head":1, "html":1, "i":1, "label":1, "li":1, "ol":1, "pre":1, "script":1,
    "span":1, "strong":1, "style":1, "textarea":1, "ul":1, "option":1};

    var html4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n' +
                '   "http://www.w3.org/TR/html4/strict.dtd">\n',
        xhtmlStrict =
                '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n' +
                '   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n',
        xhtmlTransitional =
                '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n' +
                '   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n',
        html5 = '<!DOCTYPE html>\n';

    var html = function(list, buffer) {
        buildHtml(list, buffer);
        return buffer.join("");
    };

    exports.html = function() {
        return html(toArray(arguments), []);
    };

    exports.html4 = function() {
        return html(["html", toArray(arguments)], [html4]);
    };

    exports.xhtmlStrict = function() {
        return html(["html", toArray(arguments)], [xhtmlStrict]);
    };

    exports.xhtmlTransitional = function() {
        return html(["html", toArray(arguments)], [xhtmlTransitional]);
    };

    exports.html5 = function() {
        return html(["html", toArray(arguments)], [html5]);
    };

    exports.css = function() {
        var buffer = [];
        buildCss(arguments, buffer);
        return buffer.join("");
    };

    // if jQuery is available create $.hiccup() returning
    // a jQuery selector with the rendered HTML
    if (typeof jQuery === "function") {
        jQuery.hiccup = function() {
            return jQuery(html.call(null, toArray(arguments), []));
        };
    }

    function buildHtml(list, buffer) {
        var pos = 1;
        if (typeof list[0] === "string") {
            var tag = list[0];
            if (tag[0] === "<") {
                // first element is already a tag
                writeContent(list, 0, buffer);
                return;
            }
            tag = splitTag(tag);
            var attr = tag[1];
            tag = tag[0];
            if (isObject(list[1])) {
                mergeAttributes(attr, list[1]);
                pos = 2;
            }
            buffer.push("<", tag);
            for (var key in attr) {
                writeAttribute(key, attr[key], buffer);
            }
            if (pos === list.length) {
                if (tag in containerTags) {
                    buffer.push("></", tag, ">");
                } else {
                    buffer.push(" />");
                }
            } else {
                buffer.push(">");
                writeContent(list, pos, buffer);
                buffer.push("</", tag, ">");
            }
        } else {
            writeContent(list, 0, buffer);
        }
    }

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

    function writeContent(list, pos, buffer) {
        var length = list.length;
        while (pos < length) {
            var item = list[pos++];
            if (isArray(item)) {
                buildHtml(item, buffer);
            } else {
                buffer.push(String(item));
            }
        }
    }

    function writeAttribute(key, value, buffer) {
        if (typeof value === "boolean") {
            if (value) {
                buffer.push(" ", key, "=\"", key, "\"");
            }
        } else if (value != null) {
            buffer.push(" ", key, "=\"", escape(String(value)), "\"");
        }
    }

    function writeStyle(item, buffer) {
        buffer.push(" {");
        for (var key in item) {
            buffer.push(toDash(key), ":", item[key], ";");
        }
        buffer.push("}\n");
    }

    function isObject(item) {
        return item && typeof item === "object" && !isArray(item);
    }

    // use native ES5 Array.isArray if available
    var isArray = Array.isArray || function(item) {
        return item && item.constructor === Array;
    }

    // convert arguments object to proper array
    function toArray(args) {
        return Array.prototype.slice.call(args);
    }

    function escape(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/"/g, '&quot;')
                  .replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;');
    }

    // convert camelCase to dash-notation
    function toDash(str) {
        return str.replace(/([A-Z])/g, function($1){
            return "-" + $1.toLowerCase();
        });
    }

    function mergeAttributes(attr1, attr2) {
        for (var key in attr2) {
            if (!attr1.hasOwnProperty(key)) {
                attr1[key] = attr2[key];
            } else if (key === "class") {
                attr1[key] += " " + attr2[key];
            }
        }
    }

    function splitTag(tag) {
        var attr = {};
        var c = tag.split(".");
        var t = c[0].split("#");
        if (t[1]) attr.id = t[1];
        if (c.length > 1) attr["class"] = c.slice(1).join(" ");
        return [t[0] || "div", attr];
    }

})(hiccup || exports);
