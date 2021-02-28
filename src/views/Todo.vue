<template>
  <v-container>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          Edit Data
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="edit.title" label="Title" required />
                </v-col>
                <v-col cols="9" md="5">
                  <v-text-field v-model="edit.body" label="Todo" required />
                </v-col>
                <v-col cols="3" md="1">
                  <v-list-item-action>
                    <v-icon @click="updateTodo(edit)">mdi-pencil</v-icon>
                  </v-list-item-action>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog">
      <v-card>
        <v-card-title>
          Are you sure to delete todo?
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-action>
              <v-btn color="error" @click="deleteTodo(to._id)">YES</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="todo.title"
                  label="Title"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="9" md="5">
                <v-text-field
                  v-model="todo.body"
                  label="Todo"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-rating v-model="todo.rate" />
              </v-col>
              <v-list-item-action>
                <v-col cols="3" md="1">
                  <v-icon @click="addTodo(todo)">mdi-plus</v-icon>
                </v-col>
              </v-list-item-action>
            </v-row>
          </v-form>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-select
          :items="filter"
          item-text="key"
          item-value="value"
          v-model="complete"
        >
        </v-select>
      </v-list-item>
      <v-list-item v-for="todo in todos" v-bind:key="todo.index" two-line>
        <v-checkbox @click="check(todo)" v-model="todo.complete" />
        <v-list-item-content>
          <v-list-item-title class="headline" v-text="todo.title" />
          <v-list-item-subtitle v-text="todo.body" />
          <div v-text="todo.date" />
        </v-list-item-content>
        <v-list-item-action>
          <v-row>
            <v-col>
              <v-icon @click="editTodo(todo._id)">mdi-pencil</v-icon>
            </v-col>
            <v-col>
              <v-icon @click="(deleteDialog = true), check(todo)"
                >mdi-delete</v-icon
              >
            </v-col>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-card>
    <div class="text-center">
      <v-pagination v-model="offset" :length="pagination.page" />
    </div>
    <v-select v-model="limit" :items="items" label="Standard" />
  </v-container>
</template>

<script>
export default {
  async created() {
    await this.getTodo(this.offset, this.limit);
  },

  data: () => ({
    complete: false,
    todos: [],
    to: {},
    dialog: false,
    todo: {},
    edit: {},
    offset: 1,
    limit: 5,
    pagination: {},
    items: [5, 10, 15],
    filter: [
      { key: "all", value: "undefined" },
      { key: "complete", value: true },
      { key: "ready", value: false }
    ],
    deleteDialog: false
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
    },
    limit: {
      async handler(val) {
        this.getTodo(this.offset, val);
      }
    },
    complete: {
      async handler() {
        this.offset = 1;
        this.getTodo(this.offset, this.limit);
      }
    }
  },

  methods: {
    getTodo: async function(offset, limit) {
      let query = ``;
      if (this.complete != "undefined") {
        query = `&complete=${this.complete}`;
      }
      const data = await this.axios
        .get(`api/todo?offset=${offset}&limit=${limit}` + query)
        .then(result => result.data);
      this.todos = data.query;
      this.pagination = data.pagination;
    },

    deleteTodo: async function(id) {
      await this.axios
        .delete(`api/todo/${id}`)
        .then(result => this.$toasted.success(result.data, { duration: 1000 }));
      await this.getTodo(this.offset, this.limit);
      this.deleteDialog = false;
    },

    updateTodo: async function(val) {
      await this.axios.put(`api/todo/${val._id}`, val).then(result => {
        this.$toasted.success(result.data, { duration: 1000 });
        this.dialog = false;
      });
      await this.getTodo(this.offset, this.limit);
    },

    addTodo: async function(val) {
      await this.axios
        .post(`api/todo`, val)
        .then(result => this.$toasted.success(result.data, { duration: 1000 }));
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
