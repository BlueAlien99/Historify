const importResolverSettings = {
    'import/resolver': {
        typescript: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    },
};

const noUnusedVars = [
    1,
    {
        ignoreRestSiblings: true,
        argsIgnorePattern: 'res|next|^err|^_+$',
    },
];

const eslintRules = {
    'no-console': 'warn',
    'no-void': 'off',
    'import/order': [
        'error',
        { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'] },
    ],
    'import/no-unresolved': 'off',
    'jsx-a11y/label-has-associated-control': [
        'error',
        {
            required: {
                some: ['nesting', 'id'],
            },
        },
    ],
    'jsx-a11y/label-has-for': [
        'error',
        {
            required: {
                some: ['nesting', 'id'],
            },
        },
    ],

    // Wes Bos
    'no-debugger': 0,
    'no-use-before-define': 'off',
    // 'import/no-cycle': 'off',
    'no-alert': 0,
    'no-await-in-loop': 0,
    'no-return-assign': ['error', 'except-parens'],
    'no-restricted-syntax': [2, 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-unused-vars': noUnusedVars,
    'prefer-const': [
        'error',
        {
            destructuring: 'all',
        },
    ],
    'arrow-body-style': [2, 'as-needed'],
    'no-unused-expressions': [
        2,
        {
            allowTaggedTemplates: true,
        },
    ],
    'no-param-reassign': [
        2,
        {
            props: false,
        },
    ],
    'import/prefer-default-export': 0,
    import: 0,
    'func-names': 0,
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'max-len': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'react/display-name': 1,
    'react/no-array-index-key': 0,
    'react/react-in-jsx-scope': 0,
    'react/prefer-stateless-function': 0,
    'react/forbid-prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react/function-component-definition': 0,
    'jsx-a11y/accessible-emoji': 0,
    // 'jsx-a11y/label-has-associated-control': [
    //     'error',
    //     {
    //         assert: 'either',
    //     },
    // ],
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [
        1,
        {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'],
        },
    ],
    radix: 0,
    'no-shadow': [
        2,
        {
            hoist: 'all',
            allow: ['resolve', 'reject', 'done', 'next', 'err', 'error'],
        },
    ],
    quotes: [
        2,
        'single',
        {
            avoidEscape: true,
            allowTemplateLiterals: true,
        },
    ],
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': [
        'warn',
        {
            aspects: ['invalidHref'],
        },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/comma-dangle': ['off'],
    'react/jsx-props-no-spreading': 'off',
};

const prettierRules = {
    'prettier/prettier': [
        'error',
        {
            trailingComma: 'es5',
            singleQuote: true,
            printWidth: 100,
            endOfLine: 'auto',
            arrowParens: 'avoid',
            tabWidth: 4,
        },
    ],
};

module.exports = {
    extends: ['airbnb', 'prettier'],
    rules: { ...eslintRules, ...prettierRules },
    settings: { ...importResolverSettings },
    plugins: ['html', 'prettier', 'react-hooks'],
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            parser: `@typescript-eslint/parser`,
            parserOptions: {
                project: './tsconfig.json',
            },
            extends: [
                'airbnb',
                'prettier',
                'eslint:recommended',
                'plugin:import/typescript',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            plugins: ['@typescript-eslint'],
            rules: {
                'no-use-before-define': 'off',
                '@typescript-eslint/no-use-before-define': ['error'],
                'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
                ...eslintRules,
                ...prettierRules,
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': noUnusedVars,
            },
            settings: { ...importResolverSettings },
        },
    ],
};
