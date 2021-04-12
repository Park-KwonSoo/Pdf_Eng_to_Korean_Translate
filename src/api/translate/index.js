const Router = require("koa-router");
const translateCtrl = require('./translate.ctrl');

const translate = new Router();

translate.get('/papago', translateCtrl.translate);

module.exports = translate;