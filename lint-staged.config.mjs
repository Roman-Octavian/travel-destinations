export default {
  '**/*': 'prettier --write --ignore-unknown',
  'client/*.ts?(x)': () => 'npm run types -w client',
  'server/*.ts?(x)': () => 'npm run types -w server',
  'packages/**/*.ts?(x)': () => 'npm run types',
};
