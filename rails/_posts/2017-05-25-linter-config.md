---
layout: post
title:  "Linter Config"
date:   2017-05-25 00:00:06 -0400
---

## Using Code Linters on Rails

## Rake Task
A Rake Task can be set up to run all of the linters contained in this document.
The RoleModel Rails Template contains a copy of this file, with a configuration
setting for determining if the `abort` line should be inserted into the task.

This Rake Task assumes that the gems for running the linters have been set up
according to the documentation below.

### Running Linters
The Lint Rake file will provide the following Rake tasks:

```bash
# Runs all linters, configurable pass/fail in task code
bundle exec rake lint
# Linters individually, always return pass/fail exit codes
bundle exec rake bundle:audit
bundle exec rake rubocop
bundle exec rake scss_lint
bundle exec rake eslint:run
```

### `lint.rake`

[ERB Templated `lint.rake` File](https://raw.githubusercontent.com/RoleModel/Rails-Template/master/templates/lib/tasks/lint.rake.tt)

## Bundler Audit
Bundler Audit reviews your Gemfile for any gems which need to be updated for
security notices.

* [Bundler-Audit Documentation](https://github.com/rubysec/bundler-audit)

### Installing Bundler Audit
```ruby
group :development, :test do
  gem 'bundler-audit'
end
```

### Running Bundler Audit
```bash
bundle-audit check --update
```

## Rubocop
Rubocop will determine if your code matches the Ruby style guide (or your
project's configured adjustments).

* [Rubocop Documentation](http://rubocop.readthedocs.io/en/latest/)
* [Rubocop Shared Config](https://github.com/RoleModel/shared_rubocop)

### Create the config file
Create a `.rubocop.yml` config file in the root of your project:
```yaml
inherit_from:
  - https://raw.githubusercontent.com/RoleModel/shared_rubocop/master/.rubocop.yml

# This is a minimum Rubocop checks against, not necessarily what is actually
#   used by the project.
AllCops:
  TargetRubyVersion: 2.2
```

When Rubocop is downloading the remote shared config file, it puts it in the
project's root directory. We'll want to add it to `.gitignore`:

```bash
# Ignore Rubocop's local copy of our shared Rubocop config
.rubocop-https*
```

### Install Rubocop
Installing the gem under development and test environments allows your local,
as well as Sempahore or other CI services, to be able to run Rubocop.
```ruby
group :development, :test do
  gem 'rubocop', require: false
end
```
And run `bundle` to install

### Running Rubocop
Assuming all config files are set up as specified above, and the gem is installed,
running Rubocop in various forms can be done as follows:

#### Local
```bash
bundle exec rubocop
```

#### Editor Plugins
* [Atom](https://atom.io/packages/linter-rubocop)

#### Semaphore / Other CI

```bash
bundle exec rubocop
```

You can also tell Semaphore to only exit with a failing error code on ERROR and
above by specifying a `--fail-level` argument:

```bash
bundle exec rubocop --fail-level ERROR
```

Additionally it can be useful to have Rubocop generate a "TODO" file for the current violations.  This ensures things pass in the current state and gives a nice list of items to fix.

```bash
bundle exec rubocop --auto-gen-config
```

```
$ cat .rubocop_todo.yml
# Offense count: 3
# Configuration parameters: MinBodyLength.
Style/GuardClause:
  Enabled: false

# Offense count: 3
# Cop supports --auto-correct.
# Configuration parameters: EnforcedStyle, SupportedStyles.
# SupportedStyles: line_count_dependent, lambda, literal
Style/Lambda:
  Enabled: false
```

## ESLint
* [ESLint Documentation](http://eslint.org/docs/user-guide)

### Create the config file
You'll want to copy these two files into your project directory:
* [.eslintrc.js](https://github.com/RoleModel/Rails-Template/blob/master/templates/.eslintrc.js)
* [.eslintignore](https://github.com/RoleModel/Rails-Template/blob/master/templates/.eslintignore)

* Note: Need to update various [environments](http://eslint.org/docs/user-guide/configuring#specifying-environments) (i.e. jQuery)

### Rails

#### Install ESLint
Follow the directions for [eslint-rails](https://github.com/appfolio/eslint-rails)
setup. This includes a different location for your config files!
```ruby
group :development, :test do
  gem 'eslint-rails'
end
```

### Stand Alone

#### Install ESLint
```bash
npm install -g eslint
```

#### Running ESLint

##### Local
```bash
# Run ESLint, showing Errors and Warnings
eslint '**/*.js'
# Only show Errors (ignore Warnings)
eslint --quiet '**/*.js'
```

##### Editor Plugins
* [Atom](https://atom.io/packages/linter-eslint)

##### Semaphore / Other CI
You can run either of the Local commands above on Semaphore / CI environments.
However, if you want to pass the build, regardless of any errors:
```bash
eslint '**/*.js' || echo "Please clean up any errors"
```

## SCSS Lint
* [SCSS Lint Documentation](https://github.com/brigade/scss-lint)

### Configuration
We're currently using the default config file. No action required at this time.

### Install SCSS Lint
```ruby
group :development, :test do
  gem 'scss_lint', require: false
end
```

### Running SCSS Lint

#### Local
```bash
scss-lint
```

#### Editor Plugins
* [Atom](https://atom.io/packages/linter-scss-lint)

#### Semaphore / Other CI

```bash
scss-lint
```
