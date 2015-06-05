## [Home](../README.md)

# Centralized Logging

Logging to a central server is done through *syslog*. We are using *papertrail* to host our logs.

## Application Logging

### Heroku

```sh
heroku drains:add syslog://SUBDOMAIN.papertrailapp.com:PORT
```

### Rails

Add `remote_syslog_logger` to `:production, :staging` group in `Gemfile`

```ruby
group :production, :staging do
  gem 'remote_syslog_logger'
end
```

Add logger and log level to `config/environments/production.rb` and `config/environments/staging.rb`

```ruby
config.logger = RemoteSyslogLogger.new('SUBDOMAIN.papertrailapp.com', PORT, program: "rails-#{Rails.application.class.name.split('::').first}")
config.logger.level = Logger::Severity::INFO
```

## Server Logging

As `root` edit `/etc/rsyslog.conf`
Add the following line:

```
*.*    @SUBDOMAIN.papertrailapp.com:PORT
```

once you have added that restart the syslog process

```sh
service rsyslog restart
```

## Checking logs

Log into https://papertrailapp.com
Select system
Optionally “Create Group” and select a system filter (or systems individually)
