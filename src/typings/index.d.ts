/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
type ArgumentTypes<F extends Function> =
F extends (...args: infer A) => any ? A : never;

type ReturnTypes<F extends Function> =
F extends (...args: any[]) => infer A ? A : never;
