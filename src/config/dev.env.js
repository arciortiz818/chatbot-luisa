const merge = require("webpack-merge");

const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_APIKEY: '"5f6ca6d59d8e240a4c39968a"',
  VUE_APP_URL_API_CHAT_LOG:
    '"http://localhost:5000/chatbot-luisa/us-central1/chatbot/api/chat/log"',
  VUE_APP_URL_API_EMAIL_SEND:
    '"http://localhost:5000/chatbot-luisa/us-central1/chatbot/api/email/send"',
});
