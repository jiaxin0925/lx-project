export default {
  treeShaking: true,
  cssLoaderOptions:{
    localIdentName:'[local]'
  },
  history: 'hash',
  hash: true,
  targets: {
    ie: 11,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'DPC-DATA-MANAGEMENT-PORTAL',
      dll: false,
      locale: {
        enable: true,
        baseNavigator: true,
        default: 'en-US',
      },

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
