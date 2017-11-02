const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = require("./config");
let HTMLPlugins = [];
let Entries = {}

// 生成多页面的集合
config.HTMLDirs.forEach((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `../app/html/${page}.html`),
        chunks: [page, 'commons'],
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `../app/js/${page}.js`);
})

module.exports = {
    entry: Entries,
    devtool: "cheap-module-source-map",
    output: {
        filename: "js/[name].bundle.[hash].js",
        path: path.resolve(__dirname, "../dist")
    },
    // 加载器
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    publicPath: config.cssPublicPath,
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true,
                        }
                    },
                    {
                        loader: "postcss-loader",
                    }
                    ]
                })
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: "stylus-loader",
                    publicPath: config.cssPublicPath,
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true,
                        }
                    },
                    {
                        loader: "postcss-loader",
                    }, {
                        loader: "stylus-loader"
                    }
                    ]
                })
             },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        // 打包生成图片的名字
                        name: "[name].[ext]",
                        // 图片的生成路径
                        outputPath: config.imgOutputPath
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader"]
            }
        ],
    },
    plugins: [
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(["dist"]),
        // 将 css 抽取到某个文件夹
        new ExtractTextPlugin(config.cssOutputPath),
        // 自动生成 HTML 插件
        ...HTMLPlugins
    ],
}
