<template>
  <v-container>
    <v-card>
      <li v-for="to in todo.data" v-bind:key="to.title">{{ to.title }}</li>
    </v-card>
  </v-container>
</template>

<script>
export default {
  async created() {
    this.todo = await this.axios.get("api/todo");
    console.log(this.todo);
  },

  data: () => ({
    todo: []
  })
};
</script>
