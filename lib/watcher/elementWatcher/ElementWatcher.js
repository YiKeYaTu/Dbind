'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ElementWatcher$instr;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = require('../../dom/event/Event');

var _utilityFunc = require('../../utilityFunc/utilityFunc');

var _statementExtract = require('../../parser/statementExtract');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

  _createClass(ElementWatcher, [{
    key: 'destructor',
    value: function destructor() {
      var node = this.base.element;
      node.parentNode.removeChild(node);
      this.__destructorChild();
    }
  }, {
    key: 'render',
    value: function render() {
      var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      this.resolvedInstructions = this.__execInstructions();
      this.renderInf = this.__handleResolvedInstructions();
      if (this.renderInf.shouldRender || this.renderInf.shouldRender === null) {
        if (this.renderInf.shouldRender) {
          this.__setBaseElementDisplay(this.base.pastDOMInformation.display);
        }
        this.__bindAttrs();
        if (this.renderInf.shouldInit) {
          this.__bindEvents();
        }
        if (!this.childWatchers) {
          this.__setChildWatcher();
        }
      } else {
        if (this.childWatchers) {
          this.__destructorChild();
          this.base.element.innerHTML = this.base.pastDOMInformation.innerHTML;
        }
        this.__setBaseElementDisplay('none');
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
    key: '__destructorChild',
    value: function __destructorChild() {
      this.childWatchers && this.childWatchers.forEach(function (item) {
        return item.destructor();
      });
      this.childWatchers = null;
    }
  }, {
    key: '__setChildWatcher',
    value: function __setChildWatcher() {
      var _this = this;

      if (ElementWatcher.escapeNode.indexOf(this.base.pastDOMInformation.nodeName.toLowerCase()) > -1) return;
      if (this.renderInf.shouldRenderHtml) {
        this.childWatchers = [new this.BaseWatcher(this.base.element, (0, _utilityFunc.objectAssign)({}, this.base.obdata), null, this.BaseWatcher.TextWatcher, this.base.modelExtractId, this.base.components, this.base)];
      } else {
        (function () {
          var previousWatcher = null;
          _this.childWatchers = (0, _utilityFunc.toArray)(_this.base.element.childNodes).map(function (item, index) {
            var childWatcher = new _this.BaseWatcher(item, (0, _utilityFunc.objectAssign)({}, _this.base.obdata), previousWatcher, null, _this.base.modelExtractId, _this.base.components, _this.base, _this.base.getChildId(index));
            previousWatcher = childWatcher;
            return childWatcher;
          });
        })();
      }
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
  }, {
    key: '__getInstructionsModel',
    value: function __getInstructionsModel() {
      var _this2 = this;

      var res = [];
      this.instructionsModel = {};
      this.instructions.forEach(function (instruction) {
        _this2.base.modelExtract(instruction.value).forEach(function (item) {
          res.push(item.value);
          _this2.instructionsModel[instruction.name] = item.value;
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
      var _this3 = this;

      var model = null;
      this.base.traversalPrevious(function (previousWatcher) {
        if (previousWatcher.obtype === _this3.BaseWatcher.TextWatcher) return true;
        if (previousWatcher.obtype === _this3.BaseWatcher.ManagerWatcher) return false;
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
  }, {
    key: '__getModel',
    value: function __getModel() {
      var instructionsModel = this.__getInstructionsModel(),
          attrsModel = this.__getAttrsModel();
      return instructionsModel.concat(attrsModel);
    }
  }, {
    key: '__getAttrsModel',
    value: function __getAttrsModel() {
      var _this4 = this;

      var res = [];
      this.attrs.obattrs.forEach(function (attr) {
        attr.value.forEach(function (item) {
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
  }, {
    key: '__getInstructions',
    value: function __getInstructions() {
      var _this5 = this;

      return this.base.__filterAttr(ElementWatcher.instructions, true).map(function (item) {
        _this5.base.removeAttr(item.name);
        return { name: item.name, value: item.value };
      });
    }
  }, {
    key: '__getAttrs',
    value: function __getAttrs() {
      var _this6 = this;

      var attrs = this.base.__filterAttr(_Event.events.concat(ElementWatcher.instructions), false);
      var obattrs = [],
          normalAttrs = [];
      attrs.forEach(function (attr) {
        var parsed = _this6.base.statementExtract(attr.value);
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
  }, {
    key: '__getEvents',
    value: function __getEvents() {
      var _this7 = this;

      var eventAttrs = this.base.__filterAttr(_Event.events);
      var obEvents = [],
          onceEvents = [],
          normalEvents = [];
      eventAttrs.forEach(function (item) {
        var parsed = _this7.base.statementExtract(item.value);
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
  }, {
    key: '__bindEvents',
    value: function __bindEvents() {
      var _this8 = this;

      var events = [this.events.obEvents, this.events.onceEvents];
      events.forEach(function (item, index) {
        if (item.length === 0) return;
        var obdata = index === 1 ? (0, _utilityFunc.deepClone)(_this8.base.obdata) : _this8.base.obdata;
        item.forEach(function (item) {
          _this8.base.element[item.name] = null;
          _this8.base.removeAttr(item.name);
          (0, _Event.on)(_this8.base.element, item.name.substring(2), function ($event) {
            new Function('data, $event', 'with(data) { ' + item.value + ' }')(obdata, $event);
          });
        });
      });
    }
  }, {
    key: '__bindAttrs',
    value: function __bindAttrs() {
      var _this9 = this;

      this.attrs.obattrs.forEach(function (attr) {
        var str = '';
        attr.value.forEach(function (item) {
          if (item.type === _statementExtract.NOR_STATEMENT_TYPE || item.type === _statementExtract.ONCE_STATEMENT_TYPE) {
            str += _this9.__toString(_this9.base.execStatement(item.value));
          } else {
            str += item.value;
          }
        });
        _this9.base.element.setAttribute(attr.name, str);
      });
    }
  }, {
    key: '__toString',
    value: function __toString(val) {
      if ((0, _utilityFunc.is)(val, 'object')) {
        var str = '';
        for (var key in val) {
          str += (0, _utilityFunc.toHumpBack)(key) + ':' + val[key] + ';';
        }
        return str;
      } else {
        return val;
      }
    }
  }, {
    key: '__execInstructions',
    value: function __execInstructions() {
      var _this10 = this;

      var resolved = {};
      this.instructions.forEach(function (item) {
        resolved[item.name] = _this10.base.execStatement(item.value);
      });
      return resolved;
    }
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
      renderInf.shouldInit = (renderInf.shouldRender === true || renderInf.shouldRender === null) && this.renderCount === 0;
      if (this.renderCount === 0 && renderInf.shouldRender === false) {
        this.renderCount--;
      };
      this.renderCount++;
      return renderInf;
    }
  }, {
    key: '__handleIfInstruction',
    value: function __handleIfInstruction(resolvedInstruction, renderInf) {
      return renderInf.shouldRender = !!resolvedInstruction;
    }
  }, {
    key: '__handleElseIfInstruction',
    value: function __handleElseIfInstruction(resolvedInstruction, renderInf) {
      var ifFlag = this.__handleIfInstruction(resolvedInstruction, renderInf),
          elseFlag = this.__handleElseInstruction(resolvedInstruction, renderInf);
      return renderInf.shouldRender = ifFlag && elseFlag;
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
      if (!noError) throw new SyntaxError('Unexpected else');
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