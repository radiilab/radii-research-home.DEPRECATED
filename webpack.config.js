const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

// We need Nodes fs module to read directory contents
const fs = require('fs')

var sassExtractor= new ExtractTextPlugin({
   filename: 'main.css'
});
var styleExtractor = new ExtractTextPlugin({
    filename: 'styles.css'
})
//product charts of the education line 
var entry1 = [
    'CommingSoon',
    'reasonAI',
    'sensorEye',
    'deepLearn',
    'generalAI',
    'deviceWeb',
    'triangulatedWeb',
    //'licenseIssue'
  ];
   // Call our function on our views directory.
var entryHtmlPlugins = entry1.map(function (entryName) {
    return new HtmlWebpackPlugin({
      filename: entryName + '.html',
      template: __dirname + `/src/raw-pages/${entryName}.html`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      },
    })
  });
  
 

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        // publicPath: '/dist'     module loadding exceptions
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude:path.resolve(__dirname, "node_modules"),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: sassExtractor.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: styleExtractor.extract({
                    fallback: 'style-loader',
                    use: 'css-loader' 
                })
                
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/',
                            publicPath: 'img/'
                        }
                    }
                ]
            }
    
        ]
    },
    plugins: [
        sassExtractor,
        styleExtractor,
        new CopyWebpackPlugin([ 
            { from: 'src/img', to: 'images',toType:"dir", force: true },
            { from: 'src/sitemap.xml', to: 'sitemap.xml', toType:"file", force: true },
        ]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: true
              },
        }),
        new CleanWebpackPlugin(['dist'])
    ].concat(entryHtmlPlugins)
};