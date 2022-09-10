const path = require("path");

const getCommand = require("elmer-common/lib/utils/index").getCommand;
const DefinePlugin = require("webpack").DefinePlugin;
module.exports = function override(config, env) {
    //do stuff with the webpack config...
    const NODE_ENV = process.env.NODE_ENV;
    const envValue = getCommand(process.argv, "ENV");
    return {
        ...config,
        plugins: [
            ...config.plugins,
            new DefinePlugin({
                ENV: JSON.stringify(envValue)
            })
        ],
        resolve: {
            ...config.resolve,
            alias: {
                ...(config.resolve?.alias || {}),
                "@HOC": path.resolve(process.cwd(), "./src/HOC"),
                "@HOC/*": path.resolve(process.cwd(), "./src/HOC/*"),
                "@components": path.resolve(process.cwd(), "./src/components"),
                "@components/*": path.resolve(process.cwd(), "./src/components/*"),
                "@": path.resolve(process.cwd(), "./src"),
                "@/*": path.resolve(process.cwd(), "./src/*"),
            }
        },
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.map$/,
                    loader: "url-loader"
                },
                { test:/\.css$/,use:['style-loader','css-loader'] }
            ]
        },
        output: {
            ...config.output,
            publicPath: NODE_ENV === "development" ? "/" : "./"
        }
    };
};
