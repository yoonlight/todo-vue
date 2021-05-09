<template>
  <div>
    <v-container>
      <edit-todo :editDialog="editDialog" :item="edit" />
      <delete-todo :deleteDialog="deleteDialog" :deleteId="deleteId" />
      <add-todo />
      <br />
      <v-list-item>
        <v-row>
          <v-col>
            <v-select v-model="limit" :items="items" label="Standard" />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item v-for="todo in todos" v-bind:key="todo.index" three-line>
        <v-checkbox @click="updateComplete(todo)" v-model="todo.complete" />
        <v-list-item-content>
          <span
            class="text-uppercase font-weight-regular caption"
            v-text="todo.title"
          />
          <div v-text="todo.body" />
          <div v-text="parseDate(todo.date)" />
          <v-divider></v-divider>
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
      <div class="text-center">
        <v-pagination v-model="offset" :length="pagination.page" />
      </div>
    </v-container>
    <v-bottom-navigation
      app
      fixed
      v-model="value"
      :value="value"
      color="primary"
    >
      <v-btn>
        <span>All</span>

        <v-icon>mdi-history</v-icon>
      </v-btn>

      <v-btn>
        <span>Ready</span>

        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn>
        <span>Complete</span>

        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import AddTodo from "./AddTodo.vue";
import DeleteTodo from "./DeleteTodo.vue";
import EditTodo from "./EditTodo.vue";
import { EventBus } from "../../utils/eventBus";
import api from "../../service/api";

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
    value: 1,
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
      { key: "ready", value: false },
      { key: "complete", value: true }
    ],
    deleteDialog: false,
    editDialog: false,
    deleteId: ""
  }),

  watch: {
    value: {
      async handler(val) {
        this.complete = this.filter[val].value;
        console.log(val);
        this.offset = 1;
        await this.getTodo(this.offset, this.limit);
        console.log("update complete");
      }
    },
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
    }
  },

  methods: {
    getTodo: async function(offset, limit) {
      let query = ``;
      if (this.complete != "undefined") {
        query = `&complete=${this.complete}`;
      }

      const data = await api.todo
        .list(offset, limit, query)
        .then(result => result.data);
      this.todos = data.query;
      this.pagination = data.pagination;
      console.log("refresh");
    },

    updateTodo: async function(val) {
      await api.todo.update(val).then(result => {
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
