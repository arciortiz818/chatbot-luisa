import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import intents from '../config/intents.json';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    messageUser: '',
    chatHistory: [],
    currentIntent: '',
    currentIntentOptions: [],
    imgAgent: 'img/luisa.png'
  },
  mutations: {
    ADD_MESSAGE_HISTORY(state,payload){
      payload.messages.forEach(message => {
        state.chatHistory.push({
          id: state.chatHistory.length+1,
          author: payload.author,
          message: message,
          intent: payload.intent,
          options: payload.options
        });
      });
    },
    SET_CURRENT_INTENT(state,payload){
      state.currentIntent = payload.currentIntent;
    },
    SET_CURRENT_INTENT_OPTIONS(state,payload){
      state.currentIntentOptions = payload.options;
    }
  },
  actions: {
    sendMessage({state,dispatch,commit},requestData) {
      return new Promise((resolve,reject) => {
        let message = requestData.message;
        
        // Buscamos el nombre de la opción para mostrarlo en el historial del chat
        let tmp = state.currentIntentOptions.find(el => el.name == message);        
        if(typeof tmp !== 'undefined'){
          message = tmp.value;
        }

        // Si va a main-options mostramos como Opciones Principales
        if(message == 'main-options'){
          message = 'Opciones Principales';
        }
        
        // Si el mensaje no es el primero que sería el saludo lo agregamos al historial de la conversación
        if(requestData.message != "greetings"){          
          dispatch('setHistory',{
            author: 'user', 
            messages: [message], 
            intent: '', 
            options: []
          })   
        } 

        // Enviamos el mensaje al backend junto con la intención a la que estamos respondiendo
        dispatch('chat',{
          message: requestData.message,
          currentIntent: state.currentIntent
        }).then((rta) => {
            let responseAgent = rta.response;
            // Agregamos al historial de la conversación lo que nos dice el agente
            dispatch('setHistory',{...responseAgent,author: 'agent'});     
            
            // Seteamos la intención actual
            dispatch('setIntent',responseAgent.currentIntent);

            // Seteamos las opciones que pueda traer la intención
            dispatch('setIntentOptions',responseAgent.options);
            resolve();
          })      
          .catch((err) => {
            console.log(err);
            reject();
          });
      })
    },
    // Devuelve el historial de la conversación
    getMessages({state}){
      return state.chatHistory;
    },    
    setIntent({commit},payload){
      commit('SET_CURRENT_INTENT',{
        currentIntent: payload
      });
    },
    setIntentOptions({commit},payload){
      commit('SET_CURRENT_INTENT_OPTIONS',{
        options: payload
      });
    },
    setHistory({commit},payload){
      commit('ADD_MESSAGE_HISTORY',{
        author: payload.author, 
        messages: payload.messages, 
        intent: payload.currentIntent, 
        options: payload.options
      }); 
    },
    chat({state},payload){
      return new Promise((resolve,reject) => {
        let intent = payload.currentIntent;
        let message = payload.message;

        let currentIntent = {};
        let nextIntent = {};
        let intentIfFails = {};

        // Por defecto va la intent de saludo
        currentIntent = intents['greetings'];

        // Si se recibe una intent
        if(intent){
            // Si existe la intent recibida se asigna, si no se envia a la intent not-found
            currentIntent = intents[intent] ? intents[intent] : intents['not-found'];        
        }

        // Tomamos la siguiente intent de acuerdo a la actual siempre y cuando se haya recibido la intent
        // Cuando no tiene siguiente intent o no se recibió se asigna la actual
        nextIntent = intents[currentIntent.nextIntent] && intent ? intents[currentIntent.nextIntent] : currentIntent;

        // Asignamos la intent a la que vamos si se fallan las validaciones
        intentIfFails = intents[currentIntent.intentIfFails] ? intents[currentIntent.intentIfFails] : null;

        // Verificar links a intents
        let links = currentIntent.links;
        let intentLinked = null;  
        links.forEach(element => {
            switch (element[0]) {
                case '==':
                    if(Boolean(`\'${message}\'` == `\'${element[1]}\'`)) {
                        intentLinked = element[1]
                    }
                    break;        
                default:
                    break;
            }
        })

        // Verificar condiciones para pasar a la siguiente intent
        let conditions = currentIntent.conditions;
        let checkedConditions = true;
        conditions.forEach(element => {
            let exp = null;
            switch (element[0]) {
                case '==':
                    exp = Boolean(`\'${message}\'` == `\'${element[1]}\'`);
                    break;
                case '!=':
                    exp = Boolean(`\'${message}\'` != `\'${element[1]}\'`);
                    break;
                default:
                    break;
            }      
            if(exp === false){
                checkedConditions = false;
            }
        });
        
        if(intentLinked){
            nextIntent = intents[intentLinked];
        }
          
        let tmpMessages, tmpIntentName , tmpIntentAlias, tmpIntentOptions = '';

        // Si no cumple las condiciones de respuesta para la intent
        // o tiene links a otras intents y no se encontró link
        // se va a la intent fallida
        if(checkedConditions === false || (links.length > 0 && !intentLinked)){    
            tmpMessages = intentIfFails.responses
            tmpIntentName = intentIfFails.name
            tmpIntentAlias = intentIfFails.alias
            tmpIntentOptions = intentIfFails.options
        }else{
            // Si no falla se envian los datos de la siguiente intent
            tmpMessages = nextIntent.responses;
            tmpIntentName = nextIntent.name;
            tmpIntentAlias = nextIntent.alias;
            tmpIntentOptions = nextIntent.options
        }

        let rta = {
            success: true,
            response: {
                messages: tmpMessages,
                currentIntent: tmpIntentName,
                currentIntentAlias: tmpIntentAlias,
                options: tmpIntentOptions
            }
        }
        resolve(rta);
      })
    }
  },
  modules: {},
});
