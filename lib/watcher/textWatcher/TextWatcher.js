'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _statementToString = require('./statementToString');

var _statementToString2 = _interopRequireDefault(_statementToString);

var _statementExtract = require('../../parser/statementExtract');

var _utilityFunc = require('../../utilityFunc/utilityFunc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextWatcher = function () {
  function TextWatcher(base) {
    _classCallCheck(this, TextWatcher);

    this.base = base;
    this.watcherType = this.base.pastDOMInformation.nodeType;
    this.vm = this.__getViewModel();
    this.model = this.__parseModel();
    this.view = null;
  }

  _createClass(TextWatcher, [{
    key: 'destructor',
    value: function destructor() {
      var node = this.base.element;
      node.parentNode.removeChild(node);
    }
  }, {
    key: 'render',
    value: function render() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      var prevView = this.view;
      this.view = this.__parseView();
      if (prevView != this.view) {
        if (this.watcherType === TextWatcher.textNodeWatcher) {
          this.base.element.textContent = this.view;
        } else {
          this.base.element.innerHTML = this.view;
        }
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var prevData = arguments[1];
      var nextData = arguments[2];

      this.render(cb);
    }
  }, {
    key: '__getViewModel',
    value: function __getViewModel() {
      var isTextNode = this.watcherType === TextWatcher.textNodeWatcher;
      var content = isTextNode ? this.base.pastDOMInformation.textContent : this.base.pastDOMInformation.innerHTML;
      return this.__replaceOnceStatement(this.base.statementExtract(content));
    }
  }, {
    key: '__replaceOnceStatement',
    value: function __replaceOnceStatement(statementList) {
      var _this = this;

      return statementList.map(function (item) {
        if (item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
          item.type = _statementExtract.CONST_STRING;
          item.value = _this.base.execStatement(item.value);
        }
        return item;
      });
    }
  }, {
    key: '__parseView',
    value: function __parseView() {
      var _this2 = this;

      var view = '';
      this.vm.forEach(function (item) {
        if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
          view += _this2.__toString(_this2.base.execStatement(item.value));
        } else {
          view += _this2.__toString(item.value);
        }
      });
      return view;
    }
  }, {
    key: '__toString',
    value: function __toString(val) {
      return (0, _statementToString2.default)(val);
    }
  }, {
    key: '__parseModel',
    value: function __parseModel() {
      var _this3 = this;

      var res = [];
      this.vm.forEach(function (item) {
        if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
          _this3.base.modelExtract(item.value).forEach(function (model) {
            res.push(model.value);
          });
        }
      });
      return res;
    }
  }]);

  return TextWatcher;
}();

TextWatcher.textNodeWatcher = 3;
TextWatcher.innerHTMLWatcher = 1;
exports.default = TextWatcher;