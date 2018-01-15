<template>
    <!--- 1. search 2. pagination 3.sort 4. header tooltips 5. footer  -->
    <v-layout row child-flex align-center wrap>
        <v-flex xs10 offset-xs1>
            <v-subheader> My Github Repositories (Size: \{{this.repos.length}})</v-subheader>
            <v-card>
                <div>
                    <v-btn router fab absolute top right dark class="green" @click.native.stop="addDialog = true">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-data-table v-model="selected" :headers="headers" :items="repos" :loading="isLoading">
                        <template slot="headers" slot-scope="props">
                            <tr>
                                <th>
                                    <v-checkbox primary hide-details @click.native="toggleAll" :input-value="props.all"
                                                :indeterminate="props.indeterminate"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text"
                                    :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)">
                                    <v-icon v-if="header.action">arrow_upward</v-icon>
                                    \{{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <!-- <template slot="headerCell" scope="props">
                                        <span v-tooltip:bottom="{ 'html': props.header.text }">

                                        </span>
                                    </template> -->
                        <template slot="items" slot-scope="props">
                            <tr :active="props.selected" @click="props.selected = !props.selected">
                                <td>
                                    <v-checkbox primary hide-details :input-value="props.selected"></v-checkbox>
                                </td>
                                <td> \{{props.item.id}}</td>
                                <td class="text-xs-left"> \{{props.item.name}}</td>
                                <td class="text-xs-left"> \{{props.item.full_name}}</td>
                                <td class="text-xs-left"> \{{props.item.owner.login}}</td>
                                <td class="text-xs-left"><a :href="props.item.html_url" target="_blank">\{{props.item.html_url}}</a>
                                </td>
                                <td class="text-xs-center">
                                    <v-btn color="primary" dark @click.native.stop="updateItem(props.item)">Edit</v-btn>
                                    <v-btn color="error" dark @click.native.stop="deleteItem(props.item)">Delete</v-btn>
                                </td>
                            </tr>
                        </template>
                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                                Sorry, no data to display here!
                            </v-alert>
                        </template>
                    </v-data-table>
                </div>
            </v-card>
        </v-flex>

        <!----------------------------------------------Dialogs------------------------------------------------------------------------>
        <!--Add dialog model-->
        <v-dialog v-model="addDialog">
            <v-card>
                <v-card-title>
                    <span class="headline">Add new contact</span>
                </v-card-title>
                <v-card-text>
                    Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam
                    libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt
                    verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae
                    adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat.
                </v-card-text>
                <v-card-actions class="align-center">
                    <!--<v-spacer></v-spacer>-->
                    <v-btn class="green--text darken-1" flat @click.native.stop="addDialog = false">
                        done
                    </v-btn>
                    <v-btn flat @click.native.stop="addDialog = false">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="updateDialog">
            <v-card>
                <v-card-title>
                    <span class="headline">Update Settings</span>
                    <v-spacer></v-spacer>
                    <v-menu bottom left>
                        <v-btn icon slot="activator">
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                    </v-menu>
                </v-card-title>
                <v-card-text>
                    Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam
                    libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt
                    verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae
                    adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native.stop="updateDialog=false">done</v-btn>
                    <v-btn flat @click.native.stop="updateDialog=false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog">
            <v-card>
                <v-card-title>
                    <span class="headline">Delete </span>
                    <v-spacer></v-spacer>
                    <v-menu bottom left>
                        <v-btn icon slot="activator">
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                    </v-menu>
                </v-card-title>
                <v-card-text>
                    Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam
                    libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt
                    verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae
                    adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" flat @click.native.stop="deleteDialog=false">done</v-btn>
                    <v-btn flat @click.stop="deleteDialog=false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-layout>
</template>
<script type="text/javascript">
    export default {
        data: () => {
            return {
                addDialog: false,
                updateDialog: false,
                deleteDialog: false,
                pagination: {
                    sortBy: 'id'
                },
                selected: [],
                headers: [
                    {text: 'Repository Id', value: 'id'},
                    {text: 'Repository Name', value: "name"},
                    {text: 'Repository FullName', value: "fullname"},
                    {text: 'Owner Name', value: 'owername'},
                    {text: 'Repository Url', value: 'url'},
                    {text: 'Operations', action: true}
                ],
                repos: [],
                isLoading: false
            }
        },
        methods: {
            toggleAll: function () {
                if (this.selected.length) this.selected = []
                else this.selected = this.repos.slice()
            },
            changeSort: function (column) {
                if (column) {
                    if (this.pagination.sortBy === column) {
                        this.pagination.descending = !this.pagination.descending
                    } else {
                        this.pagination.sortBy = column
                        this.pagination.descending = false
                    }
                }
            },
            getData: function () {
                var config = {
                    headers: {'Authorization': 'Basic YWx0ZXJodTIwMjBAZ21haWwuY29tOmd1Y2hhbjEwMjY='}
                }
                this.isLoading = true
                this.$http.get('https://api.github.com/users/BecauseQA/repos', config).then(res => {
                        this.repos = res.data
                        this.isLoading = false
                    }
                )
            },
            updateItem: function (item) {
                const jsonItem = JSON.stringify(item)
                console.debug(`Move to update item: ${jsonItem}`)
                this.updateDialog = true
            },
            deleteItem: function (item) {
                const jsonItem = JSON.stringify(item)
                console.debug(`Move to delete item: ${jsonItem}`)
                this.deleteDialog = true
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>