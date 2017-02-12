"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (resetWatcherList, data, cb) {
  var count = 0,
      len = 0;
  resetWatcherList.forEach(function (watcherPool) {
    if (watcherPool) {
      for (var id in watcherPool) {
        len++;
        watcherPool[id].reset(data, function () {
          count++;
          count === len && cb();
        });
      }
    }
  });
};