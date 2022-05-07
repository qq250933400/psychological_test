const path = require("path");

const getCommand = require("elmer-common/lib/utils/index").getCommand;
const DefinePlugin = require("webpack").DefinePlugin;
module.exports = function override(config, env) {
    //do stuff with the webpack config...
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
            }
        }
    };
};
