<template>
  <div>
    <b-list-group-item
      class="d-flex justify-content-start align-items-start px-0 py-1 container-bubble-agent"
    >
      <b-avatar
        variant="light"
        :src="imgAgent"
        class="mr-2"
        size="3.5rem"
      ></b-avatar>
      <b-list-group-item
        class="justify-content-start text-justify bubble-agent"
      >
        {{ text }}
        <slot name="personal-data" v-if="intent == 'personal-data'"></slot>
        <slot name="main-options" v-if="intent == 'main-options'"></slot>
        <slot name="request-send" v-if="intent == 'request-send'"></slot>
        <slot name="citas-medicas" v-if="intent == 'citas-medicas'"></slot>
        <slot
          name="vacunacion-covid"
          v-if="intent == 'vacunacion-covid'"
        ></slot>
        <slot
          name="cirugia-preanestesia"
          v-if="intent == 'cirugia-preanestesia'"
        ></slot>
        <slot
          name="historia-clinica"
          v-if="intent == 'historia-clinica'"
        ></slot>
      </b-list-group-item>
    </b-list-group-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MessageAgent",
  props: {
    text: String,
    intent: "",
  },
  computed: {
    ...mapState(["imgAgent", "currentIntent"]),
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
