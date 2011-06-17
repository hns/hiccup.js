
var hiccup = require("./hiccup"),
    defElem = hiccup.defElem,
    escapeHtml = hiccup.escapeHtml;

exports.textField = defElem(function(name, value) {
    return buildInput("text", name, value);
});

exports.hiddenField = defElem(function(name, value) {
    return buildInput("hidden", name, value);
});

exports.passwordField = defElem(function(name, value) {
    return buildInput("password", name, value);
});

exports.checkBox = defElem(function(name, checked, value) {
    return ["input", {
        type: "checkbox",
        id: name,
        name: name,
        value: value || "true",
        checked: Boolean(checked)
    }];
});

exports.radioButton = defElem(function(group, checked, value) {
    value = value || "true";
    return ["input", {
        type: "radio",
        id: group + "-" + value,
        name: group,
        value: value,
        checked: Boolean(checked)
    }];
});

exports.selectOptions = defElem(function(options, selected) {
    var result = [], value, text;
    for (var i = 0, l = options.length; i < l; i++) {
        value = options[i];
        if (isArray(value)) {
            text = value[0], value = value[1];
            result.push(["option", {value: value, selected: value === selected}, text]);
        } else {
            result.push(["option", {selected: value === selected}, value]);
        }
    }
    return result;
});

exports.dropDown = defElem(function(name, options, selected) {
    return ["select", {name: name, id: name}, exports.selectOptions(options, selected)];
});

exports.textArea = defElem(function(name, value) {
    return ["textarea", {name: name, id: name}, escapeHtml(value)];
});

exports.fileUpload = defElem(function(name) {
    return buildInput("file", name);
});

exports.label = defElem(function(name, text) {
    return ["label", {"for": name}, text];
});

exports.submitButton = defElem(function(text) {
    return ["input", {type: "submit", value: text}];
});

exports.resetButton = defElem(function(text) {
    return ["input", {type: "reset", value: text}];
});

function buildInput(type, name, value) {
    return ["input", {
        type: type,
        name: name,
        value: value,
        id: name
    }];
}
