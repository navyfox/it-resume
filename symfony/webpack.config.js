var Encore = require('@symfony/webpack-encore');

Encore
  // the project directory where compiled assets will be stored
  .setOutputPath('public/build/')
  // the public path used by the web server to access the previous directory
  .setPublicPath('/build')
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .addEntry('index', './assets/js/index.js')
  .enableReactPreset()
    .configureBabel(function(babelConfig) {
        babelConfig.plugins = ["transform-object-rest-spread","transform-class-properties"]
    });

module.exports = Encore.getWebpackConfig();
