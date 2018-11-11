const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const Webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

const config = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    // make sure to include the plugin for the magic
    // 1.给webpack编译过程中或写的js中可以调用判断环境，2.可以根据不用环境的进行打包（开发环境有错误提醒，正式环境
    // 不需要错误信息）
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name]-aaa.[ext]'
            }
          }
        ]
      }
    ]
  }
}

if (isDev) {
  // devTool功能是直接调试浏览器代码都是编译的，看不懂，可以使用sourecemap进行映射，可以看到我们自己写的代码，调试方便
  config.devtool = '#cheap-module-eval-source-map',
  // devServer是在webpack2以后加入的，把所有配置写在了这里面
  config.devServer = {
    port: 8000, // 端口
    host: '0.0.0.0', // 可以用过内网ip访问，也可以通过127.0.0.1
    overlay: {   // 在webpack编译过程有任何的错误可以显示在网页上
      errors: true,
    },
    // open: true,  // 可以帮我们自动打开浏览器
    // historyFallback: {   // 单页应用会做许多前端路由，前端路由的时候我们请求的地址不一定是默认的index.html，可以帮我们
    // },                    // 把webpack不理解的地址全部映射到index.html上
    hot: true        // 热加载功能,需加载config.plugin.push()配置
  }
  config.plugins.push(
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = config