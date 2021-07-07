import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import intents from "../config/intents.json";
import { storage } from "../firebase";
const ref = storage.ref();

Vue.use(Vuex);
console.log(process.env.VUE_APP_URL_API_CHAT_LOG);
export default new Vuex.Store({
  state: {
    messageUser: "",
    chatHistory: [],
    currentIntent: "",
    currentIntentAlias: "",
    currentIntentOptions: [],
    imgAgent: "img/luisa.png",
  },
  mutations: {
    ADD_MESSAGE_HISTORY(state, payload) {
      payload.messages.forEach((message) => {
        state.chatHistory.push({
          id: state.chatHistory.length + 1,
          author: payload.author,
          message: message,
          intent: payload.intent,
          options: payload.options,
        });
      });
    },
    SET_CURRENT_INTENT(state, payload) {
      state.currentIntent = payload.currentIntent;
      state.currentIntentAlias = payload.currentIntentAlias;
    },
    SET_CURRENT_INTENT_OPTIONS(state, payload) {
      state.currentIntentOptions = payload.options;
    },
  },
  actions: {
    // Este es el metodo que se usa para responder a una intent
    sendMessage({ state, dispatch, commit }, requestData) {
      return new Promise((resolve, reject) => {
        let message = requestData.message;

        // Buscamos el nombre de la opción para mostrarlo en el historial del chat
        let tmp = state.currentIntentOptions.find((el) => el.name == message);
        if (typeof tmp !== "undefined") {
          message = tmp.value;
        }

        // Si va a main-options mostramos como Opciones Principales
        if (message == "main-options") {
          message = "Opciones Principales";
        }

        // Si el mensaje no es el primero que sería el saludo lo agregamos al historial de la conversación
        if (
          message != "greetings" &&
          message != "citas-medicas-request-send" &&
          message != "vacunacion-covid-request-send" &&
          message != "cirugia-preanestesia-request-send"
        ) {
          dispatch("setHistory", {
            author: "user",
            messages: [message],
            intent: "",
            options: [],
          });
        }

        // Enviamos el mensaje al backend junto con la intención a la que estamos respondiendo
        dispatch("chat", {
          message: requestData.message,
          currentIntent: state.currentIntent,
        })
          .then((rta) => {
            let responseAgent = rta.response;
            // Agregamos al historial de la conversación lo que nos dice el agente
            dispatch("setHistory", { ...responseAgent, author: "agent" });

            // Seteamos la intención actual
            dispatch("setIntent", {
              currentIntent: responseAgent.currentIntent,
              currentIntentAlias: responseAgent.currentIntentAlias,
            });

            //Registramos en el Backend el log del chat enviando la intent
            if (responseAgent.registerLog === true) {
              axios.post(process.env.VUE_APP_URL_API_CHAT_LOG, {
                apiKey: process.env.VUE_APP_APIKEY,
                intent: responseAgent.currentIntent,
                intentAlias: responseAgent.currentIntentAlias,
                appId: 1,
              });
            }

            // Seteamos las opciones que pueda traer la intención
            dispatch("setIntentOptions", responseAgent.options);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      });
    },
    // Devuelve el historial de la conversación
    getMessages({ state }) {
      return state.chatHistory;
    },
    setIntent({ commit }, payload) {
      commit("SET_CURRENT_INTENT", {
        currentIntent: payload.currentIntent,
        currentIntentAlias: payload.currentIntentAlias,
      });
    },
    setIntentOptions({ commit }, payload) {
      commit("SET_CURRENT_INTENT_OPTIONS", {
        options: payload,
      });
    },
    setHistory({ commit }, payload) {
      commit("ADD_MESSAGE_HISTORY", {
        author: payload.author,
        messages: payload.messages,
        intent: payload.currentIntent,
        options: payload.options,
      });
    },
    chat({ state }, payload) {
      return new Promise((resolve, reject) => {
        let intent = payload.currentIntent;
        let message = payload.message;

        let currentIntent = {};
        let nextIntent = {};
        let intentIfFails = {};

        // Por defecto va la intent de saludo
        currentIntent = intents["greetings"];

        // Si se recibe una intent
        if (intent) {
          // Si existe la intent recibida se asigna, si no se envia a la intent not-found
          currentIntent = intents[intent]
            ? intents[intent]
            : intents["not-found"];
        }

        // Tomamos la siguiente intent de acuerdo a la actual siempre y cuando se haya recibido la intent
        // Cuando no tiene siguiente intent o no se recibió se asigna la actual
        nextIntent =
          intents[currentIntent.nextIntent] && intent
            ? intents[currentIntent.nextIntent]
            : currentIntent;

        // Asignamos la intent a la que vamos si se fallan las validaciones
        intentIfFails = intents[currentIntent.intentIfFails]
          ? intents[currentIntent.intentIfFails]
          : null;

        // Verificar links a intents
        let links = currentIntent.links;
        let intentLinked = null;
        links.forEach((element) => {
          switch (element[0]) {
            case "==":
              if (Boolean(`\'${message}\'` == `\'${element[1]}\'`)) {
                intentLinked = element[1];
              }
              break;
            default:
              break;
          }
        });

        // Verificar condiciones para pasar a la siguiente intent
        let conditions = currentIntent.conditions;
        let checkedConditions = true;
        conditions.forEach((element) => {
          let exp = null;
          switch (element[0]) {
            case "==":
              exp = Boolean(`\'${message}\'` == `\'${element[1]}\'`);
              break;
            case "!=":
              exp = Boolean(`\'${message}\'` != `\'${element[1]}\'`);
              break;
            default:
              break;
          }
          if (exp === false) {
            checkedConditions = false;
          }
        });

        if (intentLinked) {
          nextIntent = intents[intentLinked];
        }

        let tmpMessages,
          tmpIntentName,
          tmpIntentAlias,
          tmpIntentOptions,
          tmpRegisterLog = "";

        // Si no cumple las condiciones de respuesta para la intent
        // o tiene links a otras intents y no se encontró link
        // se va a la intent fallida
        if (
          checkedConditions === false ||
          (links.length > 0 && !intentLinked)
        ) {
          tmpMessages = intentIfFails.responses;
          tmpIntentName = intentIfFails.name;
          tmpIntentAlias = intentIfFails.alias;
          tmpIntentOptions = intentIfFails.options;
          tmpRegisterLog = intentIfFails.registerLog;
        } else {
          // Si no falla se envian los datos de la siguiente intent
          tmpMessages = nextIntent.responses;
          tmpIntentName = nextIntent.name;
          tmpIntentAlias = nextIntent.alias;
          tmpIntentOptions = nextIntent.options;
          tmpRegisterLog = nextIntent.registerLog;
        }

        let rta = {
          success: true,
          response: {
            messages: tmpMessages,
            currentIntent: tmpIntentName,
            currentIntentAlias: tmpIntentAlias,
            options: tmpIntentOptions,
            registerLog: tmpRegisterLog,
          },
        };
        resolve(rta);
      });
    },
    async sendEmail({ state, commit, dispatch }, data) {
      dispatch("setHistory", {
        author: "agent",
        messages: ["Un momento, estamos procesando sus datos."],
        intent: state.currentIntent,
        options: [],
      });
      let filesAttached = [];
      if (data.docIdentidad && data.docIdentidad !== "") {
        filesAttached = await dispatch("attachFiles", {
          docIdentidad: data.docIdentidad,
          files: data.files,
        });
      }
      const dataEmail = {
        apiKey: process.env.VUE_APP_APIKEY,
        subject: data.subject,
        to: data.to,
        message: data.message,
        intent: state.currentIntent,
        intentAlias: state.currentIntentAlias,
        appId: 1,
        attached: filesAttached,
      };

      axios
        .post(process.env.VUE_APP_URL_API_EMAIL_SEND, dataEmail)
        .then((res) => {
          dispatch("sendMessage", {
            message: state.currentIntent + "-request-send",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async attachFiles({ state }, payload) {
      if (payload.docIdentidad == "") {
        return [];
      }
      let docIdentidad = payload.docIdentidad;
      let files = payload.files;

      let promise1 = new Promise((resolve, reject) => {
        const file = files[0];
        const refFile = ref.child(`ordMedica_${docIdentidad}.pdf`);
        refFile
          .put(file)
          .then((rta) => {
            resolve(true);
          })
          .catch((error) => reject(error));
      });

      let promise2 = new Promise((resolve, reject) => {
        const file = files[1];
        const refFile = ref.child(`autEps_${docIdentidad}.pdf`);
        refFile
          .put(file)
          .then((rta) => {
            resolve(true);
          })
          .catch((error) => reject(error));
      });

      let promise3 = new Promise((resolve, reject) => {
        const file1 = files[2];
        const refFile = ref.child(`histClinica_${docIdentidad}.pdf`);
        refFile
          .put(file1)
          .then((rta) => {
            resolve(true);
          })
          .catch((error) => reject(error));
      });
      let items = await Promise.all([promise1, promise2, promise3]).then(
        (rta) => {
          return [
            {
              path: `ordMedica_${docIdentidad}.pdf`,
              name: `ordMedica_${docIdentidad}.pdf`,
            },
            {
              path: `autEps_${docIdentidad}.pdf`,
              name: `autEps_${docIdentidad}.pdf`,
            },
            {
              path: `histClinica_${docIdentidad}.pdf`,
              name: `histClinica_${docIdentidad}.pdf`,
            },
          ];
        }
      );
      return items;
    },
  },
  modules: {},
});
