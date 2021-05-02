/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
type ArgumentTypes<F extends Function> =
F extends (...args: infer A) => any ? A : never;

type ReturnTypes<F extends Function> =
F extends (...args: any[]) => infer A ? A : never;

export * from './api';
export * from './auth';
export * from './icons';
export * from './restError';
export * from './socket';
