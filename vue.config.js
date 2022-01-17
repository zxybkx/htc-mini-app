const webpack = require('webpack')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(args => {
        args[0]['process.env'].OS_ENV = 'OS_ENV';
        return args
      })
  }
}