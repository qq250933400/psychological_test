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
        ]
    };
};
