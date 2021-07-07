<template>
  <b-container fluid="lg">
    <b-row>
      <b-col></b-col>
      <b-col cols="12" sm="12" md="12" lg="7" xl="6" class="p-0 m-0">
        <b-card
          border-variant="primary"
          header-bg-variant="primary"
          header-text-variant="white"
          style="height: 93vh;"
          class="m-0 p-0"
        >
          <template #header>
            <b-list-group-item
              class="p-0 container-header"
              style="background: none; border: none;"
            >
              <b-avatar
                variant="light"
                :src="imgAgent"
                class="mr-3"
                size="4rem"
              ></b-avatar>
              <span class="title-card">Luisa, tu asesor virtual</span>
            </b-list-group-item>
          </template>
          <template #footer>
            <b-input-group>
              <b-form-input
                v-model="message"
                placeholder="Escribe un mensaje"
                @keypress.enter="send()"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  @click="send"
                  style="color: #2b6095; font-weight: 600; background-color: white; border: none"
                >
                  <b-icon icon="box-arrow-right"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </template>
          <b-card-text
            style="overflow-y: auto; height: 100%;"
            class="px-0"
            id="box-messages"
          >
            <router-view />
          </b-card-text>
        </b-card>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      message: "",
    };
  },
  computed: {
    ...mapState(["imgAgent", "chatHistory"]),
  },
  methods: {
    ...mapActions(["sendMessage"]),
    send() {
      if (this.message != "") {
        this.sendMessage({
          message: this.message,
        }).then(() => {
          this.message = "";
        });
      }
    },
  },
};
</script>
<style>
.title-card {
  font-size: 1.3rem;
  font-weight: 600;
}

.card-header {
  background-color: #337bbe !important;
  height: 10%;
  margin-bottom: 10px;
}

.container-header img {
  border: solid 1px white !important;
}

.card-footer {
  background-color: #337bbe !important;
}

.card {
  border-color: #337bbe !important;
}

.card-body {
  padding: 0px !important;
  background-color: white !important;
}

.container-bubble-agent {
  border: none;
  background-color: #77c6eb00 !important;
}

.container-bubble-agent img {
  border: solid 1px #337bbe !important;
}

.container-bubble-user {
  border: none;
  background-color: #77c6eb00 !important;
}

.container-bubble-user img {
  border: solid 3px #337bbe !important;
}

.bubble-agent {
  /* background-color:#337BBE; */
  color: #367abd;
  font-weight: 500;
  font-size: 0.9rem;
  border-top-right-radius: 2px !important;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px;
  border-radius: 20px !important;
  border-top-left-radius: 2px !important;
  box-shadow: 2px 2px 3px 1px gray;
  border: none;
}

.bubble-user {
  background-color: #d3f3ff;
  color: #367abd;
  font-weight: 500;
  font-size: 0.9rem;
  border-top-right-radius: 2px !important;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px;
  border-radius: 20px !important;
  border-top-right-radius: 2px !important;
  box-shadow: 2px 2px 3px 1px gray;
  border-color: none;
}

.btn-message {
  background-color: #367abd;
  color: white;
  font-weight: 500;
  border: solid 2px #4ab3e4;
}

.btn-message:hover {
  background-color: #2b6095;
  color: azure;
  /* font-weight: 500; */
  border: solid 2px #4ab3e4;
}

#box-messages {
  padding-bottom: 1.2rem;
}
</style>
