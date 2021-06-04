<template>
  <b-container class="mt-5">
    <b-row>
      <b-col></b-col>
      <b-col cols="9">
        <b-card
          border-variant="primary"
          header-bg-variant="primary"
          header-text-variant="white"
          style="height: 80vh"
        >
          <template #header>
            <b-list-group-item class="p-0" style="background: none; border: none;">
              <b-avatar variant="light" :src="imgAgent" class="mr-3" size="5rem"></b-avatar>
              <span class="title-card">Luisa, tu asesor virtual</span>
            </b-list-group-item>
          </template>
          <template #footer>
            <b-input-group>
              <b-form-input v-model="message" size="sm" placeholder="Escribe un mensaje" @keypress.enter="send()"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" size="sm" @click="send">
                <b-icon icon="box-arrow-right"></b-icon>
              </b-button>
            </b-input-group-append>
            </b-input-group>
          </template>
          <b-card-text style="overflow-y: auto; height: 100%;" id="box-messages">
            <router-view/>
          </b-card-text>          
        </b-card>
        
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>
<script>
import {mapState,mapActions} from 'vuex';
export default {
  components: {
  },
  data(){
    return {
      
      message: ''
    }
  },  
  computed: {
    ...mapState(["imgAgent","chatHistory"])
  },
  methods: {
    ...mapActions(["sendMessage"]),   
    send(){
      if(this.message != ""){
        this.sendMessage({
          message: this.message
        }).then(()=>{
          this.message = "";          
        })
        
      }
    }
  }
}
</script>
<style>
  *{
    /* color: #212529; */
    font-size: 1rem;
  }

  .title-card{
    font-size: 1.2rem;
    font-weight: 600;
  }

  .card-header{
    background-color: #337BBE !important;    
  }

  .card-footer{
    background-color: #337BBE !important;   
  }

  .card{
    border-color: #337BBE !important;
  }

  .card-body{
    padding: 0.5rem !important;
    background-color: #77c6eb2a !important;
  }

  .container-bubble-agent{
    border: none; 
    background-color: #77c6eb00 !important;
    opacity: 100%;
  }

  .container-bubble-user{
    border: none; 
    background-color: #77c6eb00 !important;
    opacity: 100%;
  }

  .bubble-agent{
    background-color:#337BBE;
    color: #fcfcfc;
    font-weight: 400;
    border-top-right-radius: 2px !important;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 10px;
    border-radius: 20px !important;
    border-top-left-radius: 2px !important;
  }

  .bubble-user{
    background-color:#cccccc;  
    color: black;
    border-top-right-radius: 2px !important;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 10px;
    border-radius: 20px !important;
    border-top-right-radius: 2px !important;
  }

  .btn-message{
    background-color: #4ab3e4;
    color: black;
    border: solid 2px white;
  }

  .btn-message:hover{
    background-color: #4ab3e4;
    color: white;
    font-weight: 500;
    border: solid 2px white;
  }

  #box-messages{
    padding-bottom: 1rem;
  }

</style>
