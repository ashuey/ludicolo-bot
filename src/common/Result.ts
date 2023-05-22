export type Result<T, E = Error> = [true, T] | [false, E];
