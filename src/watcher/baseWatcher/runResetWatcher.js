export default function(resetWatcherList, data) {
  let count = 0, len = 0;
  resetWatcherList.forEach((watchers) => {
    watchers.forEach(item => item.reset(data));
  });
}
