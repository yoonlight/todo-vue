<template>
  <v-app>
    <v-container>
      <v-responsive height="85vh" class="d-flex align-center text-center pa-2">
        <v-card>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="name"
                :counter="10"
                :rules="nameRules"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Password"
                required
              ></v-text-field>
              <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'You must agree to continue!']"
                label="Do you agree?"
                required
              ></v-checkbox>
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Validate
              </v-btn>
              <v-btn color="error" class="mr-4" @click="reset">
                Reset Form
              </v-btn>
              <v-btn color="warning" @click="resetValidation">
                Reset Validation
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-responsive>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    email: "",
    checkbox: false
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
