export default function(resetWatcherList, data, cb) {
  let count = 0, len = 0;
  resetWatcherList.forEach((watcherPool) => {
    if(watcherPool) {
      for(let id in watcherPool) {
        len ++;
        watcherPool[id].reset(data, () => {
          count ++;
          count === len && cb();
        });
      }
    }
  });
}
