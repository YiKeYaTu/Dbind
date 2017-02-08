import BaseWatcher from '../watcher/baseWatcher/BaseWatcher';
import { randomId, objectAssign, delay } from '../utilityFunc/utilityFunc';
import { get, all } from '../model/modelSettlement';
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
}