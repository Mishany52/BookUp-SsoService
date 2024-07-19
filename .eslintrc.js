module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'nestjs', 'import', 'filenames'],

    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:security/recommended-legacy',
    ],

    rules: {
        // Именование файлов
        'filenames/match-exported': [2, ['kebab']],
        'filenames/no-index': 'error',

        // Именование объектов
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase', 'UPPER_CASE'],
            },
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE'],
            },
            {
                selector: 'parameter',
                format: ['camelCase'],
            },
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'require',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],

        // Правила NestJS
        'nestjs/use-dependency-injection': 'error',
        'nestjs/deprecated-api-modules': 'error',

        // Чистый код
        complexity: 'error',
        'max-depth': 'error',
        'no-console': 'warn',

        // DDD
        'import/no-cycle': 'error',
        'no-restricted-imports': 'error',
        '@typescript-eslint/prefer-readonly': 'error',

        // Остальные правила
        'import/no-extraneous-dependencies': 'error',
        'no-useless-constructor': 'off',
        // etc
    },
};
