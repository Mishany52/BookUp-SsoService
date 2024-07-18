import type { Config, Default, Objectype, Develop } from './config.interface';

const util = {
    isObject<T>(value: T): value is T & Objectype {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    },
    merge<T extends Objectype, U extends Objectype>(target: T, source: U): T & U {
        for (const key of Object.keys(source)) {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (this.isObject(targetValue) && this.isObject(sourceValue)) {
                Object.assign(sourceValue, this.merge(targetValue, sourceValue));
            }
        }

        return { ...target, ...source };
    },
};

export const configuration = async (): Promise<Config> => {
    const { config } = <{ config: Default }>await import(`${__dirname}/envs/common`);
    const { config: environment } = <{ config: Develop }>(
        await import(`${__dirname}/envs/${process.env.NODE_ENV || 'development'}`)
    );

    // object deep merge
    return util.merge(config, environment);
};

export type Leaves<T> = T extends object
    ? {
          [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
              ? ''
              : `.${Leaves<T[K]>}`}`;
      }[keyof T]
    : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
    ? T1 extends keyof T
        ? LeafTypes<T[T1], T2>
        : never
    : S extends keyof T
      ? T[S]
      : never;
