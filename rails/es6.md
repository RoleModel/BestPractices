## [Home](../README.md)

## Summary

Including ES6 in Rails applications can be very useful. Using JavaScript packages that are only available/maintained in npm has traditionally been a problem with Rails application. This documents an approach chosen among a couple of different options.

We settled upon [sprockets-commoner](https://github.com/Shopify/sprockets-commoner) over webpack and browserify because it integrates with the Rails asset pipeline and least modifies the natural development of JavaScript components.

### Steps to upfit your Rails application

* add `'expose window.[component_name]'` to the top of ES6 class files
  * if class needs to be available on `window`, see `react-rails`
    example below
* add `gem 'sprockets-commoner'` to Gemfile
* add `.babelrc` to project root
  * add other presets as necessary (eg. react)

    ```json
      {
        presets: [
          "es2015"
        ]
      }
    ```

* add NPM dependencies to `package.json` (including react-dom, react-chartjs, etc.)

  ```json
    "dependencies": {
      "babel-core": "^6.14.0",
      "babel-generator": "^6.14.0",
      "babel-helpers": "^6.8.0",
      "babel-polyfill": "^6.7.4",
      "babel-types": "^6.14.0",
      "babel-preset-es2015": "^6.9.0",
      "babel-runtime": "^6.6.1",
    }
  ```

* add `app/assets/config/manifest.js` file

  ```js
  //= link_tree ../images
  //= link_directory ../javascripts .js
  //= link_directory ../stylesheets .css
  ```

#### React specific steps

* rename .jsx files to .js
* move propTypes out of class, and change syntax to `[class_name].propTypes = { ... }`
* modify `application.js` (NOTE: no space between last import and window.React)

  ```js
  //= require jquery
  //= require turbolinks
  //= require react_ujs
  // require_tree ./components

  import 'babel-polyfill'
  import React from "react"
  import ReactDOM from "react-dom"
  import DoughnutChart from './components/DoughnutChart'
  import MyForm from './components/MyForm'
  window.React = React
  window.ReactDOM = ReactDOM
  ```

  * add imports for React, ReactDOM, individual components (if individually importing)
  * set values on `window` for React and ReactDOM
  * `require jquery`
  * `require react_ujs` (if using `react-rails` gem and view helper)
* add `gem 'react-rails'` to Gemfile
* use `react-rails` helper method in views

  ```ruby
  = react_component('ScorecardsDoughnutChart', graph_data)
  ```

### Deployment

Note: When deploying to Heroku, you will need to turn on an additional [buildpack](https://devcenter.heroku.com/articles/buildpacks#using-multiple-buildpacks) for node.

### References

* [sprockets-commoner](https://github.com/Shopify/sprockets-commoner) - serve assets
* [react-rails](https://github.com/reactjs/react-rails) - provides Rails helper

### Testing

* [Teaspoon](https://github.com/jejacks0n/teaspoon) works with mocha and jasmine
* add `gem 'teaspoon-mocha'` and `gem 'teaspoon-bundle'` to `Gemfile` (the latter is required because `sprockets-commoner` does not recognize teaspoon by default, see [here](https://github.com/Shopify/sprockets-commoner))
* run `rails generate teaspoon:install`
* edit `teaspoon_env.rb` to include `suite.boot_partial = 'bundle_boot'`
* rename all tests to end with `_spec.js`
* run teaspoon with `RAILS_ENV=test rake teaspoon`
* override default `teaspoon` rake task to force RAILS_ENV=test, and ensure teaspoon tests run with `rake`
