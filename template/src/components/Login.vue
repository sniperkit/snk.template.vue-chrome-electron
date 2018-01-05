<template>
    <v-layout row child-flex align-center wrap>
        <v-flex xs10 offset-xs1>
            <v-card>
                <v-card-text>
                    <!-- //- form structure -->
                    <v-form v-model="formvalid" ref="loginform">
                        <v-text-field label="Email Address" v-model="email" :rules="emailRules" required></v-text-field>
                        <v-text-field label="password" v-model="passwd" :rules="passwdRules"
                                      :append-icon="passwdVisible ? 'visibility' : 'visibility_off'"
                                      :append-icon-cb="() => (passwdVisible = !passwdVisible)"
                                      :type="passwdVisible ? 'text' : 'password'" :counter="10" required></v-text-field>
                        <div flex>
                            <small> * Indicates required field</small>
                        </div>
                        <v-btn primary :disabled="!formvalid" :loading="loading" @click.native.prevent="login"> LOGIN
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
    export default {
        data: function () {
            return {
                formvalid: false,
                loading: false,
                email: '',
                emailRules: [
                    (v) => !!v || 'E-mail is required',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
                ],
                passwd: '',
                passwdVisible: false,
                passwdRules: [
                    (v) => !!v || 'Password is required',
                    (v) => v && v.length <= 10 || 'Password must be less than 10 characters'
                ]
            }
        },
        methods: {
            login: function () {
                this.$refs.loginform.validate()
                this.loading = true
                console.log("this.loading: " + this.loading)
                setTimeout(() => (this.loading = false), 3000)
                this.$router.push('/')
            },
            reset: function () {
                this.$refs.form.resetFields()
            },
            forgetPwd: function () {
            },
            newAccount: function () {
                this.$refs.signupfrm.validate()
            }
        }
    }
</script>