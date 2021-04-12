const Router = require("koa-router");
const translate = require('./translate')

const api = new Router();

api.use('/translate', translate.routes());

module.exports = api;
