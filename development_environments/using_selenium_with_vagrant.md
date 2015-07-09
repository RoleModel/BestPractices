## [Home](../README.md)

# Using Selenium with Vagrant
The Selenium web driver for Capybara makes it easy to write integration tests because you can see and interact with the web browser that is running your tests. A downside of Selenium is it runs slower than headless drivers like PhantomJS. So a common approach is to use Selenium while you're writing or debugging tests, and then switch to a faster headless driver after the test is working.

Vagrant works great for setting up isolated development environments, but since Vagrant runs in headless mode, it doesn't work well with Selenium.

Here's how to make them play nicely together.

## Setup

### 1. Install Dependencies on Mac
```
$ brew install chromedriver
$ brew install selenium-server-standalone
```

### 2. Configure Capybara and VCR
Add this code to your test suite's config file (e.g. `features/env.rb`).

```ruby
SELENIUM_SERVER = '10.0.2.2' # found with `netstat -rn | grep "^0.0.0.0 " | cut -d " " -f10`
SELENIUM_PORT = 4444
RAILS_APP_HOST = '127.0.0.1:3001'

# Register new driver
Capybara.register_driver :selenium_remote do |app|
  Capybara::Selenium::Driver.new(
    app,
    browser: :remote,
    url: "http://#{SELENIUM_SERVER}:#{SELENIUM_PORT}/wd/hub",
    desired_capabilities: :chrome # or :firefox
  )
end

# Cucumber hooks, make appropriate translations for Spinach
Before('@selenium-remote') do
  Capybara.javascript_driver = :selenium_remote
  Capybara.app_host = "http://#{RAILS_APP_HOST}"
end

After do
  Capybara.reset_sessions!
  Capybara.use_default_driver
  Capybara.app_host = nil
end

# Make VCR ignore Selenium traffic (if applicable)
VCR.configure do |c|
  c.ignore_request do |request|
    uri = URI(request.uri)
    if uri.host == SELENIUM_SERVER && uri.port == SELENIUM_PORT
      true
    else
      false
    end
  end
end
```

### 3. Configure Vagrant to Expose Test Server's Port
In `Vagrantfile`
```ruby
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.network :forwarded_port, guest: 3001, host: 3001
end
```

## Running Tests
### 1. Start Selenium Server on Mac
```
$ selenium-server
```

### 2. Start Rails Server on Vagrant
```
rails server -p 3001 -e test
```

### 3. Run Tests on Vagrant
```
$ cucumber features/example.feature
```
