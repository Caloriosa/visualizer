const { Client, UserService } = require("@caloriosa/rest-dto");

function clientHandle (data, response) {
    apiLogger = log4js.getLogger("API-call");
    apiLogger.info(`${response.req.method} ${response.responseUrl} - ${response.statusCode} ${data.status.code} "${data.status.message}"`);
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
            next();
            return;
        }
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