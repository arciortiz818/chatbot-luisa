const merge = require("webpack-merge");

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',
});
