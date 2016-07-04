module.exports = {
  entry: "./aco.js",
  output: {
    path: "./build",
    publicPath: "/build/",
    filename: "build.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.html$/, loader: "html" },
      { test: /\.vue$/, loader: "vue" }
    ]
  },
  devtool: 'source-map'
};