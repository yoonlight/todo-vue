<template>
  <v-container>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="deep-purple accent-4"
    ></v-progress-linear>
    <add-todo />
    <edit-todo :editDialog="editDialog" :item="edit" />
    <v-list v-if="loading == false">
      <v-list-item
        v-for="todo in todos"
        v-bind:key="todo.id"
        three-line
        v-touch="{
          left: () => deleteTodo(todo.id)
        }"
        v-click-outside="onClickOutsideStandard"
        @click="editTodo(todo.id)"
      >
        <v-list-item-action>
          <v-checkbox @click="updateTodo(todo)" v-model="todo.complete" />
        </v-list-item-action>
        <v-list-item-content>
          <span class="text-uppercase font-weight-regular caption">
            {{ parseDate(todo.created_date) }}
          </span>
          <div v-text="todo.title" />
          <v-divider></v-divider>
        </v-list-item-content>
        <v-list-item-action v-if="!mobile">
          <v-row>
            <v-col>
              <v-icon @click="editTodo(todo.id)">mdi-pencil</v-icon>
            </v-col>
            <v-col>
              <v-icon @click="deleteTodo(todo.id)">mdi-delete</v-icon>
            </v-col>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <!-- <v-col>
        <v-select v-model="limit" :items="items" label="Todos" />
      </v-col> -->
    <v-pagination
      v-if="pagination"
      v-model="offset"
      :length="pagination"
      total-visible="false"
    />
  </v-container>
</template>

<script>
import AddTodo from "./AddTodo.vue";
import EditTodo from "./EditTodo.vue";
import { EventBus } from "../../utils/eventBus";
import api from "../../service/api";

export default {
  components: { EditTodo, AddTodo },
  async created() {
    await this.getTodo(this.offset, this.limit);
  },

  async mounted() {
    EventBus.$on("refreshAdd", async () => {
      await this.getTodo(this.offset, this.limit);
      console.log("refresh Add");
    });
    EventBus.$on("refreshDelete", async () => {
      await this.getTodo(this.offset, this.limit);
      console.log("refresh Delete");
    });
    EventBus.$on("refreshEdit", async () => {
      await this.getTodo(this.offset, this.limit);
      console.log("refresh Edit");
    });
    EventBus.$on("update Complete", async value => {
      this.value = value;
      await this.getTodo(this.offset, this.limit);
      console.log("Update Complete Todo List");
    });
  },

  destroyed() {
    EventBus.$off("refreshEdit");
    EventBus.$off("refreshAdd");
    EventBus.$off("refreshDelete");
    EventBus.$off("update Complete");
  },

  data: () => ({
    value: 1,
    complete: false,
    todos: [],
    edit: {},
    offset: 1,
    limit: 5,
    pagination: 0,
    items: [5, 10, 15],
    filter: ["undefined", false, true],
    editDialog: false,
    models: {
      base: false,
      conditional: false
    },
    loading: true
  }),

  computed: {
    mobile: function() {
      return this.$vuetify.breakpoint.mobile;
    },
    theme: function() {
      return this.$route.params.theme;
    }
  },

  watch: {
    async value(val) {
      this.complete = this.filter[val];
      this.offset = 1;
      await this.getTodo(this.offset, this.limit);
      console.log(`move to ${this.complete}`);
    },
    offset: {
      async handler() {
        await this.getTodo();
        console.log("page:" + this.offset);
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
      this.loading = true;
      let query = ``;
      if (this.complete != "undefined") {
        query = `&complete=${this.complete}`;
      }

      const result = await api.todo.list(
        this.theme,
        this.offset,
        this.limit,
        query
      );
      this.todos = result.data[0];
      this.pagination = Math.ceil(result.data[1] / this.limit);
      console.log("refresh");
      this.loading = false;
    },

    updateTodo: async function(val) {
      await api.todo.update(val).then(result => {
        console.log(result);
        this.$toasted.success("Update Todo List", { duration: 2000 });
      });
      await this.getTodo(this.offset, this.limit);
    },

    editTodo: function(id) {
      this.editDialog = !this.editDialog;
      this.edit = this.todos.filter(a => a.id == id)[0];
    },

    async deleteTodo(id) {
      const select = confirm("Are you sure to delete todo?");
      if (select) {
        await api.todo.delete(id);
        this.$toasted.success("Delete Todo", { duration: 2000 });
        EventBus.$emit("refreshDelete");
      }
    },

    parseDate: function(val) {
      let date = new Date(val).toLocaleDateString();
      return date;
    },

    onClickOutsideStandard() {
      this.models.base = false;
    }
  }
};
</script>
