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
import store from "../../store";
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
    ]
  }),

  methods: {
    async validate(val) {
      if (this.$refs.form.validate()) {
        try {
          await store.dispatch("LOGIN", val);
          this.$router.push({ name: "Home" });
          this.$toasted.success("Success Login", { duration: 2000 });
          //     let token = result.data.token;
          //     localStorage.setItem("user", token);
          //     this.$router.push("/");
        } catch (e) {
          this.$toasted.error(e.response.data.message, {
            duration: 2000
          });
        }
      }
    },
    redirect() {
      const { search } = window.location;
      const tokens = search.replace(/^\?/, "").split("&");
      const { returnPath } = tokens.reduce((qs, tkn) => {
        const pair = tkn.split("=");
        qs[pair[0]] = decodeURIComponent(pair[1]);
        return qs;
      }, {});

      // 리다이렉트 처리
      this.$router.push(returnPath);
    },
    register() {
      this.$router.push("/register");
    }
  }
};
</script>
