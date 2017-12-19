const path = require("path");
var log4js = require('log4js');

var logger = log4js.getLogger("ConfigFactory");

/**
 * Client configuration
 */
const clientOptions = {
    url: process.env.SERVICE_URL || "http://localhost:6060"
};

/**
 * Sass configuration
 */
const sassOptions = {
    /* Options */
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
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
var sessOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
    };

if (process.env.SESSION_STORE) {
    // Init memcached session store if host defined by environment
    logger.info("Using memcached session store: " + process.env.SESSION_STORE);
    sessOptions.store = new MemcachedStore({hosts: [process.env.SESSION_STORE]});
}

logger.info("Service URL: " + clientOptions.url);

exports.clientOptions = clientOptions;
exports.sassOptions = sassOptions;
exports.sessOptions = sessOptions;