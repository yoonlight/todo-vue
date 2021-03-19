<template>
  <v-container style="max-width: 600px">
    <edit-todo :editDialog="editDialog" :item="edit" />
    <delete-todo :deleteDialog="deleteDialog" :deleteId="deleteId" />
    <v-card>
      <add-todo />
    </v-card>
    <br />
    <v-card>
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
              <v-icon @click="deleteTodo(todo._id)">mdi-delete</v-icon>
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
import AddTodo from "./AddTodo.vue";
import DeleteTodo from "./DeleteTodo.vue";
import EditTodo from "./EditTodo.vue";
import { EventBus } from "../utils/eventBus";

export default {
  components: { DeleteTodo, EditTodo, AddTodo },
  async created() {
    await this.getTodo(this.offset, this.limit);
  },

  async mounted() {
    EventBus.$on("refreshAdd", async () => {
      await this.getTodo(this.offset, this.limit);
      console.log("refreshAdd");
    });
    EventBus.$on("refreshDelete", async () => {
      await this.getTodo(this.offset, this.limit);
      console.log("refreshDelete");
    });
    EventBus.$on("refreshEdit", async () => {
      await this.getTodo(this.offset, this.limit);
      console.log("refreshEdit");
    });
  },

  destroyed() {
    EventBus.$off("refreshEdit");
    EventBus.$off("refreshAdd");
    EventBus.$off("refreshDelete");
  },
  data: () => ({
    complete: false,
    todos: [],
    completeItem: {},
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
    editDialog: false,
    deleteId: ""
  }),

  watch: {
    completeItem: {
      deep: true,
      async handler(val) {
        await this.updateTodo(val);
        console.log("update complete todo");
      }
    },
    offset: {
      async handler(val) {
        await this.getTodo(val, this.limit);
        console.log("update offset");
      }
    },
    limit: {
      async handler(val) {
        await this.getTodo(this.offset, val);
        console.log("update limit");
      }
    },
    complete: {
      async handler() {
        this.offset = 1;
        await this.getTodo(this.offset, this.limit);
        console.log("update complete");
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
      console.log("refresh");
    },

    updateTodo: async function(val) {
      await this.axios.put(`api/todo/${val._id}`, val).then(result => {
        console.log(result);
        this.$toasted.success(result.data.message, { duration: 2000 });
      });
      await this.getTodo(this.offset, this.limit);
    },

    updateComplete: function(val) {
      this.completeItem = val;
    },

    editTodo: function(id) {
      this.editDialog = !this.editDialog;
      this.edit = this.todos.filter(a => a._id == id)[0];
    },

    deleteTodo: function(id) {
      this.deleteDialog = !this.deleteDialog;
      this.deleteId = id;
    },

    parseDate: function(val) {
      let date = new Date(val).toLocaleDateString();
      return date;
    }
  }
};
</script>
