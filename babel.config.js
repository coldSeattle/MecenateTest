module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@shared': './src/shared',
            '@entities': './src/entities',
            '@features': './src/features',
            '@widgets': './src/widgets',
            '@pages': './src/pages',
            '@app-layer': './src/app-layer',
          },
        },
      ],
    ],
  };
};
