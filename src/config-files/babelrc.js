const env = process.env.NODE_ENV;

module.exports = {
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['>0.25%', 'not ie 11', 'not op_mini all'] // https://jamie.build/last-2-versions
        },
        modules: env === 'test' ? 'commonjs' : false
      }
    ]
  ],
  plugins: ['syntax-dynamic-import']
};
