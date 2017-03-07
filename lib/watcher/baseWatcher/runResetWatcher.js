"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (resetWatcherList, data) {
  var count = 0,
      len = 0;
  resetWatcherList.forEach(function (watchers) {
    watchers.forEach(function (item) {
      return item.reset(data);
    });
  });
};