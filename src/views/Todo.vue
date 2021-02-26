<template>
  <v-container>
    <v-dialog v-model="dialog">
      <v-card>
        Edit Data
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
                v-model="to.title"
                label="Title"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="to.body"
                label="Todo"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="success">Edit</v-btn>
            </v-col>
          </v-row>
        </v-list-item>
      </v-card>
    </v-dialog>
    <v-card>
      <v-list-item>
        <v-row>
          <v-col>
            <v-text-field
              v-model="todo.title"
              label="Title"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="todo.body"
              label="Todo"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-btn color="success" @click="addTodo(todo)">ADD</v-btn>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item v-for="todo in todos" v-bind:key="todo.index" two-line>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ todo.title }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ todo.body }}</v-list-item-subtitle>
          <v-card-actions>
            <v-btn color="error" @click="deleteTodo(todo._id)">DELETE</v-btn>
            <v-btn tile color="success" @click="dialog = true">
              <v-icon left>mdi-pencil</v-icon>Edit
            </v-btn>
            <v-checkbox
              @click="check(todo)"
              v-model="todo.complete"
              :label="`Checkbox 1: ${todo.complete.toString()}`"
            />
          </v-card-actions>
          <v-divider></v-divider>
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
    dialog: false,
    todo: {
      body: "",
      title: ""
    }
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
