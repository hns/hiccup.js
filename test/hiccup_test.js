var assert = require("assert");
var {html} = require("../hiccup");

exports.testTagNames = function() {
    // basic tags
    assert.equal(html("div"), '<div></div>');
    // syntax sugar
    assert.equal(html("div#foo"), '<div id="foo"></div>');
    assert.equal(html("div.foo"), '<div class="foo"></div>');
    assert.equal(html("div.foo", "bar", "baz"), '<div class="foo">barbaz</div>');
    assert.equal(html("div.a.b"), '<div class="a b"></div>');
    assert.equal(html("div.a.b.c"), '<div class="a b c"></div>');
    assert.equal(html("div#foo.bar.baz"), '<div id="foo" class="bar baz"></div>');
}

exports.testTagContents = function() {
    // empty tags
    assert.equal(html("div"), '<div></div>');
    assert.equal(html("h1"), '<h1></h1>');
    assert.equal(html("script"), '<script></script>');
    assert.equal(html("text"), '<text />');
    assert.equal(html("a"), '<a></a>');
    // containing text
    assert.equal(html("text", "Lorem Ipsum"), '<text>Lorem Ipsum</text>');
    // contents are concatenated
    assert.equal(html("body", "foo", "bar"), '<body>foobar</body>');
    assert.equal(html("body", ["p"], ["br"]), '<body><p /><br /></body>');
    // arrays are expanded
    // assert.equal(html("body", ["foo", "bar"]), '<body>foobar</body>');
    assert.equal(html([["p", "a"],["p", "b"]]), '<p>a</p><p>b</p>');
    // tags can contain tags
    assert.equal(html("div", ["p"]), '<div><p /></div>');
    assert.equal(html("div", ["b"]), '<div><b></b></div>');
    assert.equal(html("p", ["span", ["a", "foo"]]),
            '<p><span><a>foo</a></span></p>');
}

exports.testTagAttributes = function() {
    // tag with blank attribute map
    assert.equal(html("xml", {}), '<xml />');
    // tag with populated attribute map
    assert.equal(html("xml", {a: "1", b: "2"}), '<xml a="1" b="2" />');
    assert.equal(html("img", {id: "foo"}), '<img id="foo" />');
    assert.equal(html("xml", {a: "1", b: "2", c: "3"}),
            '<xml a="1" b="2" c="3" />');
    // attribute values are escaped
    assert.equal(html("div", {id: '"'}), '<div id="&quot;"></div>');
    // boolean attributes
    assert.equal(html("input", {type: "checkbox", checked: true}),
            '<input type="checkbox" checked="checked" />');
    assert.equal(html("input", {type: "checkbox", checked: false}),
            '<input type="checkbox" />');
    // null attributes
    assert.equal(html("span", {"class": null}, "foo"),
            '<span>foo</span>');
}
