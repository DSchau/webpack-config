export default function developmentConfig() {
  return {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
}
