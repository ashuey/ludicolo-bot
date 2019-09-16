import { Model as BaseModel } from 'objection';
import * as pluralize from 'pluralize';
import * as moment from 'moment'

export default class Model extends BaseModel {
    public created_at;

    public updated_at;

    static get tableName(): string {
        return pluralize(this.name.toLowerCase());
    }

    $beforeInsert() {
        this.created_at = this.updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    }

    $beforeUpdate() {
        this.updated_at = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    }
}