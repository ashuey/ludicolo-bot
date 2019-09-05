import { Model as BaseModel } from 'objection';

export default class Model extends BaseModel {
    public testFunc(): void {
        console.log('buttz');
        console.log(this.constructor.name);
    }
}