BROWSERSTACK_AUTHKEY = 'abcd1234'
BROWSERS = JSON.parse(File.read(Rails.root.join('spec', 'browsers.json')))
JAVASCRIPT_DRIVER = 'chrome_osx'

SELENIUM_SERVER_APP_DOMAIN = '127.0.0.1'
SELENIUM_SERVER_APP_PORT = '3001'

desc 'Run all cross browser tests in parallel'
task :cross_browser, [:files] => [:environment, 'cross_browser:tunnel', 'cross_browser:close_tunnel'] do
  args ||= {}
  args[:files] ||= ''

  Rake::Task["cross_browser:rspec:#{JAVASCRIPT_DRIVER}"].invoke(args[:files])
  Rake::Task["cross_browser:spinach:#{JAVASCRIPT_DRIVER}"].invoke(args[:files])
end

namespace :cross_browser do
  BROWSERS.keys.each do |browser_name|
    browser_display_name = BROWSERS[browser_name]['human'] || browser_name

    desc "cross-browser RSpec test in #{browser_display_name}"
    task "rspec:#{browser_name}", [:files] => [:environment, :tunnel, :close_tunnel] do |_, args|
      args ||= {}
      args[:files] ||= ''

      puts "Cross-browser RSpec testing against #{browser_display_name}."

      task = RSpec::Core::RakeTask.new
      task.rspec_opts = ["-r #{Rails.root.join('spec', 'spec_helper.rb')}"]
      task.rspec_opts << '--tag js'

      ENV['SPEC'] = args[:files] if args[:files].present?
      puts task.send(:spec_command)
      system(task.send(:spec_command))
    end

    desc "cross-browser Spinach test in #{browser_display_name}"
    task "spinach:#{browser_name}", [:files] => [:environment, :tunnel, :close_tunnel] do |_, args|
      args ||= {}
      args[:files] ||= ''

      puts "Cross-browser Spinach testing against #{browser_display_name}."

      spinach_command = 'spinach --tag @javascript'

      ENV['SPEC'] = args[:files] if args[:files].present?
      puts spinach_command
      system(spinach_command)
    end
  end

  desc 'start BrowserStack tunnel'
  task :tunnel do
    Thread.new do
      system("./BrowserStackLocal --key #{BROWSERSTACK_AUTHKEY} #{SELENIUM_SERVER_APP_DOMAIN},#{SELENIUM_SERVER_APP_PORT}")
    end
    sleep 5
  end

  desc 'close BrowserStack tunnel'
  task :close_tunnel do
    at_exit do
      puts 'Killing off BrowserStack'
      system('killall BrowserStackLocal')
    end
  end
end

