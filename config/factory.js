const path = require("path");
const YAML = require('yamljs');
var log4js = require('log4js');

var logger = log4js.getLogger("ConfigFactory");

var defaults = YAML.load(path.join(__dirname, "default.yaml"));
var config = {} 
try {
    config = YAML.load(path.join(__dirname, (process.env.NODE_ENV || "development") + ".yaml"));
} catch (err) {
    logger.warn("Can't load configuration - " + err.message);
}
config = Object.assign(defaults, config);

/**
 * Client configuration
 */
const clientOptions = {
    url: process.env.SERVICE_URL || config.client.url,
    proxy: config.client.proxy,
    appSignature: process.env.APP_SIGNATURE || config.client.appSignature
};

/**
 * Sass configuration
 */
const sassOptions = {
    /* Options */
    src: path.join(__dirname, "../public"),
    dest: path.join(__dirname, '../public'),
    debug: config.sass.debug,
    outputStyle: config.sass.outputStyle,
    error: (err) => {
        let _logger = log4js.getLogger("SassCompiler")
        _logger.error(err);
    },
    log: (severity, key, value) => {
        let _logger = log4js.getLogger("SassCompiler")
        _logger.debug(`${severity} ${key} ${value}`);
    }
}

/**
 * Session configuration
 */
var sessOptions = config.session;
sessOptions.hosts = process.env.SESSION_STORE ? [process.env.SESSION_STORE] : config.session.hosts;

exports.clientOptions = clientOptions;
exports.sassOptions = sassOptions;
exports.sessOptions = sessOptions;