import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeafTypes, Leaves } from './configuration';
import { IConfig } from './envs/interfaces';

@Injectable()
export class TypedConfigService {
    constructor(private readonly _configService: ConfigService) {}

    get<T extends Leaves<IConfig>>(propertyPath: T): LeafTypes<IConfig, T> {
        return this._configService.get(propertyPath);
    }
}
