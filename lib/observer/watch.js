'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseWatcher = require('../watcher/baseWatcher/BaseWatcher');

var _BaseWatcher2 = _interopRequireDefault(_BaseWatcher);

var _utilityFunc = require('../utilityFunc/utilityFunc');

var _modelSettlement = require('../model/modelSettlement');

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
      this.watcher = new _BaseWatcher2.default(this.DOM, this.data, null, null, this.modelId);
    }
  }]);

  return Watch;
}();

exports.default = Watch;