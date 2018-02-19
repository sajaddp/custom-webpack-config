const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');
const Notifier = require('./setup/plugins/Notifier');
const Manifest =  require('./setup/plugins/Manifest');


// conditions
const StatusProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry : {
        app : './src/app.js',
        main : './src/main.js'
    },
    output : {
        filename : `[name]${ StatusProduction ? '.[chunkhash]' : '' }.js`,
        path : path.resolve(__dirname  , 'dist')
    },
    module : {
        rules : [
            {
                test : /\.js$/,
                enforce : 'pre',
                exclude : /node_modules/,
                use : {
                    loader : 'jshint-loader',
                    options : {
                        esversion: 6
                    }
                }
            },
            {
                test : /\.s[ac]ss$/,
                use : ExtractTextPlugin.extract({
                    fallback : 'style-loader',
                    use : [{
                            loader : 'css-loader',
                            options : {
                                sourceMap : true
                            }
                        }  , 'sass-loader']
                })
            },
            {
                test : /\.css$/,
                use : ExtractTextPlugin.extract({
                    fallback : 'style-loader',
                    use : [{
                        loader : 'css-loader',
                        options : {
                            sourceMap : true
                        }
                    }]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use : {
                    loader: "babel-loader",
                    options : {
                        "presets": ["es2015"]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name : 'images/[name].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            enabled: StatusProduction
                        }
                    }
                ]
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name : 'fonts/[name].[hash].[ext]'
                }
            }
        ]
    },
    plugins : [
        new ExtractTextPlugin(`[name]${ StatusProduction ? '.[chunkhash]' : '' }.css`),
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false,
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'index.html')),
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: StatusProduction,
        }),
        new Notifier(),
        new Manifest()
    ]
}

if(StatusProduction) {
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin())
}