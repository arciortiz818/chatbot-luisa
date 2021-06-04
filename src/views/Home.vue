<template>
  <b-container>
    <b-col v-for="item in chatHistory" :key="item.id" class="px-0">

      <!-- Mensaje del usuario -->
      <message-user v-if="item.author == 'user'" :text="item.message"></message-user>

      <!-- Mensaje de agente -->
      <message-agent v-if="item.author == 'agent'" :text="item.message" :intent="item.intent" > 
        
        <!-- slot de autorización datos -->
        <template v-slot:personal-data>          
          <b-row class="mx-3 mt-3 justify-content-center">
            <b-button class="mr-2 btn-message" @click="sendRta('si')" :disabled="item.id < chatHistory.length">Si</b-button> 
            <b-button class="btn-message" @click="sendRta('no')" :disabled="item.id < chatHistory.length">No</b-button>
          </b-row>
        </template>

        <!-- slot para opciones principales -->
        <template v-slot:main-options>          
          <b-row class="mt-3" v-for="option in item.options" :key="option.name" >
            <b-button block class="btn-message mx-4" @click="sendRta(option.name)" :disabled="item.id < chatHistory.length">{{option.value}}</b-button>             
          </b-row>
        </template>

        <!-- slot para opción de citas médicas -->
        <template v-slot:cit-med>          
          <b-row class="mx-3 mt-2 justify-content-center" >
            <b-form @submit="onSubmitCitMed" class="col-10">
              <b-form-input class="mb-2" size="sm" v-model="formCitMed.docIdentidad" id="form1-input1" placeholder="Documento Identidad" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-input class="mb-2" size="sm" v-model="formCitMed.telefono" id="form1-input2" placeholder="Teléfono o Celular" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-input class="mb-2" size="sm" v-model="formCitMed.email" id="form1-input3" placeholder="Email" type="email" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-select class="mb-2" size="sm" v-model="formCitMed.servicioCita" id="form1-input4" placeholder="Seleccione" required :options="[{text: 'Seleccione...', value: null},'ECOGRAFIA','CONSULTA EXTERNA','SERVICIOS AMBULATORIOS']" :disabled="item.id < chatHistory.length"></b-form-select>
              <b-form-input class="mb-2" size="sm" v-model="formCitMed.ipsRemite" id="form1-input5" placeholder="IPS que remite" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-row>
                <b-col>
                  <b-button class="btn-message" type="submit" block variant="light" :disabled="item.id < chatHistory.length">Enviar</b-button>
                </b-col>
                <b-col>
                  <b-button class="btn-message col"  block variant="light" @click="sendRta('main-options')" :disabled="item.id < chatHistory.length">Cancelar</b-button>
                </b-col>
              </b-row>
            </b-form>          
          </b-row>
        </template>

        <!-- slot para opción de vacunas-covid -->
        <template v-slot:vac-cov>          
          <b-row class="mx-3 mt-2 justify-content-center">
            <b-form @submit="onSubmitVacCov" class="col-10">
              <b-form-input class="mb-2" size="sm" v-model="formVacCov.docIdentidad" id="form2-input1" placeholder="Documento Identidad" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-input class="mb-2" size="sm" v-model="formVacCov.telefono" id="form2-input2" placeholder="Teléfono o Celular" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-input class="mb-2" size="sm" v-model="formVacCov.email" id="form2-input3" placeholder="Email" type="email" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-button class="btn-message" block variant="primary" @click="sendRta('main-options')" :disabled="item.id < chatHistory.length">Cancelar</b-button>
            </b-form> 
          </b-row>
        </template>

        <!-- slot para opción de cirugías y preanestesia -->
        <template v-slot:cir-pre>          
          <b-row class="mx-3 mt-2 justify-content-center">
            <b-form @submit="onSubmitCirPre" class="col-10">
              <b-form-input class="mb-2" size="sm" v-model="formCirPre.docIdentidad" id="form3-input1" placeholder="Documento Identidad" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-input class="mb-2" size="sm" v-model="formCirPre.telefono" id="form3-input2" placeholder="Teléfono o Celular" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-form-input class="mb-2" size="sm" v-model="formCirPre.email" id="form3-input3" placeholder="Email" type="email" required :disabled="item.id < chatHistory.length"></b-form-input>
              <b-button class="btn-message" block variant="primary" @click="sendRta('main-options')" :disabled="item.id < chatHistory.length">Cancelar</b-button>
            </b-form> 
          </b-row>
        </template>
      </message-agent>
    </b-col>
  </b-container>
</template>

<script>
// @ is an alias to /src
import {mapState,mapActions} from 'vuex';
import MessageUser from '@/components/MessageUser.vue';
import MessageAgent from '@/components/MessageAgent.vue';

export default {
  name: "Home",
  components: {
    MessageUser,
    MessageAgent,
  },
  data(){
    return {
      messageUser: '',
      formCitMed: {
        docIdentidad: '',
        telefono: '',
        email: '',
        servicioCita: null,
        ipsRemite: ''
      },
      formVacCov: {
        docIdentidad: '',
        telefono: '',
        email: '',
      },
      formCirPre: {
        docIdentidad: '',
        telefono: '',
        email: '',
      }
    }
  },
  updated(){
    if (document.getElementById("box-messages")) {
      const scroll = document.getElementById("box-messages").scrollTop;
      document.getElementById("box-messages").scrollTop = scroll + 1000;
    }
  },
  computed: {
    ...mapState(['chatHistory','currentIntent'])
  },
  mounted(){
    //Enviamos mensaje para indicar que inicia
    this.sendMessage({message: 'greetings'});
  },
  methods: {
    ...mapActions(["sendMessage"]),   
    sendRta(rta){
      this.sendMessage({message: rta});
    },
    onSubmitCitMed(event){
      event.preventDefault();
      console.log(this.formCitMed)
    },
    onSubmitVacCov(event){
      event.preventDefault();
      console.log(this.formVacCobv)
    },
    onSubmitCirPre(event){
      event.preventDefault();
      console.log(this.formCirPre)
    }
  }
};
</script>

<style>

</style>
