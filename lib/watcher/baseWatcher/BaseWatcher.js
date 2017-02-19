'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilityFunc = require('../../utilityFunc/utilityFunc');

var _ManagerWatcher = require('../managerWatcher/ManagerWatcher');

var _ManagerWatcher2 = _interopRequireDefault(_ManagerWatcher);

var _ElementWatcher = require('../elementWatcher/ElementWatcher');

var _ElementWatcher2 = _interopRequireDefault(_ElementWatcher);

var _ComponentWatcher = require('../componentWatcher/ComponentWatcher');

var _ComponentWatcher2 = _interopRequireDefault(_ComponentWatcher);

var _TextWatcher = require('../textWatcher/TextWatcher');

var _TextWatcher2 = _interopRequireDefault(_TextWatcher);

var _modelExtract2 = require('../../parser/modelExtract');

var _modelExtract3 = _interopRequireDefault(_modelExtract2);

var _runResetWatcher2 = require('./runResetWatcher');

var _runResetWatcher3 = _interopRequireDefault(_runResetWatcher2);

var _statementExtract2 = require('../../parser/statementExtract');

var _statementExtract3 = _interopRequireDefault(_statementExtract2);

var _modelSettlement = require('../../model/modelSettlement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseWatcher = function () {
  function BaseWatcher(element, obdata) {
    var previous = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var forceWatcherType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var modelExtractId = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var components = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var parentWatcher = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var obId = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

    _classCallCheck(this, BaseWatcher);

    this.obId = obId;
    this.element = element;
    this.components = components;
    this.parentWatcher = parentWatcher;
    this.obdata = obdata;
    this.previous = previous;
    this.rendering = null;
    this.hasDelete = false;
    this.modelExtractId = modelExtractId;
    this.pastDOMInformation = this.__getPastDOMInformation();
    this.obtype = this.__getType(forceWatcherType);
    this.obwatcher = this.__getWatcher();
    this.__hangonModel(this.modelExtractId);

    this.render();
  }

  _createClass(BaseWatcher, [{
    key: 'destructor',
    value: function destructor() {
      this.hasDelete = true;
      this.obwatcher.destructor();
    }
  }, {
    key: 'render',
    value: function render() {
      this.obwatcher.render();
    }
  }, {
    key: 'reset',
    value: function reset(data) {
      var _this = this;

      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      if (this.rendering !== null) {
        clearTimeout(this.rendering);
      }
      var prevData = (0, _utilityFunc.objectAssign)({}, this.obdata);
      var nextData = (0, _utilityFunc.objectAssign)({}, this.obdata);
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
        throw new TypeError('data is not a object');
      } else {
        for (var key in data) {
          nextData[key] = data[key];
        }
      }
      this.obdata = nextData;
      this.rendering = (0, _utilityFunc.delay)(function (time) {
        if (!_this.hasDelete) {
          _this.obwatcher.reset(cb, prevData, nextData, data);
        }
        _this.rendering = null;
        cb();
      });
    }
  }, {
    key: 'trackingUpdate',
    value: function trackingUpdate(data) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
      var modelExtractId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.modelExtractId;

      var resetWatcherList = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          resetWatcherList.push((0, _modelSettlement.get)(modelExtractId, key));
        }
      }
      this.runResetWatcher(resetWatcherList, data, cb);
    }
  }, {
    key: 'runResetWatcher',
    value: function runResetWatcher(resetWatcherList, data, cb) {
      (0, _runResetWatcher3.default)(resetWatcherList, data, cb);
    }
  }, {
    key: '__getWatcher',
    value: function __getWatcher() {
      var watcherClass = null;
      switch (this.obtype) {
        case BaseWatcher.ManagerWatcher:
          watcherClass = _ManagerWatcher2.default;
          break;
        case BaseWatcher.ElementWatcher:
          watcherClass = _ElementWatcher2.default;
          break;
        case BaseWatcher.TextWatcher:
          watcherClass = _TextWatcher2.default;
          break;
        case BaseWatcher.ComponentWatcher:
          watcherClass = _ComponentWatcher2.default;
          break;
      }
      return new watcherClass(this, BaseWatcher);
    }
  }, {
    key: '__getType',
    value: function __getType(forceWatcherType) {
      if (forceWatcherType !== null) {
        return forceWatcherType;
      }
      var NODE_TYPE = this.element.nodeType,
          NODE_NAME = this.element.nodeName.toLowerCase();
      if (NODE_TYPE === 3) {
        return BaseWatcher.TextWatcher;
      } else if (NODE_TYPE === 1) {
        var attr = this.pastDOMInformation.attr;
        var isManagerWatcher = false;
        for (var i = 0, len = attr.length; i < len; i++) {
          if (attr[i].name === _ManagerWatcher2.default.instructions[0]) {
            isManagerWatcher = true;
            break;
          }
        }
        if (isManagerWatcher) {
          return BaseWatcher.ManagerWatcher;
        } else if (_ComponentWatcher2.default.nodeName === NODE_NAME || _ComponentWatcher2.default.components[NODE_NAME] || this.components && this.components[NODE_NAME]) {
          return BaseWatcher.ComponentWatcher;
        } else {
          return BaseWatcher.ElementWatcher;
        }
      } else {
        throw 'watcher只能接受元素节点或者文本节点';
      }
    }
  }, {
    key: '__getPastDOMInformation',
    value: function __getPastDOMInformation() {
      return {
        parentNode: this.element.parentNode,
        nextSibling: this.element.nextSibling,
        textContent: this.element.textContent,
        innerHTML: this.element.innerHTML,
        nodeType: this.element.nodeType,
        nodeName: this.element.nodeName,
        attr: this.__getAttr(),
        display: this.__getDisplay()
      };
    }
  }, {
    key: '__getDisplay',
    value: function __getDisplay() {
      return this.element.nodeType !== BaseWatcher.TextWatcher && getComputedStyle(this.element).display;
    }
  }, {
    key: '__getAttr',
    value: function __getAttr() {
      return this.element.attributes ? (0, _utilityFunc.toArray)(this.element.attributes) : [];
    }
  }, {
    key: '__getWatcherType',
    value: function __getWatcherType(watcher) {
      return watcher.type;
    }
  }, {
    key: '__filterAttr',
    value: function __filterAttr() {
      var keeplist = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return this.pastDOMInformation.attr.filter(function (item) {
        return type ? keeplist.indexOf(item.name) > -1 : keeplist.indexOf(item.name) === -1;
      });
    }
  }, {
    key: '__hangonModel',
    value: function __hangonModel() {
      var _this2 = this;

      var model = this.obwatcher.model;
      if (model) {
        model.forEach(function (item) {
          (0, _modelSettlement.set)(_this2.modelExtractId, item, _this2);
        });
      }
    }
  }, {
    key: 'getChildId',
    value: function getChildId(i) {
      return this.obId + '.' + i;
    }
  }, {
    key: 'removeAttr',
    value: function removeAttr(name) {
      this.element.removeAttribute(name);
    }
  }, {
    key: 'modelExtract',
    value: function modelExtract(str) {
      return (0, _modelExtract3.default)(str);
    }
  }, {
    key: 'traversalPrevious',
    value: function traversalPrevious(cb) {
      var previousWatcher = this.previous;
      while (previousWatcher) {
        if (cb(previousWatcher) === false) break;
        previousWatcher = previousWatcher.previous;
      }
    }
  }, {
    key: 'statementExtract',
    value: function statementExtract(str) {
      return (0, _statementExtract3.default)(str);
    }
  }, {
    key: 'execStatement',
    value: function execStatement(statement) {
      try {
        return new Function('data', 'with(data) { return ' + statement + ';}')(this.obdata);
      } catch (e) {
        var errText = '';
        switch (this.obtype) {
          case BaseWatcher.TextWatcher:
            errText = this.element.textContent;
            break;
          case BaseWatcher.ManagerWatcher:
          case BaseWatcher.ElementWatcher:
          case BaseWatcher.ComponentWatcher:
            errText = (0, _utilityFunc.getTagText)(this.element);
        }
        throw e + '\n\n' + errText;
      }
    }
  }]);

  return BaseWatcher;
}();

BaseWatcher.ManagerWatcher = 1;
BaseWatcher.ElementWatcher = 2;
BaseWatcher.TextWatcher = 3;
BaseWatcher.ComponentWatcher = 4;
exports.default = BaseWatcher;