// if running in a CommonJS environment use exports object,
// otherwise set up as hiccup.html()
if (typeof exports === "undefined" || !exports) {
    var hiccup = {};
}

(function(exports) {

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
        var length = list.length;
        if (typeof list[index] === "string") {
            var tag = splitTag(list[index++]);
            var attr = tag[1];
            tag = tag[0];
            if (isObject(list[index])) {
                mergeAttributes(attr, list[index++]);
            }
            buffer.push("<", tag);
            for (var key in attr) {
                buffer.push(" ", key, "=\"", attr[key], "\"");
            }
            buffer.push(">");
            buildRest(list, index, buffer);
            buffer.push("</", tag, ">");
        } else {
            buildRest(list, index, buffer);
        }
    }

    function buildRest(list, index, buffer) {
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

    function isObject(item) {
        return item instanceof Object && item.constructor !== Array;
    }

    function isArray(item) {
        return item instanceof Object && item.constructor === Array;
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

