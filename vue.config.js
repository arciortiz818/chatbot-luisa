// const path = require('path');

module.exports = {
  transpileDependencies: ["vuetify"],
  // para deploy en github-pages
  publicPath: process.env.NODE_ENV === "production" ? "/dev-luisa/" : "/",
};
