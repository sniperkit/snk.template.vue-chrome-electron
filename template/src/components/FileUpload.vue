<template>
    <v-layout row child-flex align-center wrap>
        <v-flex xs10 offset-xs1>
            <v-upload v-model="filename" @formData="formData"></v-upload>
            <v-btn @click.native="uploadFiles">UPLOADER</v-btn>
        </v-flex>
    </v-layout>
</template>
<script>
    import VUpload from "./commons/VUpload"

    export default {
        data: function () {
            return {
                filename: 'UPLADER'
            }
        },
        components: {
            VUpload
        },
        methods: {
            formData: function () {
                console.log('change trigger')
            },
            uploadFiles:function () {
                
            }
        }
    }

</script>