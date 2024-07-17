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

export class ConfigService {
    private _config: Config;

    constructor() {
        configuration().then((config) => (this._config = config));
    }

    // Generic get method to handle all configuration values
    get<K extends keyof Config>(key: K): Config[K] {
        return this._config[key];
    }
}
