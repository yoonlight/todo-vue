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
        <v-list-item-content>
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
            <v-list-item-action>
              <v-col>
                <v-btn color="success" class="mr-4" @click="addTodo(todo)"
                  >ADD</v-btn
                >
              </v-col>
            </v-list-item-action>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="todo in todos" v-bind:key="todo.index" two-line>
        <v-list-item-content>
          <v-list-item-title class="headline" v-text="todo.title" />
          <v-list-item-subtitle v-text="todo.body" />
        </v-list-item-content>
        <v-list-item-action>
          <v-row>
            <v-col>
              <v-checkbox
                @click="check(todo)"
                v-model="todo.complete"
                :label="`${todo.complete.toString()}`"
              />
            </v-col>
            <v-col>
              <v-btn color="success" @click="editTodo(todo._id)">
                <v-icon left>mdi-pencil</v-icon>Edit
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="error" @click="deleteTodo(todo._id)">
                DELETE
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-card>
    <div class="text-center">
      <v-pagination v-model="offset" :length="pagination.page" />
    </div>
  </v-container>
</template>

<script>
export default {
  async created() {
    await this.getTodo(this.offset, this.limit);
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
    offset: 1,
    limit: 10,
    pagination: {}
  }),

  watch: {
    to: {
      deep: true,
      async handler(val) {
        await this.updateTodo(val);
      }
    },
    offset: {
      async handler(val) {
        this.getTodo(val, this.limit);
      }
    }
  },

  methods: {
    getTodo: async function(offset, limit) {
      const data = await this.axios
        .get(`api/todo?offset=${offset}&limit=${limit}`)
        .then(result => result.data);
      this.todos = data.query;
      this.pagination = data.pagination;
    },

    deleteTodo: async function(id) {
      await this.axios
        .delete(`api/todo/${id}`)
        .then(result => console.log(result));
      await this.getTodo(this.offset, this.limit);
    },

    updateTodo: async function(val) {
      await this.axios.put(`api/todo/${val._id}`, val).then(result => {
        console.log(result);
        this.dialog = false;
      });
      await this.getTodo(this.offset, this.limit);
    },

    addTodo: async function(val) {
      await this.axios
        .post(`api/todo`, val)
        .then(result => console.log(result));
      await this.getTodo(this.offset, this.limit);
      this.todo = {};
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
