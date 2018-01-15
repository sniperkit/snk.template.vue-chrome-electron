<!--
  - The MIT License (MIT)
  -
  - Copyright (c) 2017 Becauseqa.Inc.
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -
  -->

<template>
    <v-layout row wrap align-center>
        <v-flex xs10 offset-xs1 wrap>
            <h3>\{{title}}, latest updated at: \{{releaseDate}}</h3>
            <h4>Changes:</h4>
            <div v-html="body"></div>
            <v-divider dark></v-divider>
            <a :href="website" target="_blank">Official Website</a>
            <v-btn flat :to="{name:'hotrelease'}">Hot Release Main Page</v-btn>

        </v-flex>
    </v-layout>
</template>

<script>
  const md = require('markdown-it')()

  export default {
    data () {
      return {
        title: '',
        releaseDate: '',
        body: '',
        website: ''
      }
    },
    methods: {
      parseParams: function () {
        // for dynamic parameter
        const storeMDBody = this.$store.state.release.releaseItem.body
        this.title = this.$store.state.release.releaseItem.title
        const publishDate = this.$store.state.release.releaseItem.published_at
        if (publishDate) {
          this.releaseDate = publishDate.toLocaleString()
        }
        this.website = this.$store.state.release.releaseItem.html_url
        if (storeMDBody) {
          this.body = md.render(storeMDBody)

        } else {
          this.body = 'Nothing found, This guy is too lazy to add the release note!'
        }
      }
    },
    mounted () {
      this.parseParams()
    }
  }
</script>
