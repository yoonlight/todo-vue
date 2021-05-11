<template>
  <div>
    <v-container>
      <edit-todo :editDialog="editDialog" :item="edit" />
      <delete-todo :deleteDialog="deleteDialog" :deleteId="deleteId" />
      <add-todo />
      <v-list-item
        v-for="todo in todos"
        v-bind:key="todo.index"
        three-line
        v-touch="{
          left: () => deleteTodo(todo._id),
          right: () => swipe('Right'),
          up: () => swipe('Up'),
          down: () => swipe('Down')
        }"
        v-click-outside="onClickOutsideStandard"
        @click="editTodo(todo._id)"
      >
        <v-list-item-action>
          <v-checkbox @click="updateComplete(todo)" v-model="todo.complete" />
        </v-list-item-action>
        <v-list-item-content>
          <span class="text-uppercase font-weight-regular caption">
            {{ todo.title }} - {{ parseDate(todo.date) }}
          </span>
          <div v-text="todo.body" />
          <v-divider></v-divider>
        </v-list-item-content>
        <v-list-item-action v-if="!mobile">
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
      <v-list-item>
        <v-select v-model="limit" :items="items" label="Standard" />
      </v-list-item>
      <div class="text-center" v-if="pagination">
        <v-pagination v-model="offset" :length="pagination" />
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
    EventBus.$on("update header", id => {
      this.subject = id;
    });
  },

  destroyed() {
    EventBus.$off("refreshEdit");
    EventBus.$off("refreshAdd");
    EventBus.$off("refreshDelete");
    EventBus.$on("update header");
  },
  data: () => ({
    subject: 0,
    value: 1,
    complete: false,
    todos: [],
    completeItem: {},
    edit: {},
    offset: 1,
    limit: 5,
    pagination: 0,
    items: [5, 10, 15],
    filter: ["undefined", false, true],
    deleteDialog: false,
    editDialog: false,
    deleteId: "",
    swipeDirection: "None",
    models: {
      base: false,
      conditional: false
    }
  }),
  computed: {
    mobile: function() {
      return this.$vuetify.breakpoint.mobile;
    },
    theme: function() {
      return this.$route.params.theme;
    }
    // value: function() {
    //   return this.$route.params.complete;
    // }
  },
  watch: {
    value: {
      async handler(val) {
        this.complete = this.filter[val];
        this.offset = 1;
        await this.getTodo(this.offset, this.limit);
        console.log(`move to ${this.complete}`);
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
      async handler() {
        await this.getTodo();
        console.log("update offset");
      }
    },
    theme: {
      async handler() {
        await this.getTodo();
        console.log("update theme");
      }
    },
    limit: {
      async handler() {
        await this.getTodo();
        console.log("update limit");
      }
    }
  },

  methods: {
    getTodo: async function() {
      let query = ``;
      if (this.complete != "undefined") {
        query = `&complete=${this.complete}`;
      }

      const data = await api.todo
        .list(this.subject, this.offset, this.limit, query)
        .then(result => result.data);
      this.todos = data[0];

      this.pagination = Math.ceil(data[1] / this.limit);
      console.log("refresh");
      console.log(this.pagination);
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
    },

    swipe(direction) {
      this.swipeDirection = direction;
      console.log(this.swipeDirection);
    },

    onClickOutsideStandard() {
      this.models.base = false;
    }
  }
};
</script>
