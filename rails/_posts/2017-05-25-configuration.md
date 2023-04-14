---
layout: post
title:  "Configuration"
date:   2013-10-25 00:00:00 -0400
author: Caleb Woods
approver: Ken Auer
order: 1
---

### Methodology

As we try to follow the [12 Factor](http://12factor.net/config) approach to configuration, we've settled on the following strategy for declaring `ENV` variables to be used in our standard Rails configuration.

All configuration values such as database connection and external API credentials should be declared in the `env.rb` file that lives at the root of the Rails project. These declarations will have values set that work with our standard development setup and are safe to check into source control.  Below is a brief example.

```ruby
# Local override
dotenv = File.expand_path("../.env_overrides.rb", __FILE__)
require dotenv if File.exist?(dotenv)

ENV["RAILS_ENV"] ||= "development"

ENV["DATABASE_ADAPTER"] ||= "postgresql"
ENV["DATABASE_NAME"] ||= "griefnet_#{ENV["RAILS_ENV"]}"
ENV["DATABASE_USER"] ||= "root"
ENV["DATABASE_PASSWORD"] ||= ""
ENV["DATABASE_ENCODING"] ||= "utf8"
ENV["DATABASE_HOST"] ||= "localhost"
ENV["DATABASE_POOL"] ||= "5"

ENV["POSTGRES_INTERACTIVE"] ||= "psql"
ENV["DEVELOPMENT_PORT"] ||= "7100"

ENV["MANDRILL_USERNAME"] ||= ""
ENV["MANDRILL_PASSWORD"] ||= ""
```

### Overriding ENV variables

Obviously the default values that are set in `env.rb` will not work for every development setup and definitely won't be the values the we want to use in production.  For those reasons the top of the `env.rb` should always include a statement which checks for the presence of a `.env_overrides.rb` file, which if it exists will be loaded and set the appropriate config values.

Because the standard format of the `env.rb` file is to use the `||=` operator to set the default values. If the value has been set else where, either in `.env_overrides.rb` or somewhere else, then the default value will not override what is already set.

It should be noted that the `.env_overrides.rb` **should not** be checked into source control and **should** be a part of the .gitinore file.

### How to Use

To have access to all your configuration values through out your Rails app, the following line should be added to the top of your `application.rb` file.

```ruby
require File.expand_path('../../env', __FILE__)
```

Once that is in place you can use your config values in files like `config/database.yml` just like the example below which allows the `config/database.yml` file to be checked into source control.

```ruby
default: &default
  adapter: <%= ENV["DATABASE_ADAPTER"] %>
  database: <%= ENV["DATABASE_NAME"] %>
  username: <%= ENV["DATABASE_USER"] %>
  password: <%= ENV["DATABASE_PASSWORD"] %>
  pool: <%= ENV["DATABASE_POOL"] %>
  encoding: <%= ENV["DATABASE_ENCODING"] %>
  host: <%= ENV["DATABASE_HOST"] %>

development:
  <<: *default

test: &test
  <<: *default
  database: sample_test

production:
  <<: *default

cucumber:
  <<: *test
```

### Gotchas

Because we typically set the `RAILS_ENV` variable in `env.rb` to `development` so it's value can be used in other configuration options the following changes should be made to your `Rakefile` to be able to run your tests through normal rake tasks such as `rake spec`.

```ruby
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Sample::Application.load_tasks

task :test_environment do
  ENV['RAILS_ENV'] = 'test'
end

task :spec => [:test_environment]
```
