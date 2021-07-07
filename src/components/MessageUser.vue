<template>
  <div>
    <b-list-group-item
      class="d-flex justify-content-end align-items-start container-bubble-user px-0"
    >
      <b-list-group-item class="justify-content-start text-justify bubble-user">
        {{ text }}
      </b-list-group-item>
      <b-avatar variant="secondary" class="ml-2" size="3rem"></b-avatar>
    </b-list-group-item>
  </div>
</template>

<script>
export default {
  name: "MessageUser",
  props: {
    text: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
