# Vuejs-template

> A full-featured Webpack setup with hot-reload, lint-on-save, unit testing & css extraction. You can use it in your electron or chrome-extension development.

> This template is modified from offical template `vuejs-templates/webpack`, Vue 2.0 compatible.But there're some difference for this template, it only contained one webpack config file, but it had the full feature as offical provided. Also provide many useful features, like `electron`, `chrome-extension development`, `vuex`, `vuetify` and `axios`.

## Documentation

- [For this template](http://vuejs-templates.github.io/webpack): common questions specific to this template are answered and each part is described in greater detail
- [For Vue 2.0](http://vuejs.org/guide/): general information about how to work with Vue, not specific to this template
## Live Demo
[Live Demo from now.sh]()
## Template structure
```
├── becauseqa-vue-webpack/               # Your project's name

  ├── app/

        ├── chrome/                       # Chrome extension configuration location,the manifest.json file 
            |── js/                       # Chrome extension common api
            |── libs/                     # Third-party libraries, like jquery.etc
        
        ├── electron/

            ├── js/                       # Common function used by electron
            ├── main.js

   ├── src/                               # Main vue source folder
            ├── assets/                   # The assets folder to store js,css,font or image files
            ├── components/               # The page components
            ├── routers/                  # The vue-router store file
            ├── stores/                   # Vuex configuration file
            ├── utils/                    # Common js functions
            ├── App.vue                   # Vue app. Your global css can go here
            ├── index.js                  # App entry. Your global js can go here
            ├── index.html                # Single Page Application HTML, it only uses build's files

    ├── webpack.config.base.js            # Webpack common base configuration file
    ├── package.json                      # The main dependency and electron-builder configuration
    ├── webpack.config.chrome.js          # Chrome extension webpack configuration file
    ├── webpack.config.electron.main.js   # Electron main processor webpack configuration file
    ├── webpack.config.electron.render.js # Electron renderer processor webpack configuration file
    ├── webpack.config.web.js             # Vuejs web webpack configuration file 
```

## Usage

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli). **It is recommended to use npm 3+ for a more efficient dependency tree.**

``` bash
$ npm install -g vue-cli
$ vue init BecauseQA/vuejs-template my-project-name
$ cd my-project-name
$ npm install
$ npm start     // for web app
$ npm start-app // for electron app
$ npm start-chrome-extension  // for chrome-extension development
```
Or you can download this project repository,extract the source code to `somewhere` folder and then run following commands to start it

```bash
$ npm install -g vue-cli
$ vue init ./somewhere my-project-name
$ cd my-project-name
$ npm install
$ npm start     // for web app
$ npm start-app // for electron app
$ npm start-chrome-extension  // for chrome-extension development
```
If port 3000 is already in use on your machine you must change the port number in `/webpack.config.base.js` in the line `const devServerPort = process.env.PORT || '3000'`. Otherwise `npm start` will fail.

## What's Included

- `npm start`: first-in-class development experience for web .
  - Webpack + `vue-loader` for single file Vue components.
  - State preserving hot-reload
  - State preserving compilation error overlay
  - Lint-on-save with ESLint
  - Source maps
  - Service worker to support PWA page
  
- `npm start-app`: first-in-class development experience for electron using vuejs.
  - Webpack + `vue-loader` for single file Vue components.
  - State preserving hot-reload
  - State preserving compilation error overlay
  - Lint-on-save with ESLint
  - Source maps
  - Auto update with `electron-builder`
  - Static assets support for `SystemTray`
  
- `npm start-chrome-extension`: first-in-class development experience for developing chrome extension using vuejs framework.
  - Webpack + `vue-loader` for single file Vue components.
  - State preserving hot-reload
  - State preserving compilation error overlay
  - Lint-on-save with ESLint
  - Source maps
  - manifest and background page with ES6 feature


  
- `npm run build`: Production ready build.
  - JavaScript minified with [UglifyJS](https://github.com/mishoo/UglifyJS2).
  - HTML minified with [html-minifier](https://github.com/kangax/html-minifier).
  - CSS across all components extracted into a single file and minified with [cssnano](https://github.com/ben-eb/cssnano).
  - All static assets compiled with version hashes for efficient long-term caching, and a production `index.html` is auto-generated with proper URLs to these generated assets.
  - Use `npm run build --report`to build with bundle size analytics.



### Fork It And Make Your Own

You can fork this repo to create your own boilerplate, and use it with `vue-cli`:

``` bash
vue init username/repo my-project-name
```
