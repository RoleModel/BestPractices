---
layout: post
title:  "Cross-browser Testing"
date:   2017-05-25 00:00:01 -0400
---

Testing applications across multiple browsers has become necessary given the differing behaviors and support for different HTML, CSS, and JavaScript features with the majority of browsers. Tools like [Selenium](http://www.seleniumhq.org/) have arisen to allow an ease of testing multiple browsers using drivers, but even this has some limitations and added complexity.

SauceLabs and BrowserStack were created to help ease some of the limitations and complexity with testing applications cross-browser with Selenium by providing a sort of "Selenium Server as a Service" through automation services. Using their services, you do not need to host your own hardware or Selenium Server to maintain and configure for running your test suite. You just need the proper endpoint from the automation provider and auth credentials.

Automation providers, like SauceLabs and BrowserStack, also keep a log of actions that occur while running your test suite. When tests fail, the provider captures a screenshot of where the failure took place when it occurred to aid in debugging your tests.

### BrowserStack Integration Setup

When following along with these steps, you will need to have a BrowserStack account with Automate access. Follow the steps below to integrate your applications test suite with BrowserStack.

These steps are only for testing your suite locally (web server and database server on your machine) against BrowserStack provided browser sessions. Integrations with CI services are more involved and vary based on your service provider. CI services usually provide documentation on how to integrate their service with BrowserStack or SauceLabs.

1. Use your `BROWSERSTACK_AUTHKEY` and `BROWSERSTACK_USERNAME` to configure your Selenium path for BrowserStack.

2. Use the `BROWSERSTACK_HUB_HOST` url in your `capybara.rb` file to configure the path for BrowserStack.

3. Create a browsers json file. Capybara and Rake both use the browsers file for configuring driver settings and creating tasks for testing the suite. You can find an example [here](/testing/browsers.json).

4. Create a Rake task for testing your browsers. You can find an example [here](/testing/cross_browser.rake). You can make modifications based on the needs of your test suite.

5. Configure Capybara to use the browsers json file for driver settings. You can find an example [here](/testing/capybara.rb).

6. Download and install the [BrowserStackLocal](https://www.browserstack.com/local-testing#command-line) binary in the root directory for your project.

### Running Tests Against BrowserStack

<!-- TODO: this link is broken -->
In a `bash` terminal window, run any of these commands to start running the suite or a set of tests against BrowserStack. Browser configurations are [here](/spec/browsers.json).

  Runs the full suite of `:javascript`/`@javascript` tagged scenarios against Internet Explorer 9
  ```bash
  $ bundle exec rake cross_browser:ie9
  ```

  Runs the RSpec scenarios tagged with `:javascript` against Internet Explorer 9
  ```bash
  $ bundle exec rake cross_browser:rspec:ie9
  ```

  Runs the Spinach scenarios tagged with `@javascript` against Internet Explorer 9
  ```bash
  $ bundle exec rake cross_browser:spinach:ie9
  ```

  Runs the RSpec scenarios for the specific file against Internet Explorer 9
  ```bash
  $ bundle exec rake 'cross_browser:rspec:ie9[spec/features/support/release_notes_spec.rb]'
  ```

  Runs the Spinach scenarios for the specific file against Internet Explorer 9
  ```bash
  $ bundle exec rake 'cross_browser:spinach:ie9[features/reference_ui/clinical_trials.feature]'
  ```

### Selenium Server

For instructions, please see this [document](/testing/selenium_server.md).
