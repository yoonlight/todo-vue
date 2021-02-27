<template>
  <v-container>
    <v-dialog v-model="dialog">
      <v-card>
        Edit Data
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
                v-model="edit.title"
                label="Title"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="edit.body"
                label="Todo"
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="success" @click="updateTodo(edit)">Edit</v-btn>
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
          <v-list-item-title class="headline" v-text="todo.title" />
          <v-list-item-subtitle v-text="todo.body" />
        </v-list-item-content>
        <v-list-item-action>
          <v-row>
            <v-checkbox
              @click="check(todo)"
              v-model="todo.complete"
              :label="`${todo.complete.toString()}`"
            />
            <v-btn color="success" @click="editTodo(todo._id)">
              <v-icon left>mdi-pencil</v-icon>Edit
            </v-btn>
            <v-btn color="error" @click="deleteTodo(todo._id)">
              DELETE
            </v-btn>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-card>
    <div class="text-center">
      <v-pagination v-model="page" :length="6" />
    </div>
  </v-container>
</template>

<script>
export default {
  async created() {
    await this.getTodo();
  },

  data: () => ({
    todos: [],
    to: {},
    dialog: false,
    todo: {
      body: "",
      title: ""
    },
    edit: {
      body: "",
      title: ""
    },
    page: 0
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
    getTodo: async function() {
      this.todos = await this.axios
        .get("api/todo?offset=1&limit=10")
        .then(result => result.data);
    },

    deleteTodo: async function(id) {
      await this.axios
        .delete(`api/todo/${id}`)
        .then(result => console.log(result));
      await this.getTodo();
    },

    updateTodo: async function(val) {
      await this.axios
        .put(`api/todo/${val._id}`, val)
        .then(result => console.log(result));
      await this.getTodo();
    },

    addTodo: async function(val) {
      await this.axios
        .post(`api/todo`, val)
        .then(result => console.log(result));
      await this.getTodo();
    },

    check: function(to) {
      this.to = to;
    },

    editTodo: function(id) {
      this.dialog = true;
      this.edit = this.todos.filter(a => a._id == id)[0];
    }
  }
};
</script>
