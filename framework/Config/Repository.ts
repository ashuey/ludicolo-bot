import RepositoryContract from "../Contracts/Config/Repository"
import * as _ from 'lodash';

export default class Repository implements RepositoryContract {
    protected items = {};

    constructor(items?: object) {
        if (items) {
            this.items = items;
        }
    }

    all(): object {
        return this.items;
    }

    get(key: string, default_?: any): any {
        return _.get(this.items, key, default_);
    }

    has(key: string): boolean {
        return _.has(this.items, key);
    }

    set(key: string, value: any = null) {
        return _.set(this.items, key, value);
    }
}