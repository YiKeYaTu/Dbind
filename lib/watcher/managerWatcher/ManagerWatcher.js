'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilityFunc = require('../../utilityFunc/utilityFunc');

var _modelSettlement = require('../../model/modelSettlement');

var _traversalVector = require('./traversalVector');

var _traversalVector2 = _interopRequireDefault(_traversalVector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ManagerWatcher = function () {
  function ManagerWatcher(base, BaseWatcher) {
    _classCallCheck(this, ManagerWatcher);

    this.base = base;
    this.BaseWatcher = BaseWatcher;
    this.instruction = this.__getInstruction();
    this.vector = null;
    this.model = this.__getModel();
    this.parameter = this.__getParameter();
    this.childWacther = null;
    this.__check();
    this.__removeRootElement();
  }

  _createClass(ManagerWatcher, [{
    key: 'destructor',
    value: function destructor() {
      this.childWacther.forEach(function (item) {
        return item.destructor();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var childIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.__setChildWatcher(childIndex);
      this.__appendChildWatcherToDOM(childIndex);
    }
  }, {
    key: 'reset',
    value: function reset() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var prevData = arguments[1];
      var nextData = arguments[2];

      var prevLen = this.base.execStatement(this.vector, prevData).length;
      var nextLen = this.base.execStatement(this.vector, nextData).length;
      if (prevLen < nextLen) {
        this.render(prevLen);
      } else if (prevLen > nextLen) {
        for (var i = nextLen; i < prevLen; i++) {
          this.childWacther[i].destructor();
        }
        this.childWacther = this.childWacther.slice(0, nextLen);
      }
    }
  }, {
    key: '__appendChildWatcherToDOM',
    value: function __appendChildWatcherToDOM(childIndex) {
      var frg = document.createDocumentFragment(),
          next = this.base.pastDOMInformation.nextSibling;
      for (var i = childIndex, len = this.childWacther.length; i < len; i++) {
        frg.appendChild(this.childWacther[i][0]);
      }
      if (next) {
        next.parentNode.insertBefore(frg, next);
      } else {
        this.base.pastDOMInformation.parentNode.appendChild(frg);
      }
      for (var _i = childIndex, _len = this.childWacther.length; _i < _len; _i++) {
        this.childWacther[_i] = new (Function.prototype.bind.apply(this.BaseWatcher, [null].concat(_toConsumableArray(this.childWacther[_i]))))();
      }
    }
  }, {
    key: '__check',
    value: function __check() {
      var res = /[a-zA-Z_$][a-zA-Z_$0-9]*(\s*,\s*[a-zA-Z_$][a-zA-Z_$0-9]*){0,2}\s*in\s*/.test(this.instruction.value);
      if (!res) {
        throw '';
      }
    }
  }, {
    key: '__setChildWatcher',
    value: function __setChildWatcher(childIndex) {
      var _this = this;

      var vector = this.base.execStatement(this.vector).slice(childIndex);
      var child = [];
      (0, _traversalVector2.default)(vector, function (key, count) {
        if ((0, _utilityFunc.is)(vector, 'array')) {
          key += childIndex;
        }
        count += childIndex;
        var obdata = (0, _utilityFunc.objectAssign)({}, _this.base.obdata);
        obdata[_this.parameter[0]] = key;
        _this.parameter[1] && (obdata[_this.parameter[1]] = count);
        child.push([_this.__cloneElement(_this.base.element.innerHTML), obdata, _this.base.previous, null, _this.base.modelExtractId, _this.base.components, _this.base, _this.base.getChildId(count)]);
      });
      if (childIndex > 0) {
        for (var i = 0, len = child.length; i < len; i++) {
          this.childWacther.push(child[i]);
        }
      } else {
        this.childWacther = child;
      }
    }
  }, {
    key: '__removeRootElement',
    value: function __removeRootElement() {
      var element = this.base.element;
      element.parentNode.removeChild(element);
    }
  }, {
    key: '__cloneElement',
    value: function __cloneElement() {
      var innerHTML = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var cloneNode = this.base.element.cloneNode();
      cloneNode.innerHTML = innerHTML;
      cloneNode.removeAttribute(ManagerWatcher.instructions[0]);
      return cloneNode;
    }
  }, {
    key: '__getModel',
    value: function __getModel() {
      var _this2 = this;

      var res = [];
      var flag = false;
      this.base.modelExtract(this.instruction.value).forEach(function (item) {
        flag && res.push(item.value);
        if (item.value === ManagerWatcher.eachSplitInstructionChar) {
          flag = true;
          _this2.vector = _this2.instruction.value.slice(item.index + ManagerWatcher.eachSplitInstructionChar.length).replace(/\s/g, '');
        };
      });
      return res.length > 0 ? res : null;
    }
  }, {
    key: '__getParameter',
    value: function __getParameter() {
      var res = [];
      var flag = false;
      this.base.modelExtract(this.instruction.value).forEach(function (item) {
        if (item.value === ManagerWatcher.eachSplitInstructionChar) flag = true;
        !flag && res.push(item.value);
      });
      return res;
    }
  }, {
    key: '__getInstruction',
    value: function __getInstruction() {
      return this.base.__filterAttr(ManagerWatcher.instructions, true)[0];
    }
  }]);

  return ManagerWatcher;
}();

ManagerWatcher.instructions = ['data-each'];
ManagerWatcher.eachSplitInstructionChar = 'in';
exports.default = ManagerWatcher;