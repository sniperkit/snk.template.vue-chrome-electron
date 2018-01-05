<template>
    <!--- 1. search 2. pagination 3.sort 4. header tooltips 5. footer  -->
    <v-layout row child-flex align-center wrap>

        <v-flex xs10 offset-xs1>
            <v-subheader> My Github Repositories (Size: \{{this.items.length}})</v-subheader>
            <v-card>
                <div>
                    <v-btn router fab absolute top right dark class="green" @click.native.stop="showDialog = true">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-dialog v-model="showDialog">
                        <v-card>
                            <v-card-title>
                                <span class="headline">Add new contact</span>
                            </v-card-title>
                            <v-card-text>
                                Contact me now ?
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false">
                                    Save
                                </v-btn>
                                <v-btn class="green--text darken-1" flat="flat" @click.native="showDialog = false">
                                    Cancel
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-data-table v-model="selected" :headers="headers" :items="items">
                        <template slot="headers" slot-scope="props">
                            <tr>
                                <th>
                                    <v-checkbox primary hide-details @click.native="toggleAll" :input-value="props.all"
                                                :indeterminate="props.indeterminate"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text"
                                    :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)">
                                    <v-icon>arrow_upward</v-icon>
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
                                <td class="text-xs-right"> \{{props.item.name}}</td>
                                <td class="text-xs-right"> \{{props.item.full_name}}</td>
                                <td class="text-xs-right"> \{{props.item.owner.login}}</td>
                                <td class="text-xs-right"> \{{props.item.owner.url}}</td>
                            </tr>
                        </template>
                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="warning">
                                Sorry, nothing to display here :(
                            </v-alert>
                        </template>
                    </v-data-table>
                </div>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script type="text/javascript">
    export default {
        data: () => {
            return {
                showDialog: false,
                pagination: {
                    sortBy: 'id'
                },
                selected: [],
                headers: [
                    {text: 'Repository Id', value: 'id'},
                    {text: 'Repository Name', value: "name"},
                    {text: 'Repository FullName', value: "fullname"},
                    {text: 'Owner Name', value: 'owername'},
                    {text: 'Repository Url', value: 'url'}
                    // { text: 'Operations', value: 'url' }
                ],
                items: []
            }
        },
        methods: {
            toggleAll: function () {
                if (this.selected.length) this.selected = []
                else this.selected = this.items.slice()
            },
            changeSort: function (column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            }
        },
        mounted() {
            var config = {
                headers: {'Authorization': 'Basic YWx0ZXJodTIwMjBAZ21haWwuY29tOmd1Y2hhbjEwMjY='}
            }
            this.$http.get('https://api.github.com/users/BecauseQA/repos', config).then(res => {
                    this.items = res.data
                }
            )
        }
    }
</script>