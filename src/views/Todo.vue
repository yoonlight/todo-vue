<template>
  <v-container style="max-width: 600px">
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          Edit Data
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="edit.title" label="Title" required />
                </v-col>
                <v-col cols="10" md="11">
                  <v-text-field v-model="edit.body" label="Todo" required />
                </v-col>
                <v-col cols="2" md="1">
                  <v-list-item-action>
                    <v-icon @click="updateTodo(edit)">mdi-pencil</v-icon>
                  </v-list-item-action>
                </v-col>
                <v-col cols="9" md="3">
                  <v-list-item-action>
                    <v-rating v-model="edit.rate" />
                  </v-list-item-action>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- <v-dialog v-model="deleteDialog" max-width="600">
      <v-card>
        <v-card-title>
          Are you sure to delete todo?
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-action>
              <v-btn color="error" @click="deleteTodo(deleteItem._id)"
                >YES</v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog> -->
    <delete-todo :deleteDialog="deleteDialog" />
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="todo.title"
                  :rules="rules"
                  label="Title"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="todo.body"
                  :rules="rules"
                  label="Todo"
                  required
                />
              </v-col>
              <v-col cols="3" md="1">
                <v-list-item-action>
                  <v-icon :disabled="!valid" @click="addTodo(todo)"
                    >mdi-plus</v-icon
                  >
                </v-list-item-action>
              </v-col>
            </v-row>
          </v-form>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col cols="2" md="2">
            <v-select />
          </v-col>
          <v-col cols="4" md="4">
            <v-text-field />
          </v-col>
          <v-col cols="3">
            <v-list-item-action>
              <v-icon>mdi-text-search</v-icon>
            </v-list-item-action>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col>
            <v-select
              :items="filter"
              item-text="key"
              item-value="value"
              v-model="complete"
            />
          </v-col>
          <v-col>
            <v-select v-model="limit" :items="items" label="Standard" />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item v-for="todo in todos" v-bind:key="todo.index" two-line>
        <v-checkbox @click="updateComplete(todo)" v-model="todo.complete" />
        <v-list-item-content>
          <v-list-item-title class="headline" v-text="todo.title" />
          <v-list-item-subtitle v-text="todo.body" />
          <div v-text="parseDate(todo.date)" />
        </v-list-item-content>
        <v-list-item-action>
          <v-row>
            <v-col>
              <v-icon @click="editTodo(todo._id)">mdi-pencil</v-icon>
            </v-col>
            <v-col>
              <v-icon @click="(deleteDialog = true), checkDeleteItem(todo)"
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
  </v-container>
</template>

<script>
import DeleteTodo from "./DeleteTodo.vue";
export default {
  components: { DeleteTodo },
  async created() {
    await this.getTodo(this.offset, this.limit);
  },

  data: () => ({
    valid: true,
    rules: [v => !!v || "Required !!"],
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
    deleteDialog: false,
    deleteItem: {}
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
        .then(result =>
          this.$toasted.success(result.data.message, { duration: 2000 })
        );
      await this.getTodo(this.offset, this.limit);
      this.deleteDialog = false;
    },

    updateTodo: async function(val) {
      await this.axios.put(`api/todo/${val._id}`, val).then(result => {
        console.log(result);
        this.$toasted.success(result.data.message, { duration: 2000 });
        this.dialog = false;
      });
      await this.getTodo(this.offset, this.limit);
    },

    addTodo: async function(val) {
      if (this.$refs.form.validate()) {
        await this.axios
          .post(`api/todo`, val)
          .then(result =>
            this.$toasted.success(result.data, { duration: 2000 })
          );
        await this.getTodo(this.offset, this.limit);
        this.$refs.form.reset();
      }
    },

    checkDeleteItem: function(val) {
      this.deleteItem = val;
    },

    updateComplete: function(val) {
      this.to = val;
    },

    editTodo: function(id) {
      this.dialog = true;
      this.edit = this.todos.filter(a => a._id == id)[0];
    },

    parseDate: function(val) {
      let date = new Date(val).toLocaleDateString();
      return date;
    }
  }
};
</script>
