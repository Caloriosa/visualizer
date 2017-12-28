const path = require("path");
const YAML = require('yamljs');
var merge = require('deepmerge')
var log4js = require('log4js');

var logger = log4js.getLogger("ConfigFactory");

var defaults = YAML.load(path.join(__dirname, "default.yaml"));
var config = {} 
try {
    config = YAML.load(path.join(__dirname, (process.env.NODE_ENV || "development") + ".yaml"));
} catch (err) {
    logger.warn("Can't load configuration - " + err.message);
}
config = merge(defaults, config);

logger.trace(config);

/**
 * Client configuration
 */
const clientOptions = {
    url: process.env.SERVICE_URL || config.client.url,
    proxy: config.client.proxy,
    appSignature: process.env.APP_SIGNATURE || config.client.appSignature
};

/**
 * Session configuration
 */
var sessOptions = config.session;
sessOptions.hosts = process.env.SESSION_STORE ? [process.env.SESSION_STORE] : config.session.hosts;

exports.clientOptions = clientOptions;
exports.sessOptions = sessOptions;