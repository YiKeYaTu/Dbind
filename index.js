/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component = __webpack_require__(1);

	var _Component2 = _interopRequireDefault(_Component);

	var _ComponentWatcher = __webpack_require__(3);

	var _ComponentWatcher2 = _interopRequireDefault(_ComponentWatcher);

	var _ObserverWatch = __webpack_require__(15);

	var _ObserverWatch2 = _interopRequireDefault(_ObserverWatch);

	var _ComponentManager = __webpack_require__(4);

	var _utilityFunc = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observer = function () {
	    function Observer() {
	        _classCallCheck(this, Observer);
	    }

	    _createClass(Observer, null, [{
	        key: 'createClass',
	        value: function createClass(componentInf) {
	            return (0, _ComponentManager.createComponentManager)(componentInf);
	        }
	    }, {
	        key: 'registerComponent',
	        value: function registerComponent(key, component) {
	            _ComponentWatcher2.default.components[key] = component;
	        }
	    }, {
	        key: 'render',
	        value: function render(element, component, props) {}
	    }, {
	        key: 'watch',
	        value: function watch(element, data) {
	            return new (Function.prototype.bind.apply(_ObserverWatch2.default, [null].concat(Array.prototype.slice.call(arguments))))();
	        }
	    }]);

	    return Observer;
	}();

	(function () {
	    if (typeof moudle !== 'undefined' && moudle.exports) {
	        moudle.exports = Observer;
	    } else {
	        window.Observer = Observer;
	    }
	})(window);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utilityFunc = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Component = function () {
	  function Component() {
	    _classCallCheck(this, Component);

	    this.watcher = null;
	    this.element = null;
	    this.refs = null;
	    this.template = null;
	    this.props = null;
	  }

	  _createClass(Component, [{
	    key: 'init',
	    value: function init(watcher, element, props) {
	      this.watcher = watcher;
	      this.element = element;
	      this.props = props;
	      this.__setRefs();
	    }
	  }, {
	    key: 'trackingUpdate',
	    value: function trackingUpdate() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      var prevData = (0, _utilityFunc.objectAssign)({}, this.data);
	      if (arguments.length === 3) {
	        var key = arguments[1],
	            val = arguments[2];
	        this.data[key] = val;
	      } else {
	        if (_typeof(arguments[1]) !== 'object') {
	          throw '';
	        } else {
	          var dataObj = arguments[1];
	          for (var _key in dataObj) {
	            this.data[_key] = dataObj[_key];
	          }
	        }
	      }
	      this.watcher.obwatcher.reset(cb, prevData, this.data);
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.toArray = toArray;
	exports.delay = delay;
	exports.is = is;
	exports.deepClone = deepClone;
	exports.randomId = randomId;
	exports.objectAssign = objectAssign;
	exports.walkElement = walkElement;
	function toArray(arrayLike) {
	    return [].slice.call(arrayLike);
	}
	function delay(fn) {
	    var t = Date.now();
	    setTimeout(function () {
	        fn(Date.now() - t);
	    });
	}
	function is(target, type) {
	    return Object.prototype.toString.call(target).toLowerCase() === '[object ' + type.toLowerCase() + ']';
	}
	function deepClone(t) {
	    if (is(t, 'array')) {
	        t = t.map(function (item) {
	            return deepClone(item);
	        });
	    } else if (is(t, 'object')) {
	        var nt = {};
	        for (var key in t) {
	            nt[key] = deepClone(t[key]);
	        }
	        return nt;
	    } else {
	        return t;
	    }
	}
	function randomId() {
	    return Date.now() + Math.random();
	}
	function objectAssign() {
	    var arg = [].slice.call(arguments, 1);
	    var target = arguments[0];
	    arg.forEach(function (item) {
	        for (var key in item) {
	            target[key] = item[key];
	        }
	    });
	    return target;
	}
	function walkElement(dom, cb) {
	    if (is(dom, 'array')) {
	        dom.forEach(function (item) {
	            while (item) {
	                cb(item);
	                walkElement(item.firstElementChild, cb);
	                item = item.nextElementSibling;
	            }
	        });
	    } else {
	        while (dom) {
	            cb(dom);
	            walkElement(dom.firstElementChild, cb);
	            dom = dom.nextElementSibling;
	        }
	    }
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Component = __webpack_require__(1);

	var _Component2 = _interopRequireDefault(_Component);

	var _ComponentManager = __webpack_require__(4);

	var _utilityFunc = __webpack_require__(2);

	var _statementExtract = __webpack_require__(5);

	var _modelSettlement = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ComponentWatcher = function () {
	  function ComponentWatcher(base, BaseWatcher) {
	    _classCallCheck(this, ComponentWatcher);

	    this.base = base;
	    this.BaseWatcher = BaseWatcher;
	    this.modelExtractId = (0, _utilityFunc.randomId)();
	    this.instruction = this.__getInstruction();
	    this.props = this.__getProps();
	    this.componentManager = this.__getComponentManager();
	    this.component = this.componentManager.createComponent();
	    this.model = this.__getModel();
	    this.__remove();
	  }

	  _createClass(ComponentWatcher, [{
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      if (!this.componentManager) return;
	      this.child = this.__renderComponent();
	      this.resolvedProps = this.__bindProps();
	      this.component.init(this.base, this.child, this.resolvedProps);
	      this.component.willMount();
	      this.data = (0, _utilityFunc.objectAssign)({}, this.component.props, this.component.data);
	      this.childWatcher = this.__setChildWatcher();
	      this.component.didMount();
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      var _this = this;

	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      if (this.__getComponentManager().id !== this.componentManager.id) {
	        this.childWatcher.forEach(function (item) {
	          item.base.element.parent.removeChild(item.base.element);
	        });
	        this.render(cb);
	      } else {
	        var oldProps = this.resolvedProps;
	        var resetWatcherList = [];
	        this.resolvedProps = this.__bindProps();
	        if (!this.component.shouldUpdate(oldProps, this.resolvedProps)) {
	          return;
	        }
	        this.component.setProps(this.resolvedProps);
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
	        resetWatcherList.forEach(function (items) {
	          items && items.forEach(function (item) {
	            item.reset(cb = function cb() {}, _this.data);
	          });
	        });
	      }
	    }
	  }, {
	    key: '__remove',
	    value: function __remove() {
	      var element = this.base.element;
	      element.parentNode.removeChild(element);
	    }
	  }, {
	    key: '__setChildWatcher',
	    value: function __setChildWatcher() {
	      var _this2 = this;

	      var previous = null;
	      return this.child.map(function (item, index) {
	        return new _this2.BaseWatcher(item, (0, _utilityFunc.objectAssign)({}, _this2.data), previous, null, _this2.modelExtractId, _this2.component.components, _this2.base, _this2.base.getChildId(index));
	        previous = item;
	      });
	    }
	  }, {
	    key: '__bindProps',
	    value: function __bindProps() {
	      var _this3 = this;

	      var props = {};
	      this.props.normalProps.forEach(function (item) {
	        props[item.name] = item.value[0].value;
	      });
	      this.props.obProps.forEach(function (prop) {
	        var str = null;
	        prop.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            if (str === null) {
	              str = _this3.base.execStatement(item.value);
	            } else {
	              str += _this3.base.execStatement(item.value);
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
	      return props;
	    }
	  }, {
	    key: '__renderComponent',
	    value: function __renderComponent() {
	      if (!this.component) return;
	      var frg = document.createDocumentFragment();
	      var template = document.createElement('div');
	      var parent = this.base.pastDOMInformation.parentNode;
	      template.innerHTML = this.component.template;
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
	      var componentDataFrom = this.base.execStatement(this.instruction.value);
	      var componentManager = null;
	      if (typeof componentDataFrom === 'string') {
	        if (ComponentWatcher.components[componentDataFrom]) {
	          componentManager = ComponentWatcher.components[componentDataFrom];
	        } else if (this.base.components[componentDataFrom]) {
	          componentManager = this.base.components[componentDataFrom];
	        }
	      } else if (componentDataFrom instanceof _ComponentManager.ComponentManager) {
	        componentManager = componentDataFrom;
	      }
	      return componentManager;
	    }
	  }, {
	    key: '__getInstruction',
	    value: function __getInstruction() {
	      return this.base.__filterAttr(ComponentWatcher.instructions, true)[0];
	    }
	  }, {
	    key: '__getProps',
	    value: function __getProps() {
	      var _this4 = this;

	      var props = this.base.__filterAttr(ComponentWatcher.instructions, false);
	      var obProps = [],
	          normalProps = [];
	      props.forEach(function (prop) {
	        var parsed = _this4.base.statementExtract(prop.value);
	        var type = null,
	            ob = false;
	        var obj = {};
	        obj.name = prop.name.replace(/-(.)/, function (a, b) {
	          return String.fromCharCode(b.charCodeAt(0) - 32);
	        });
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
	      this.base.modelExtract(this.instruction.value).forEach(function (item) {
	        res.push(item.value);
	      });
	      return res;
	    }
	  }, {
	    key: '__getPropsModel',
	    value: function __getPropsModel() {
	      var _this5 = this;

	      var res = [];
	      this.props.obProps.forEach(function (prop) {
	        prop.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
	            _this5.base.modelExtract(item.value).forEach(function (model) {
	              res.push(model.value);
	            });
	          }
	        });
	      });
	      return res;
	    }
	  }]);

	  return ComponentWatcher;
	}();

	ComponentWatcher.nodeNames = ['component'];
	ComponentWatcher.instructions = ['data-from'];
	ComponentWatcher.components = {};
	exports.default = ComponentWatcher;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ComponentManager = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.createComponentManager = createComponentManager;

	var _Component = __webpack_require__(1);

	var _Component2 = _interopRequireDefault(_Component);

	var _utilityFunc = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ComponentManager = exports.ComponentManager = function () {
	  function ComponentManager(id, componentInf) {
	    _classCallCheck(this, ComponentManager);

	    this.id = id;
	    this.componentInf = componentInf;
	    this.trackingUpdate = null;
	  }

	  _createClass(ComponentManager, [{
	    key: 'createComponent',
	    value: function createComponent() {
	      var component = new _Component2.default();
	      component = (0, _utilityFunc.objectAssign)(component, (0, _utilityFunc.deepClone)(this.componentInf));
	      component.components = this.componentInf.components;
	      return component;
	    }
	  }]);

	  return ComponentManager;
	}();

	function createComponentManager(componentInf) {
	  return new ComponentManager((0, _utilityFunc.randomId)(), componentInf);
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resetStatementSyb = resetStatementSyb;
	exports.default = statementExtract;
	var NOR_STATEMENT = {
	  start: '{{',
	  end: '}}'
	};
	var ONCE_STATEMENT = {
	  start: '{{{',
	  end: '}}}'
	};
	var MARKS = /['"]/;

	var NOR_STATEMENT_TYPE = exports.NOR_STATEMENT_TYPE = 'normalStatement';
	var ONCE_STATEMENT_TYPE = exports.ONCE_STATEMENT_TYPE = 'onceStatement';
	var CONST_STRING = exports.CONST_STRING = 'constString';

	var checkNorStart = checkStatement(NOR_STATEMENT.start);
	var checkNorEnd = checkStatement(NOR_STATEMENT.end);
	var checkOnceStart = checkStatement(ONCE_STATEMENT.start);
	var checkOnceEnd = checkStatement(ONCE_STATEMENT.end);

	function checkStatement(statementSyb) {
	  return function (str, index) {
	    var i = 0,
	        len = statementSyb.length;
	    for (; i < len; i++, index++) {
	      if (str[index] !== statementSyb[i]) return -1;
	    }
	    return i;
	  };
	}

	function resetStatementSyb(type, sybObj) {
	  if (type === NOR_STATEMENT_TYPE) {
	    target = NOR_STATEMENT;
	  } else if (type === ONCE_STATEMENT_TYPE) {
	    target = ONCE_STATEMENT;
	  } else {
	    throw new TypeError('type need to be normalStatement or onceStatement');
	  }
	  target.start = sybObj.start;
	  target.end = sybObj.end;
	}

	function statementExtract(str) {
	  var len = str.length;
	  var res = [];
	  var stmStack = [];
	  var mrkStack = [];

	  var i = -1,
	      p = 0;

	  while (++i < len) {
	    var char = str[i];
	    var mrkLen = mrkStack.length;
	    var stmLen = stmStack.length;
	    if (mrkLen === 0) {
	      var norStart = checkNorStart(str, i);
	      var onceStart = checkOnceStart(str, i);
	      var norEnd = checkNorEnd(str, i);
	      var onceEnd = checkOnceEnd(str, i);

	      if (norStart > -1 && onceStart === -1) {
	        stmStack.push(NOR_STATEMENT_TYPE);
	        if (stmLen === 0) i += norStart;
	      } else if (onceStart > -1) {
	        stmStack.push(ONCE_STATEMENT_TYPE);
	        if (stmLen === 0) i += onceStart;
	      }
	      if (norStart > -1 || onceStart > -1) {
	        if (stmLen === 0) {
	          res[p] && p++;
	        } else {
	          res[p].value += str.slice(i, i += norStart > -1 ? norStart : onceStart);
	        }
	        continue;
	      }

	      if (norEnd > -1 && stmStack[stmLen - 1] === NOR_STATEMENT_TYPE || onceEnd > -1 && stmStack[stmLen - 1] === ONCE_STATEMENT_TYPE) {
	        stmStack.pop();
	        if (stmLen === 1) {
	          i += norEnd > -1 ? norEnd : onceEnd;
	          p++;
	        } else {
	          res[p].value += str.slice(i, i += norEnd > -1 ? norEnd : onceEnd);
	        }
	        continue;
	      }
	    }

	    if (!res[p]) {
	      res[p] = {
	        type: stmLen === 0 ? CONST_STRING : stmStack[0],
	        value: ''
	      };
	    }
	    if (MARKS.test(char) && stmLen.length > 0) {
	      if (mrkLen > 0) {
	        if (str[i - 1] !== '\\') {
	          mrkStack.pop();
	        }
	      } else {
	        mrkStack.push(char);
	      }
	    }
	    res[p].value += char;
	  }

	  if (mrkStack.length !== 0) {
	    throw new SyntaxError('Unexpected ' + mrkStack.pop());
	  }
	  return res;
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.set = set;
	exports.get = get;
	exports.all = all;

	var _BaseWatcher = __webpack_require__(16);

	var _BaseWatcher2 = _interopRequireDefault(_BaseWatcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var modelSettlement = {};

	function set(modelExtractId, key, watcher) {
	    if (!(watcher instanceof _BaseWatcher2.default)) throw new TypeError('watcher must extends from BaseWatcher');
	    if (!modelSettlement[modelExtractId]) {
	        modelSettlement[modelExtractId] = {};
	    }
	    var target = modelSettlement[modelExtractId];
	    if (target[key]) {
	        target[key].push(watcher);
	    } else {
	        target[key] = [watcher];
	    }
	}
	function get(modelExtractId, key) {
	    return modelSettlement[modelExtractId] && modelSettlement[modelExtractId][key] || null;
	}
	function all(modelExtractId) {
	    return modelSettlement[modelExtractId];
	}

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utilityFunc = __webpack_require__(2);

	var _modelSettlement = __webpack_require__(6);

	var _traversalVector = __webpack_require__(18);

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
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      this.childWacther = this.__setChildWatcher();
	      this.__appendChildWatcherToDOM();
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      if (prevData[this.vector].length !== nextData[this.vector].length) {
	        this.childWacther.forEach(function (item) {
	          var node = item.element;
	          node.parentNode.removeChild(node);
	        });
	        this.render();
	      }
	    }
	  }, {
	    key: '__appendChildWatcherToDOM',
	    value: function __appendChildWatcherToDOM() {
	      var _this = this;

	      var frg = document.createDocumentFragment(),
	          next = this.base.pastDOMInformation.nextSibling;
	      this.childWacther.forEach(function (item) {
	        frg.appendChild(item[0]);
	      });
	      if (next) {
	        next.parentNode.insertBefore(frg, next);
	      } else {
	        this.base.pastDOMInformation.parentNode.appendChild(frg);
	      }
	      this.childWacther = this.childWacther.map(function (item) {
	        return new (Function.prototype.bind.apply(_this.BaseWatcher, [null].concat(_toConsumableArray(item))))();
	      });
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
	    value: function __setChildWatcher() {
	      var _this2 = this;

	      var vector = new Function('data', 'with(data) { return ' + this.vector + ' }')(this.base.obdata);
	      var child = [];
	      (0, _traversalVector2.default)(vector, function (key, count) {
	        var obdata = (0, _utilityFunc.objectAssign)({}, _this2.base.obdata);
	        obdata[_this2.parameter[0]] = key;
	        _this2.parameter[1] && (obdata[_this2.parameter[1]] = count);
	        child.push([_this2.__cloneElement(_this2.base.element.innerHTML), obdata, _this2.base.previous, null, _this2.base.modelExtractId, _this2.base.components, _this2.base, _this2.base.getChildId(count)]);
	      });
	      return child;
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
	      var _this3 = this;

	      var res = [];
	      var flag = false;
	      this.base.modelExtract(this.instruction.value).forEach(function (item) {
	        flag && res.push(item.value);
	        if (item.value === ManagerWatcher.eachSplitInstructionChar) {
	          flag = true;
	          _this3.vector = _this3.instruction.value.slice(item.index + ManagerWatcher.eachSplitInstructionChar.length).replace(/\s/g, '');
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ElementWatcher$instr;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Event = __webpack_require__(10);

	var _utilityFunc = __webpack_require__(2);

	var _statementExtract = __webpack_require__(5);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 
	 * 
	 * @export
	 * @class ElementWatcher
	 */
	var ElementWatcher = function () {
	  function ElementWatcher(base, BaseWatcher) {
	    _classCallCheck(this, ElementWatcher);

	    this.base = base;
	    this.BaseWatcher = BaseWatcher;
	    this.__setObIdAttr();
	    this.instructions = this.__getInstructions();
	    this.instructionsList = this.instructions.map(function (item) {
	      return item.name;
	    });
	    this.instructionsModel = null;
	    this.events = this.__getEvents();
	    this.attrs = this.__getAttrs();
	    this.model = this.__getModel();

	    this.renderCount = 0;

	    this.rendering = false;
	    this.resolvedInstructions = null;
	    this.renderInf = null;
	    this.childWatchers = null;
	  }
	  /**
	   * 
	   * 
	   * @param {any} [cb=() => {}]
	   * 
	   * @memberOf ElementWatcher
	   */


	  _createClass(ElementWatcher, [{
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      this.resolvedInstructions = this.__execInstructions();
	      this.renderInf = this.__handleResolvedInstructions();
	      this.renderCount++;
	      if (this.renderInf.shouldRender || this.renderInf.shouldRender === null) {
	        if (this.renderInf.shouldRender) {
	          this.__setBaseElementDisplay(this.base.pastDOMInformation.display);
	        }
	        this.__bindAttrs();
	        if (this.renderInf.shouldInit || this.renderInf.shouldInit === null) {
	          this.__bindEvents();
	          this.__setChildWatcher();
	        }
	      } else {
	        this.__setBaseElementDisplay('none');
	      }
	    }
	    /**
	     * 
	     * 
	     * @param {any} [cb=() => {}]
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      if (prevData !== nextData) this.render(cb);
	    }
	  }, {
	    key: '__setBaseElementDisplay',
	    value: function __setBaseElementDisplay(display) {
	      this.base.element.style.display = display;
	    }
	  }, {
	    key: '__setObIdAttr',
	    value: function __setObIdAttr() {
	      this.base.element.setAttribute('data-ob-id', this.base.obId);
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__getInstructionsModel',
	    value: function __getInstructionsModel() {
	      var _this = this;

	      var res = [];
	      this.instructionsModel = {};
	      this.instructions.forEach(function (instruction) {
	        _this.base.modelExtract(instruction.value).forEach(function (item) {
	          res.push(item.value);
	          _this.instructionsModel[instruction.name] = item.value;
	        });
	      });
	      if (this.hasElseInstruction()) {
	        res = res.concat(this.__getPrevIfInstructionModel());
	      }
	      return res;
	    }
	  }, {
	    key: '__getPrevIfInstructionModel',
	    value: function __getPrevIfInstructionModel() {
	      var _this2 = this;

	      var model = null;
	      this.base.traversalPrevious(function (previousWatcher) {
	        if (previousWatcher.obtype === _this2.BaseWatcher.TextWatcher) return true;
	        if (previousWatcher.obtype === _this2.BaseWatcher.ManagerWatcher) return false;
	        if (previousWatcher.obwatcher.hasElseIfInstruction()) {
	          model = previousWatcher.obwatcher.instructionsModel[ElementWatcher.instructions[2]];
	          return false;
	        }
	        if (previousWatcher.obwatcher.hasIfInstruction()) {
	          model = previousWatcher.obwatcher.instructionsModel[ElementWatcher.instructions[1]];
	          return false;
	        }
	      });
	      return model;
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__getModel',
	    value: function __getModel() {
	      var instructionsModel = this.__getInstructionsModel(),
	          attrsModel = this.__getAttrsModel();
	      return instructionsModel.concat(attrsModel);
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__getAttrsModel',
	    value: function __getAttrsModel() {
	      var _this3 = this;

	      var res = [];
	      this.attrs.obattrs.forEach(function (attr) {
	        attr.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE) {
	            _this3.base.modelExtract(item.value).forEach(function (model) {
	              res.push(model.value);
	            });
	          }
	        });
	      });
	      return res;
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: 'hasIfInstruction',
	    value: function hasIfInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[0]) > -1;
	    }
	  }, {
	    key: 'hasElseInstruction',
	    value: function hasElseInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[1]) > -1;
	    }
	  }, {
	    key: 'hasElseIfInstruction',
	    value: function hasElseIfInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[2]) > -1;
	    }
	  }, {
	    key: 'hasHtmlInstruction',
	    value: function hasHtmlInstruction() {
	      return this.instructionsList.indexOf(ElementWatcher.instructions[3]) > -1;
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__getInstructions',
	    value: function __getInstructions() {
	      var _this4 = this;

	      return this.base.__filterAttr(ElementWatcher.instructions, true).map(function (item) {
	        _this4.base.removeAttr(item.name);
	        return { name: item.name, value: item.value };
	      });
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__getAttrs',
	    value: function __getAttrs() {
	      var _this5 = this;

	      var attrs = this.base.__filterAttr(_Event.events.concat(ElementWatcher.instructions), false);
	      var obattrs = [],
	          normalAttrs = [];
	      attrs.forEach(function (attr) {
	        var parsed = _this5.base.statementExtract(attr.value);
	        var type = null,
	            ob = false;
	        var obj = {};
	        obj.name = attr.name;
	        obj.value = parsed.map(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            ob = true;
	          }
	          return item;
	        });
	        if (ob === true) {
	          obattrs.push(obj);
	        } else {
	          normalAttrs.push(obj);
	        }
	      });
	      return { obattrs: obattrs, normalAttrs: normalAttrs };
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__getEvents',
	    value: function __getEvents() {
	      var _this6 = this;

	      var eventAttrs = this.base.__filterAttr(_Event.events);
	      var obEvents = [],
	          onceEvents = [],
	          normalEvents = [];
	      eventAttrs.forEach(function (item) {
	        var parsed = _this6.base.statementExtract(item.value);
	        var obj = {};
	        obj.name = item.name;
	        obj.value = parsed[0].value;
	        if (parsed.length > 1) {
	          throw '';
	        } else {
	          if (parsed[0].type === _statementExtract.NOR_STATEMENT_TYPE) {
	            obEvents.push(obj);
	          } else if (parsed[0].type === _statementExtract.ONCE_STATEMENT_TYPE) {
	            onceEvents.push(obj);
	          } else {
	            normalEvents.push(obj);
	          }
	        }
	      });
	      return { obEvents: obEvents, onceEvents: onceEvents, normalEvents: normalEvents };
	    }
	    /**
	     * 
	     * 
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__bindEvents',
	    value: function __bindEvents() {
	      var _this7 = this;

	      var events = [this.events.obEvents, this.events.onceEvents];
	      events.forEach(function (item, index) {
	        if (item.length === 0) return;
	        var obdata = index === 1 ? (0, _utilityFunc.deepClone)(_this7.base.obdata) : _this7.base.obdata;
	        item.forEach(function (item) {
	          _this7.base.element[item.name] = null;
	          _this7.base.removeAttr(item.name);
	          (0, _Event.on)(_this7.base.element, item.name.substring(2), function ($event) {
	            new Function('data, $event', 'with(data) { ' + item.value + ' }')(obdata, $event);
	          });
	        });
	      });
	    }
	    /**
	     * 
	     * 
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__bindAttrs',
	    value: function __bindAttrs() {
	      var _this8 = this;

	      this.attrs.obattrs.forEach(function (attr) {
	        var str = '';
	        attr.value.forEach(function (item) {
	          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) str += _this8.base.execStatement(item.value);else str += item.value;
	        });
	        _this8.base.element.setAttribute(attr.name, str);
	      });
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__execInstructions',
	    value: function __execInstructions() {
	      var _this9 = this;

	      var resolved = {};
	      this.instructions.forEach(function (item) {
	        resolved[item.name] = _this9.base.execStatement(item.value);
	      });
	      return resolved;
	    }
	  }, {
	    key: '__setChildWatcher',
	    value: function __setChildWatcher() {
	      var _this10 = this;

	      if (ElementWatcher.escapeNode.indexOf(this.base.pastDOMInformation.nodeName.toLowerCase()) > -1) return;
	      if (this.renderInf.shouldRenderHtml) {
	        this.childWatchers = [new this.BaseWatcher(this.base.element, (0, _utilityFunc.objectAssign)({}, this.base.obdata), null, this.BaseWatcher.TextWatcher, this.base.modelExtractId, this.base.components, this.base)];
	      } else {
	        (function () {
	          var previousWatcher = null;
	          _this10.childWatchers = (0, _utilityFunc.toArray)(_this10.base.element.childNodes).map(function (item, index) {
	            var childWatcher = new _this10.BaseWatcher(item, (0, _utilityFunc.objectAssign)({}, _this10.base.obdata), previousWatcher, null, _this10.base.modelExtractId, _this10.base.components, _this10.base, _this10.base.getChildId(index));
	            previousWatcher = childWatcher;
	            return childWatcher;
	          });
	        })();
	      }
	    }
	    /**
	     * 
	     * 
	     * @returns
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__handleResolvedInstructions',
	    value: function __handleResolvedInstructions() {
	      var renderInf = {
	        shouldRender: null,
	        shouldRenderHtml: false,
	        shouldInit: null
	      };
	      for (var key in this.resolvedInstructions) {
	        var resolvedInstruction = this.resolvedInstructions[key];
	        this[ElementWatcher.instructionsHandle[key]](resolvedInstruction, renderInf);
	      }
	      renderInf.shouldInit = renderInf.shouldRender && this.renderCount === 0;
	      if (this.renderCount === 0 && !renderInf.shouldInit) this.renderCount--;
	      return renderInf;
	    }
	    /**
	     * 
	     * 
	     * @param {any} resolvedInstruction
	     * @param {any} renderInf
	     * 
	     * @memberOf ElementWatcher
	     */

	  }, {
	    key: '__handleIfInstruction',
	    value: function __handleIfInstruction(resolvedInstruction, renderInf) {
	      return resolvedInstruction;
	    }
	  }, {
	    key: '__handleElseIfInstruction',
	    value: function __handleElseIfInstruction(resolvedInstruction, renderInf) {
	      var f1 = this.__handleIfInstruction(resolvedInstruction, renderInf),
	          f2 = this.__handleElseInstruction(resolvedInstruction, renderInf);
	      var shouldRender = f2 && f1;
	      renderInf.shouldRender = shouldRender;
	      return shouldRender;
	    }
	  }, {
	    key: '__handleElseInstruction',
	    value: function __handleElseInstruction(resolvedInstruction, renderInf) {
	      var _this11 = this;

	      var noError = false,
	          shouldRender = true;
	      this.base.traversalPrevious(function (previousWatcher) {
	        if (previousWatcher.obtype === _this11.BaseWatcher.TextWatcher) return true;
	        if (previousWatcher.obtype === _this11.BaseWatcher.ManagerWatcher) return false;
	        if (previousWatcher.obwatcher.hasElseInstruction()) return false;
	        if (previousWatcher.obwatcher.renderInf.shouldRender === null) return false;
	        if (previousWatcher.obwatcher.renderInf.shouldRender === true) shouldRender = false;
	        if (previousWatcher.obwatcher.hasIfInstruction()) {
	          noError = true;
	          return false;
	        }
	      });
	      if (!noError) throw 'data-else或者data-else-if指令之前必须有一个除ManagerWatcher之外的watcher';
	      renderInf.shouldRender = shouldRender;
	      return shouldRender;
	    }
	  }, {
	    key: '__handleHtmlInstruction',
	    value: function __handleHtmlInstruction(resolvedInstruction, renderInf) {
	      renderInf.shouldRenderHtml = true;
	    }
	  }]);

	  return ElementWatcher;
	}();

	ElementWatcher.instructions = ['data-if', 'data-else', 'data-else-if', 'data-html'];
	ElementWatcher.escapeNode = ['script'];
	ElementWatcher.instructionsHandle = (_ElementWatcher$instr = {}, _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[0], '__handleIfInstruction'), _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[1], '__handleElseInstruction'), _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[2], '__handleElseIfInstruction'), _defineProperty(_ElementWatcher$instr, ElementWatcher.instructions[3], '__handleHtmlInstruction'), _ElementWatcher$instr);
	exports.default = ElementWatcher;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.on = on;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var events = exports.events = ['onafterprint', 'onbeforeprint', 'onbeforeunload', 'onerror', 'onhaschange', 'onload', 'onmessage', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onredo', 'onresize', 'onstorage', 'onundo', 'onunload', 'onblur', 'onchange', 'oncontextmenu', 'onfocus', 'onformchange', 'onforminput', 'oninvalid', 'onreset', 'onselect', 'onsubmit', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onscroll', 'onabort', 'oncanplay', 'oncanplaythrough', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreadystatechange', 'onseeked', 'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate', 'onvolumechange', 'onwaiting'];

	var eventPool = {};

	var _loop = function _loop(i, len) {
	  var eventName = events[i].slice(2);
	  bindEvent(document, eventName, function (event) {
	    var dom = event.target;
	    var obId = getObId(dom);
	    var eventHandles = eventPool[obId] && eventPool[obId][eventName];
	    eventHandles && eventHandles.map(function (eventHandle) {
	      return eventHandle(event);
	    });
	  });
	};

	for (var i = 0, len = events.length; i < len; i++) {
	  _loop(i, len);
	}

	function bindEvent(dom, eventType, eventHandle) {
	  if (dom.addEventListener) {
	    dom.addEventListener(eventType, eventHandle);
	  } else if (dom.attachEvent) {
	    dom.attachEvent('on' + eventType, eventHandle);
	  } else {
	    dom['on' + eventType] = eventHandle;
	  }
	}

	function getObId(dom) {
	  return dom.dataset && dom.dataset.obId;;
	}

	function on(dom, eventType, eventHandle) {
	  var obId = getObId(dom);
	  if (!eventPool[obId]) {
	    eventPool[obId] = _defineProperty({}, eventType, [eventHandle]);
	  } else {
	    if (eventPool[obId][eventType]) {
	      eventPool[obId][eventType].push(eventHandle);
	    } else {
	      eventPool[obId][eventType] = [eventHandle];
	    }
	  }
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _statementToString = __webpack_require__(17);

	var _statementToString2 = _interopRequireDefault(_statementToString);

	var _statementExtract = __webpack_require__(5);

	var _utilityFunc = __webpack_require__(2);

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
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      this.view = this.__parseView();
	      if (this.watcherType === TextWatcher.textNodeWatcher) {
	        this.base.element.textContent = this.view;
	      } else {
	        this.base.element.innerHTML = this.view;
	      }
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
	      var prevData = arguments[1];
	      var nextData = arguments[2];

	      if (prevData !== nextData) {
	        this.render(cb);
	      }
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

/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var VAR_START = /[a-zA-Z_$]/;
	var VAR_AFTER = /[a-zA-Z_$0-9]/;

	var MARKS = /['"]/;
	var POINT = /\./;
	var BRK_START = /\[/;
	var BRK_END = /\]/;
	var BRC_START = /\{/;
	var BRC_END = /\}/;
	var TH_START = /\(/;
	var TH_END = /\)/;
	var COMMA = /,/;
	var COLON = /:/;
	var SPACE = /\s/;
	var BAK_SLANT = /\\/;

	var UN_EXPECT_CHAR = {
	  'function': true
	};

	/**
	 * 
	 * 
	 * @param {string} str
	 * @returns {array}
	 * 该函数返回javascript表达式之中所使用的变量
	 * 表达式之中不能含有函数作用域
	 */
	function modelExtract(str) {
	  var len = str.length;
	  var res = [];
	  var sybStk = [];
	  var brkStk = [];

	  var i = -1,
	      p = -1;
	  while (++i < len) {
	    var char = str[i];
	    var brkTop = brkStk[brkStk.length - 1];
	    var sybTop = sybStk[sybStk.length - 1];

	    if (SPACE.test(char)) continue;
	    /**
	     * 捕获变量
	     */
	    if (char.match(VAR_START)) {
	      if (sybTop && POINT.test(sybTop) || brkTop && BRC_START.test(brkTop) && !COLON.test(sybTop)) {
	        while (++i < len && VAR_AFTER.test(str[i])) {}
	      } else {
	        res[++p] = { index: i, value: char };
	        while (++i < len && VAR_AFTER.test(str[i])) {
	          res[p].value += str[i];
	        }
	        if (UN_EXPECT_CHAR[res[p].value] === true) {
	          throw new SyntaxError('Unexpected function, in Observer statement you can\'t use function');
	        }
	      }
	      i--;sybStk.pop();
	    } else if (MARKS.test(char)) {
	      while (++i < len && (str[i] !== char || BAK_SLANT.test(str[i - 1]))) {}
	      sybStk.pop();
	    } else if (BRC_START.test(char) || BRK_START.test(char) || TH_START.test(char)) {
	      sybStk.pop();
	      brkStk.push(char);
	    } else if (BRC_END.test(char) || BRK_END.test(char) || TH_END.test(char)) {
	      brkStk.pop();
	    } else if (COLON.test(char) || POINT.test(char)) {
	      sybStk.push(char);
	    } else {
	      sybStk.pop();
	    }
	  }
	  return res;
	}
	exports.default = modelExtract;

/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseWatcher = __webpack_require__(16);

	var _BaseWatcher2 = _interopRequireDefault(_BaseWatcher);

	var _utilityFunc = __webpack_require__(2);

	var _modelSettlement = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Watch = function () {
	    function Watch(DOM, data) {
	        _classCallCheck(this, Watch);

	        this.DOM = DOM;
	        this.data = data;
	        this.modelId = (0, _utilityFunc.randomId)();
	        this.init();
	    }

	    _createClass(Watch, [{
	        key: 'init',
	        value: function init() {
	            var _this = this;

	            (0, _utilityFunc.delay)(function () {
	                _this.watcher = new _BaseWatcher2.default(_this.DOM, _this.data, null, null, _this.modelId);
	            });
	        }
	        // set() {
	        //     const cbs = [];
	        //     if(arguments.length === 2) {
	        //         const key = arguments[0],
	        //               val = arguments[1];
	        //         cbs.push(get(this.modelId, key));
	        //     } else {
	        //         if(typeof arguments[0] !== 'object') {
	        //             throw '';
	        //         } else {
	        //             const dataObj = arguments[0];
	        //             for(let key in dataObj) {
	        //                 cbs.push(get(this.modelId, key));
	        //             }
	        //         }
	        //     }
	        //     cbs.forEach((watchers) => {
	        //         watchers && watchers.forEach((watcher) => {
	        //             watcher.setData(() => {}, ...arguments);
	        //             // fn();
	        //         });
	        //     });
	        // }

	    }]);

	    return Watch;
	}();

	exports.default = Watch;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utilityFunc = __webpack_require__(2);

	var _ManagerWatcher = __webpack_require__(8);

	var _ManagerWatcher2 = _interopRequireDefault(_ManagerWatcher);

	var _ElementWatcher = __webpack_require__(9);

	var _ElementWatcher2 = _interopRequireDefault(_ElementWatcher);

	var _ComponentWatcher = __webpack_require__(3);

	var _ComponentWatcher2 = _interopRequireDefault(_ComponentWatcher);

	var _TextWatcher = __webpack_require__(11);

	var _TextWatcher2 = _interopRequireDefault(_TextWatcher);

	var _modelExtract2 = __webpack_require__(13);

	var _modelExtract3 = _interopRequireDefault(_modelExtract2);

	var _statementExtract2 = __webpack_require__(5);

	var _statementExtract3 = _interopRequireDefault(_statementExtract2);

	var _modelSettlement = __webpack_require__(6);

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
	    this.rendering = false;
	    this.modelExtractId = modelExtractId;
	    this.pastDOMInformation = this.__getPastDOMInformation();
	    this.obtype = this.__getType(forceWatcherType);
	    this.obwatcher = this.__getWatcher();
	    this.__hangonModel(this.modelExtractId);

	    this.render();
	  }

	  _createClass(BaseWatcher, [{
	    key: 'render',
	    value: function render() {
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      this.obwatcher.render(cb);
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var _this = this;

	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      if (this.rendering === true) {
	        return;
	      }
	      var prevData = (0, _utilityFunc.objectAssign)({}, this.obdata);
	      var nextData = (0, _utilityFunc.objectAssign)({}, this.obdata);
	      this.rendering = true;
	      if (arguments.length === 3) {
	        var key = arguments[1],
	            val = arguments[2];
	        nextData[key] = val;
	      } else {
	        if (_typeof(arguments[1]) !== 'object') {
	          throw '';
	        } else {
	          var dataObj = arguments[1];
	          for (var _key in dataObj) {
	            nextData[_key] = dataObj[_key];
	          }
	        }
	      }
	      this.obdata = nextData;
	      (0, _utilityFunc.delay)(function (time) {
	        _this.obwatcher.reset(cb, prevData, nextData);
	        cb(time);
	        _this.rendering = false;
	      });
	    }
	  }, {
	    key: 'trackingUpdate',
	    value: function trackingUpdate() {
	      var _arguments = arguments;
	      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

	      var resetWatcherList = [];
	      var target = arguments[1];
	      if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
	        for (var key in target) {
	          resetWatcherList.push((0, _modelSettlement.get)(this.modelExtractId, key));
	        }
	      } else {
	        resetWatcherList.push((0, _modelSettlement.get)(this.modelExtractId, target));
	      }
	      resetWatcherList.forEach(function (items) {
	        items && items.forEach(function (item) {
	          return item.reset.apply(item, _arguments);
	        });
	      });
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
	        } else if (_ComponentWatcher2.default.nodeNames.indexOf(NODE_NAME) > -1) {
	          return BaseWatcher.ComponentWatcher;
	        } else if (_ComponentWatcher2.default.components[NODE_NAME]) {
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
	      return new Function('data', 'with(data) { return ' + statement + ';}').call(this.obdata, this.obdata);
	    }
	  }]);

	  return BaseWatcher;
	}();

	BaseWatcher.ManagerWatcher = 1;
	BaseWatcher.ElementWatcher = 2;
	BaseWatcher.TextWatcher = 3;
	BaseWatcher.ComponentWatcher = 4;
	exports.default = BaseWatcher;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	exports.default = function (val) {
	    if (val instanceof HTMLElement) {
	        return handleDOMValue(val);
	    } else {
	        return handleTextValue(val);
	    }
	};

	function handleDOMValue(DOM) {
	    var nodeName = DOM.nodeName.toLowerCase();
	    var attrs = toArray(DOM.attributes).map(function (item) {
	        return item.name + '=\'' + item.value + '\'';
	    }).join('\s');
	    return '<' + nodeName + ' ' + attrs + '>' + DOM.innerHTML + '</' + nodeName + '>';
	}
	function handleTextValue(text) {
	    return text;
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = traversalVector;

	var _utilityFunc = __webpack_require__(2);

	function traversalVector(vector, cb) {
	  if (!(0, _utilityFunc.is)(cb, 'function')) {
	    throw new TypeError('cb is not a function');
	  }
	  if ((0, _utilityFunc.is)(vector, 'array')) {
	    vector.forEach(function (item, index) {
	      cb(index, index);
	    });
	  } else if ((0, _utilityFunc.is)(vector, 'object')) {
	    var count = 0;
	    for (var key in vector) {
	      if (vector.hasOwnProperty(key)) {
	        cb(key, count++);
	      }
	    }
	  }
	}

/***/ }
/******/ ]);