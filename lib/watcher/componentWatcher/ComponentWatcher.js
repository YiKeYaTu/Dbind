'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = require('../../component/Component');

var _Component2 = _interopRequireDefault(_Component);

var _ComponentManager = require('../../component/ComponentManager');

var _Dbind = require('../../observer/Dbind');

var _Dbind2 = _interopRequireDefault(_Dbind);

var _utilityFunc = require('../../utilityFunc/utilityFunc');

var _htmlParser = require('../../parser/htmlParser');

var _htmlParser2 = _interopRequireDefault(_htmlParser);

var _statementExtract = require('../../parser/statementExtract');

var _modelSettlement = require('../../model/modelSettlement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentWatcher = function () {
  function ComponentWatcher(base, BaseWatcher) {
    _classCallCheck(this, ComponentWatcher);

    this.base = base;
    this.BaseWatcher = BaseWatcher;
    this.modelExtractId = (0, _utilityFunc.randomId)();
    this.instructions = this.__getInstructions();
    this.props = this.__getProps();
    this.model = this.__getModel();
    this.componentManager = this.__getComponentManager();
    this.component = this.componentManager && this.componentManager.createComponent();
    this.__removeRootNode();
  }

  _createClass(ComponentWatcher, [{
    key: 'destructor',
    value: function destructor() {
      this.childWatcher && this.childWatcher.forEach(function (item) {
        item.destructor();
      });
      (0, _modelSettlement.deleteAll)(this.modelExtractId);
      this.childWatcher = [];
    }
  }, {
    key: 'render',
    value: function render() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      if (!this.componentManager) return;
      this.resolvedProps = this.__bindProps();
      this.component.init(this.base, this.resolvedProps);
      this.child = this.__renderComponent();
      this.component.setDOMElement(this.child);
      this.__execComponentCbFuncs();
      this.component.willMount();
      this.data = (0, _utilityFunc.objectAssign)({}, this.component.props, this.component.data);
      this.childWatcher = this.__setChildWatcher();
      this.component.didMount();
      cb();
    }
  }, {
    key: 'reset',
    value: function reset() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var prevData = arguments[1];
      var nextData = arguments[2];

      var componentManager = this.__getComponentManager();
      if (componentManager && (!this.componentManager || componentManager.id !== this.componentManager.id)) {
        this.componentManager = componentManager;
        this.component = this.componentManager.createComponent();
        this.destructor();
        this.render(cb);
      } else if (!componentManager) {
        this.destructor();
      } else {
        var oldProps = this.resolvedProps;
        var resetWatcherList = [];
        this.resolvedProps = this.__bindProps();
        if (!this.component.shouldUpdate(oldProps, this.resolvedProps)) {
          return;
        }
        this.component.setProps(this.resolvedProps);
        this.__execComponentCbFuncs();
        this.component.willUpdate(oldProps, this.resolvedProps);
        for (var key in oldProps) {
          if (oldProps[key] !== this.component.props[key]) {
            var _cb = (0, _modelSettlement.get)(this.modelExtractId, key);
            this.data[key] = this.component.props[key];
            _cb && resetWatcherList.push(_cb);
          }
        }
        for (var _key in this.component.data) {
          if (this.component.data[_key] !== this.data[_key]) {
            var _cb2 = (0, _modelSettlement.get)(this.modelExtractId, _key);
            this.data[_key] = this.component.data[_key];
            _cb2 && resetWatcherList.push(_cb2);
          }
        }
        this.base.runResetWatcher(resetWatcherList, this.data, cb);
      }
    }
  }, {
    key: '__removeRootNode',
    value: function __removeRootNode() {
      var element = this.base.element;
      element.parentNode.removeChild(element);
    }
  }, {
    key: '__setChildWatcher',
    value: function __setChildWatcher() {
      var _this = this;

      var previous = null;
      var modelExtractId = this.modelExtractId;
      var components = this.component.components;
      var data = this.data;
      if (this.componentManager) {
        if (this.componentManager.childModelExtractId) {
          modelExtractId = this.componentManager.childModelExtractId;
          data = this.componentManager.childObData;
          components = this.componentManager.childComponents;
        }
      }
      return this.child.map(function (item, index) {
        return new _this.BaseWatcher(item, (0, _utilityFunc.objectAssign)({}, data), previous, null, modelExtractId, components, _this.base, _this.base.getChildId(index));
        previous = item;
      });
    }
  }, {
    key: '__bindProps',
    value: function __bindProps() {
      var _this2 = this;

      var props = {};
      this.props.normalProps.forEach(function (item) {
        props[item.name] = item.value[0].value;
      });
      this.props.obProps.forEach(function (prop) {
        var str = null;
        prop.value.forEach(function (item) {
          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
            var val = _this2.base.execStatement(item.value);
            if (str === null) {
              str = val;
            } else {
              str += val;
            }
          } else {
            if (str === null) {
              str = item.value;
            } else {
              str += item.value;
            }
          }
        });
        props[prop.name] = str;
      });
      this.__bindChildrenProps(props);
      return props;
    }
  }, {
    key: '__bindChildrenProps',
    value: function __bindChildrenProps(props) {
      var children = this.base.element.innerHTML;
      if (children.replace(/\s/g, '')) {
        this.base.element.innerHTML = '';
        var childrenComponent = _Dbind2.default.createClass({
          data: this.base.obdata,
          template: children
        });
        childrenComponent.childObData = this.base.obdata;
        childrenComponent.childModelExtractId = this.base.modelExtractId;
        childrenComponent.childComponents = this.base.components;
        if (props.children) {
          throw new TypeError('You should not use children props');
        }
        props.children = childrenComponent;
      }
    }
  }, {
    key: '__renderComponent',
    value: function __renderComponent() {
      if (!this.component) return;
      var frg = document.createDocumentFragment();
      var template = document.createElement('div');
      var parent = this.base.pastDOMInformation.parentNode;
      if (typeof this.component.template === 'string') {
        template.innerHTML = (0, _htmlParser2.default)(this.component.template);
      } else if (typeof this.component.template === 'function') {
        template.innerHTML = (0, _htmlParser2.default)(this.component.template());
      }
      var child = (0, _utilityFunc.toArray)(template.childNodes);
      while (template.childNodes[0]) {
        frg.appendChild(template.childNodes[0]);
      }
      parent.insertBefore(frg, this.base.pastDOMInformation.nextSibling);
      return child;
    }
  }, {
    key: '__getComponentManager',
    value: function __getComponentManager() {
      var componentDataFrom = this.base.execStatement(this.instructions[ComponentWatcher.instructions[0]]);
      var componentName = this.base.pastDOMInformation.nodeName.toLowerCase();
      var componentManager = null;

      if (componentName === ComponentWatcher.nodeName) {
        if (typeof componentDataFrom === 'string') {
          if (this.base.components && this.base.components[componentDataFrom]) {
            componentManager = this.base.components[componentDataFrom];
          } else if (ComponentWatcher.components[componentDataFrom]) {
            componentManager = ComponentWatcher.components[componentDataFrom];
          }
        } else if (componentDataFrom instanceof _ComponentManager.ComponentManager) {
          componentManager = componentDataFrom;
        }
      } else {
        if (this.base.components && this.base.components[componentName]) {
          componentManager = this.base.components[componentName];
        } else if (ComponentWatcher.components[componentName]) {
          componentManager = ComponentWatcher.components[componentName];
        }
      }

      return componentManager;
    }
  }, {
    key: '__getInstructions',
    value: function __getInstructions() {
      var ins = {};
      this.base.__filterAttr(ComponentWatcher.instructions, true).forEach(function (item) {
        ins[item.name] = item.value;
      });
      return ins;
    }
  }, {
    key: '__getProps',
    value: function __getProps() {
      var _this3 = this;

      var props = this.base.__filterAttr(ComponentWatcher.instructions, false);
      var obProps = [],
          normalProps = [];
      props.forEach(function (prop) {
        var parsed = _this3.base.statementExtract(prop.value);
        var type = null,
            ob = false;
        var obj = {};
        obj.name = (0, _utilityFunc.toHump)(prop.name);
        obj.value = parsed.map(function (item) {
          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
            ob = true;
          }
          return item;
        });
        if (ob === true) {
          obProps.push(obj);
        } else {
          normalProps.push(obj);
        }
      });
      return { obProps: obProps, normalProps: normalProps };
    }
  }, {
    key: '__getModel',
    value: function __getModel() {
      var instructionModel = this.__getInstructionsModel(),
          propsModel = this.__getPropsModel();
      return instructionModel.concat(propsModel);
    }
  }, {
    key: '__getInstructionsModel',
    value: function __getInstructionsModel() {
      var res = [];
      for (var key in this.instructions) {
        this.base.modelExtract(this.instructions[key]).forEach(function (item) {
          res.push(item.value);
        });
      }
      return res;
    }
  }, {
    key: '__getPropsModel',
    value: function __getPropsModel() {
      var _this4 = this;

      var res = [];
      this.props.obProps.forEach(function (prop) {
        prop.value.forEach(function (item) {
          if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
            _this4.base.modelExtract(item.value).forEach(function (model) {
              res.push(model.value);
            });
          }
        });
      });
      return res;
    }
  }, {
    key: '__execComponentCbFuncs',
    value: function __execComponentCbFuncs() {
      var _this5 = this;

      if (this.componentManager) {
        var cbs = this.componentManager.cbFuncs;
        cbs.forEach(function (item) {
          if (typeof _this5.component[item.funcName] === 'function') {
            setTimeout(function () {
              _this5.component[item.funcName].apply(_this5.component, item.query || []);
            });
          }
        });
        this.componentManager.cbFuncs = [];
      }
    }
  }]);

  return ComponentWatcher;
}();

ComponentWatcher.nodeName = 'component';
ComponentWatcher.instructions = ['data-from', 'data-props'];
ComponentWatcher.components = {};
exports.default = ComponentWatcher;