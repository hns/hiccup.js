hiccup.js
=========

This is a simple and **incomplete** port of the [Hiccup] HTML generation 
library for Clojure to JavaScript. This script tries to triple as a plain 
script file, a CommonJS module, and a jQuery plugin.

[Hiccup]: http://github.com/weavejester/hiccup

Usage
-----

Loaded as plain JS script:

    var html = hiccup.html("p", "Hello world");

As jQuery plugin:

    $.hiccup("p", "Hello world").appendTo("body");

As CommonJS module:

    var hiccup = require("hiccup");
    var html = hiccup.html("p", "Hello world");

Examples
--------

The first argument (or array element for nested arrays) is tag name.
The second argument can optionally be an object, in which case it is used to
supply attributes. All others are added to the tag's body.

    hiccup.html("p", {"class": "foo"}, "hello world", "!")
    // => '<p class="foo">hello world!</p>'

Shortcuts for denoting id and class attributes:

    hiccup.html("p#foo.bar.baz", "hello world!")
    // => '<p id="foo" class="bar baz">hello world!</p>'

Arrays are used for nested tags:

    hiccup.html("p", ["span.highlight", "Important!"], " less important")
    // => '<p><span class="highlight">Important!</span> less important</p>'

A simple list example:

    hiccup.html("ol", ["li", "first"], ["li", "second"])
    // => '<ol><li>first</li><li>second</li></ol>'

List example with array comprehension - requires JS 1.7
(but will also combine nicely with Array.map and friends):

    hiccup.html("ul", [["li", item] for each (item in [1, 2, 3])])
    // => '<ul><li>1</li><li>2</li><li>3</li></ul>'

Pass multiple arrays as arguments to get an element list
instead of a single element:

    hiccup.html(["p", "first paragraph"], ["p", "second paragraph"])
    // => '<p>first paragraph</p><p>second paragraph</p>'


