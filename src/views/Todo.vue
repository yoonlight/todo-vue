<template>
  <v-container>
    <v-btn color="success" @click="dialog = true">ADD</v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        ADD Data
        <v-btn color="success">ADD</v-btn>
      </v-card>
    </v-dialog>
    <v-card>
      <v-list-item v-for="todo in todos" v-bind:key="todo.index" two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ todo.title }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ to.body }}</v-list-item-subtitle>
          <v-btn color="error" @click="deleteTodo(todo._id)">DELETE</v-btn>
          <v-checkbox
            @click="check(todo)"
            v-model="todo.complete"
            :label="`Checkbox 1: ${todo.complete.toString()}`"
          />
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
export default {
  async created() {
    this.todos = await this.axios
      .get("api/todo?offset=1&limit=10")
      .then(result => result.data);
  },

  data: () => ({
    todos: [],
    to: {},
    dialog: false
  }),

  watch: {
    to: {
      deep: true,
      async handler(val) {
        this.updateTodo(val);
      }
    }
  },

  methods: {
    deleteTodo: async function(id) {
      await this.axios
        .delete(`api/todo/${id}`)
        .then(result => console.log(result));
    },

    updateTodo: async function(val) {
      await this.axios
        .put(`api/todo/${val._id}`, val)
        .then(result => console.log(result));
    },

    addTodo: async function(val) {
      await this.axios
        .post(`api/todo`, val)
        .then(result => console.log(result));
    },

    check: function(to) {
      this.to = to;
    }
  }
};
</script>
