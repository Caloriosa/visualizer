const { Client, UserService } = require("@caloriosa/rest-dto");
const log4js = require("log4js");

var logger = log4js.getLogger("Middleware");

function clientHandle (data, response, err) {
    apiLogger = log4js.getLogger("API<Response>");
    if (err) {
        apiLogger.error(err.message);
        return;
    }
    apiLogger.info(`${response.responseUrl} - ${response.statusCode} ${data.status.code}: "${data.status.message}" (${response.req.method})`);
}

function createClient(clientOptions = {}, token = null) {
    let opts = Object.assign(clientOptions, {token: token});
    let client = new Client(opts);
    client.on('handle', clientHandle);
    return client;
}

exports.isAuthenticated = function isAuthenticated(req, res, next ){
    if (!res.locals.loggedUser) {
        req.session.backlink = req.originalUrl;
        res.redirect("/sign/in");
        return;
    }
    next();
}

exports.caloriosa = function caloriosa(clientOptions = {}) {
    return (req, res, next) => {
        req.client = createClient(clientOptions, req.session.token || null);
        if (!req.session.token) {
            logger.debug("No token aquired - User unlogged.");
            next();
            return;
        }
        logger.debug("Token aquired - User logged.");
        let userService = new UserService(req.client);
        userService.fetchMe().then(user => {
            res.locals.loggedUser = user;
            logger.trace(user);
            next();
        }).catch(err => next(err.message));
    }
}

exports.renderOverhead = function renderOverhead(req, res, next) {
    var render = res.render;
    res.render = (view, options, fn) => {
      options = Object.assign(options || {}, {flash: req.flash()});
      render.call(res, view, options, fn);
    }
    next();
}