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

    var html = exports.html = function() {
        var buffer = [];
        build(arguments, buffer);
        return buffer.join("");
    }

    // if jQuery is available create $.hiccup() returning
    // a jQuery selector with the rendered HTML
    if (typeof jQuery === "function") {
        jQuery.hiccup = function() {
            return jQuery(html.apply(null, arguments));
        };
    }

    function build(list, buffer) {
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

    function writeContent(list, pos, buffer) {
        var length = list.length;
        while (pos < length) {
            var item = list[pos++];
            if (isArray(item)) {
                build(item, buffer);
            } else {
                buffer.push(item);
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

    function isObject(item) {
        return item instanceof Object && !isArray(item);
    }

    // use native ES5 Array.isArray if available
    var isArray = Array.isArray || function(item) {
        return item && item.constructor === Array;
    }

    function escape(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/"/g, '&quot;')
                  .replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;');
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
        return [t[0], attr];
    }

})(hiccup || exports);

