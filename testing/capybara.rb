BROWSERSTACK_HUB_HOST = 'hub.browserstack.com'
BROWSERSTACK_USERNAME = 'samneely1'
BROWSERSTACK_AUTHKEY = 'abcd1234'

SELENIUM_SERVER_APP_DOMAIN = '127.0.0.1'
SELENIUM_SERVER_APP_PORT = '3001'

BROWSERS = JSON.parse(File.read(Rails.root.join('spec', 'browsers.json')))

def register_drivers!
  selenium_url = "https://#{BROWSERSTACK_USERNAME}:#{BROWSERSTACK_AUTHKEY}@#{BROWSERSTACK_HUB_HOST}/wd/hub/"

  BROWSERS.each do |name, browser|
    capabilities = Selenium::WebDriver::Remote::Capabilities.new

    capabilities['os'] = browser['os']
    capabilities['os_version'] = browser['os_version']
    capabilities['browser'] = browser['browser']
    capabilities['browser_version'] = browser['browser_version']
    capabilities['browserstack.debug'] = true
    capabilities['browserstack.local'] = true
    capabilities['takeScreenshot'] = true
    capabilities['project'] = 'Your project'

    Capybara.register_driver(name.to_sym) do |app|
      Capybara::Selenium::Driver.new(
        app,
        browser: :remote,
        url: selenium_url,
        desired_capabilities: capabilities
      )
    end

    Capybara.server_port = SELENIUM_SERVER_APP_PORT
    Capybara.server_host = '0.0.0.0'
    Capybara.app_host = "http://#{SELENIUM_SERVER_APP_DOMAIN}:#{SELENIUM_SERVER_APP_PORT}"
  end
end

RSpec.configure do |config|
  register_drivers!
end

Spinach.hooks.on_tag('javascript') do
  register_drivers!
end
