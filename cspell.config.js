const os = require('os');

module.exports = {
  version: '0.2',
  language: 'en-GB',
  dictionaries: [
    'typescript',
    'python',
    'node',
    'npm',
    'html',
    'css',
    'development'
  ],
  dictionaryDefinitions: [
    {
      name: 'development',
      path: `${os.homedir()}\\.dictionaries\\development.txt`
    }
  ],
  files: [
    '**/*.md'
  ],
  ignorePaths: [
    '.git',
    'node_modules',
    'pnpm-lock.yaml'
  ]
};
