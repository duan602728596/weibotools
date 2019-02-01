import path from 'path';
import process from 'process';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

export default {
  frame: 'vue',
  dll: [
    'vue/dist/vue',
    'vue-router/dist/vue-router',
    'vuex/dist/vuex'
  ],
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  rules: [
    {
      test: /(dll\.js|gt\.min\.js)/,
      use: [{
        loader: 'file-loader',
        options: {
          name: isDevelopment ? '[name].[ext]' : '[hash:5].[ext]',
          outputPath: 'script/'
        }
      }]
    }
  ],
  js: {
    ecmascript: true,
    plugins: [['import', { libraryName: 'iview', libraryDirectory: 'src/components' }]],
    exclude: /(dll\.js|gt\.min\.js|node_modules)/
  },
  sass: {
    include: /src/,
    publicPath: '../'
  },
  css: {
    modules: false,
    modifyVars: {
      // https://github.com/iview/iview/blob/3.x/src/styles/custom.less
      '@primary-color': '#9254de'
    },
    include: /node_modules[\\/]_?iview/,
    publicPath: '../'
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
};