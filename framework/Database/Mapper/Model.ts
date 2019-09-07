import { Model as BaseModel } from 'objection';
import * as pluralize from 'pluralize';

export default class Model extends BaseModel {
    static get tableName(): string {
        return pluralize(this.name.toLowerCase());
    }
}