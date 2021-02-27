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
                <v-list-item-action>
                  <v-col>
                    <v-btn color="success" @click="updateTodo(edit)"
                      >Edit</v-btn
                    >
                  </v-col>
                </v-list-item-action>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
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
        </v-list-item-content>
        <v-list-item-action>
          <v-row>
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
    ]
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
