const env = process.env.NODE_ENV;

module.exports = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7']
        },
        modules: env === 'test' ? 'commonjs' : false
      }
    ]
  ],
  plugins: ['syntax-dynamic-import']
};
