[Home](../README.md)

# Project README Best Practices

### Project lifecycle and the README

Project-level events are often natural times to think about the README.

* When a project is created, review the README template (see below) for inspiration.

* When a person leaves a project or the project is put on hold (e.g. after a planning and exploration phase), that person should review the README to ensure learning is appropriately captured.

* When a person joins a project, they should change any confusing parts of the README and add any missing information.

### Additional Documentation

Any additional documentation outside of the README should be in a `docs/` subdirectory. Those files should include documentation for setting up certificates (`certificates.md`), integration with payment gateways (`ecommerce.md`), security concerns (`security_concerns.md`), a project history (`project_history.md`), an application change log (`change_log.md`), a dictionary (`terms.md`), and a frequently asked questions section (`faq.md`). Other markdown files may become necessary (or useful), but all files should be linked from within the `README.md` file.

Some projects, especially those with a high expected degree of turnover or architecture collaboration across teams, may also benefit from the approach outlined here: [Documenting Architecture Decisions](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).

### README.md template

The remainder of this document is a template for new READMEs, with a variety of useful sections. Not all sections will make sense for every project, but the template is intended to help remind people of categories of useful information to include. (Note before copying that triple-backtick lines have been escaped to avoid presentation issues when viewing this best practice, but the escaping should be removed in a real README.md file.)

---

```
# Overview
## Name and aliases
The project is named "<name>". Some will refer to it as "<alias1>" or "<alias2>".

## Purpose
The system is designed to solve the problem of ... Users had the problem, but this system resolves it by ...

## Technologies
### Chosen
* Ruby on Rails
* Postgres
* nginx
* unicorn

### Tried and rejected
* Node.js - Not enough internal experience.
* Mongo - Needed to use a relational database for reporting.
* Websphere - Cost
* webrick - Application servers are using newer technology now.

## Technology relationships
<insert image here>

## Supported browsers
The customer states that only Chrome will be used.

# How to set up the project
## External tool installation
\```
brew update --system
brew upgrade ruby-build
git clone http://github.com/RoleModel/<project>
cd <project>
rbenv install
gem install bundler
bundle install
\```

## How to run locally
`rails s`

## How to run tests
`rake`

## Editor plugins
* Rubocop linter

## Troubleshooting information
* [App Status Page](http://app.<applicationname>.com/_ping) will give you information about what is running.
* Alternatively, you can ssh in and check that the application server and web server are both running.

# Branching strategy
To begin a new feature run, `git checkout -b <branchname>`.
When finished with the feature and the code has been reviewed, the commits should be squashed before merging. See [RoleModel Best Practices](https://github.com/RoleModel/BestPractices) for more information.

# List of background processes
* Nightly database backup and export
* Monthly invoicing on last business day of the month

# Links to:
## [Git repo](http://github.com/RoleModel/)
## [Task management system](http://trello.com)
## [Staging](http://staging.<applicationname>.com)
## [Production](http://app.<applicationname>.com)
## External services
* [HoneyBadger](http://honeybadger.io)
* [Skylight](http://skylight.io)
* [SendGrid](http://sendgrid.com/RoleModel)
* [Heroku](http://herokuapp.com)

## [CI](http://semaphoreci.com/RoleModel)
## [Core project presentation](http://docs.google.com)
## [List of contributors](http://github.com/RoleModel)
## [Change log](file://./docs/change_log.md)

# Deployment
## Strategy/process/commands
`master` is always deployed to production. The `staging` branch is deployed to staging.
\```
git checkout master
git tag 2016-05-16 # <date> YYYY-MM-DD
git push --tags
\```
Deployment is done with [Ansible](http://ansible.com).
`ansible <command goes here>`

## Description of host(s), DNS, certificate authority
The application is deployed to Heroku. They are also hosting the DNS. We certificate was received from [Let's Encrypt](https://letsencrypt.org/).

## ssh information
`ssh user@hostname.com`

# Customer contacts
* Joe Johnson - 919-555-1212
* Larry Anderson - 919-555-1213

# Copyright & licensing
Copyright (c) 2016 Closed Source @CompanyName
```
