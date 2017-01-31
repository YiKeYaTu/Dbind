import BaseWatcher from './watcher/baseWatcher/BaseWatcher';
import { randomId, objectAssign, delay } from './utilityFunc';
import { get, all } from './modelSettlement';
export default class Watch {
    constructor(DOM, data) {
        this.DOM = DOM;
        this.data = data;
        this.modelId = randomId();
        this.init();
    }
    init() {
        delay(() => {
            this.watcher = new BaseWatcher(
                this.DOM,
                this.data,
                null,
                null,
                this.modelId
            )
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
}