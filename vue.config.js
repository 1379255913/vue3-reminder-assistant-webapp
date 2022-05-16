module.exports = {
  // css: {
  //     loaderOptions: {
  //         postcss: {
  //             plugins: [
  //                 postcss
  //             ]
  //         }
  //     }
  // },
  publicPath: "./",
  lintOnSave: false,

  devServer: {

    // overlay:{
    //   warning: false,
    //   errors:false
    // },
    proxy: {
      '/api': {
        target: 'http://k38j348217.zicp.vip',
        changeOrigin: true,
        secure: false,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }

  },
  configureWebpack:{
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        },
      ]
    }
  }
}