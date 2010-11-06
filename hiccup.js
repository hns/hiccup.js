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
        var index = 0;
        if (typeof list[index] === "string") {
            var tag = splitTag(list[index++]);
            var attr = tag[1];
            tag = tag[0];
            if (isObject(list[index])) {
                mergeAttributes(attr, list[index++]);
            }
            buffer.push("<", tag);
            for (var key in attr) {
                writeAttribute(key, attr[key], buffer);
            }
            if (index === list.length && !(tag in containerTags)) {
                buffer.push(" />");
            } else {
                buffer.push(">");
                writeContent(list, index, buffer);
                buffer.push("</", tag, ">");
            }
        } else {
            writeContent(list, index, buffer);
        }
    }

    function writeContent(list, index, buffer) {
        var length = list.length;
        while (index < length) {
            var item = list[index++];
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
        var match = tag.match(/([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?/);
        if (match[2]) attr.id = match[2];
        if (match[3]) attr["class"] = match[3].replace(/\./g, " ");
        return [match[1], attr];
    }

})(hiccup || exports);

