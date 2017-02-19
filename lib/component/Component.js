'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentLifecycle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilityFunc = require('../utilityFunc/utilityFunc');

var _modelSettlement = require('../model/modelSettlement');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentLifecycle = exports.ComponentLifecycle = ['didMount', 'willMount', 'willUpdate', 'shouldUpdate'];

var Component = function () {
  function Component() {
    _classCallCheck(this, Component);

    this.watcher = null;
    this.element = null;
    this.refs = null;
    this.template = null;
    this.props = null;
    this.data = null;
    this.propTypes = null;
  }

  _createClass(Component, [{
    key: 'init',
    value: function init(watcher, props) {
      this.watcher = watcher;
      this.props = props;
    }
  }, {
    key: 'setDOMElement',
    value: function setDOMElement(element) {
      this.element = element;
      this.__setRefs();
    }
  }, {
    key: 'trackingUpdate',
    value: function trackingUpdate(data) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      this.watcher.trackingUpdate(data, cb, this.watcher.obwatcher.modelExtractId);
    }
  }, {
    key: 'setProps',
    value: function setProps(props) {
      this.props = props;
    }
  }, {
    key: '__setRefs',
    value: function __setRefs() {
      var refs = {};
      (0, _utilityFunc.walkElement)(this.element, function (element) {
        var ref = element.getAttribute && element.getAttribute('ref');
        ref && (refs[ref] = element);
      });
      this.refs = refs;
    }
  }, {
    key: 'didMount',
    value: function didMount() {}
  }, {
    key: 'willMount',
    value: function willMount() {}
  }, {
    key: 'willUpdate',
    value: function willUpdate() {}
  }, {
    key: 'shouldUpdate',
    value: function shouldUpdate() {
      return true;
    }
  }]);

  return Component;
}();

exports.default = Component;