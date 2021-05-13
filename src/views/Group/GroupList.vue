<template>
  <v-list>
    <v-list-group
      v-for="item in items"
      :key="item.title"
      v-model="item.active"
      no-action
    >
      <template v-slot:activator>
        <v-list-item-action>
          <v-btn icon @click="editGroup(child.id)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-item v-for="child in item.subject" :key="child.title" link>
        <v-list-item-content>
          <v-list-item-title v-text="child.title"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-row>
            <v-col>
              <v-icon @click="editGroup(child.id)">mdi-pencil</v-icon>
            </v-col>
            <v-col>
              <v-icon @click="deleteGroup(child.id)">mdi-delete</v-icon>
            </v-col>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>

<script>
import api from "../../service/api";

export default {
  async created() {
    const result = await this.getGroup();
    this.items = result[0];
    console.log(this.items);
  },

  data: () => ({
    items: []
  }),

  methods: {
    async getGroup() {
      const result = await api.project.list();
      return result.data;
    },

    editGroup: function(id) {
      this.editDialog = !this.editDialog;
      this.edit = this.todos.filter(a => a.id == id)[0];
    },

    async deleteGroup(id) {
      const select = confirm("Are you sure to delete todo?");
      if (select) {
        await api.project.delete(id);
        this.$toasted.success("Delete Group", { duration: 2000 });
        // EventBus.$emit("refreshDelete");
      }
    },

    async createSubject(body) {
      await api.subject.post(body);
    },

    async createProject(body) {
      await api.project.post(body);
    }
  }
};
</script>
