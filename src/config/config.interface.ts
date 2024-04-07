import type { config as base } from './envs/common';
import type { config as dev } from './envs/development';
export type Objectype = Record<string, unknown>;
export type Default = typeof base;
export type Develop = typeof dev;
export type Config = Default & Develop;
