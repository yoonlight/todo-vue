<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center">
          <v-col>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="login.username"
                  :counter="20"
                  :rules="nameRules"
                  label="Username"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="login.password"
                  label="Password"
                  required
                  :type="show1 ? 'text' : 'password'"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show1 = !show1"
                ></v-text-field>
                <v-checkbox
                  v-model="checkbox"
                  :rules="[v => !!v || 'You must agree to continue!']"
                  label="Do you agree?"
                  required
                ></v-checkbox>
                <v-btn
                  block
                  :disabled="!valid"
                  color="success"
                  @click="validate(login)"
                >
                  Login
                </v-btn>
                <br />
                <v-btn block color="success" @click="register">
                  Register
                </v-btn>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    show1: false,
    valid: true,
    login: {
      username: "",
      password: ""
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 20) || "Name must be less than 20 characters"
    ],
    checkbox: false
  }),

  methods: {
    async validate(val) {
      if (this.$refs.form.validate()) {
        await this.axios
          .post(`api/auth/login`, val)
          .catch(error => {
            if (error)
              this.$toasted.error(error.response.data.message, {
                duration: 2000
              });
          })
          .then(result => {
            if (result) {
              this.$toasted.success(result.data.message, { duration: 2000 });
              let token = result.data.token;
              localStorage.setItem("user", token);
              this.$router.push("/");
            }
          });
      }
    },

    register() {
      this.$router.push("/register");
    }
  }
};
</script>
