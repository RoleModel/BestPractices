# Using Code Linters on Rails

## Rubocop
* [Rubocop Documentation](http://rubocop.readthedocs.io/en/latest/)
* [Rubocop Shared Config](https://github.com/RoleModel/shared_rubocop)

### Create the config file
Create a `.rubocop.yml` config file in the root of your project:
```
inherit_from:
  - https://raw.githubusercontent.com/RoleModel/shared_rubocop/master/.rubocop.yml

AllCops:
  TargetRubyVersion: 2.2
```

When Rubocop is downloading the remote shared config file, it puts it in the
project's root directory. We'll want to add it to `.gitignore`:

```
# Ignore Rubocop's local copy of our shared Rubocop config
.rubocop-https*
```

### Install Rubocop
Installing the gem under development and test environments allows your local,
as well as Sempahore or other CI services, to be able to run Rubocop.
```
group :development, :test do
  gem 'rubocop', require: false
end
```
And run `bundle` to install

### Running Rubocop
Assuming all config files are set up as specified above, and the gem is installed,
running Rubocop in various forms can be done as follows:

#### Local
```
bundle exec rubocop
```

#### Editor Plugins


#### Semaphore / Other CI

```
bundle exec rubocop
```

You can also tell Semaphore to only exit with a failing error code on ERROR and
above by specifying a `--fail-level` argument:

```
bundle exec rubocop --fail-level ERROR
```

## ESLint
* [ESLint Documentation](http://eslint.org/docs/user-guide)

### Create the config file
You'll want to copy these two files into your project directory:
* [.eslintrc.js](https://github.com/RoleModel/almanac/blob/add_rubocop_scss_and_eslint/.eslintrc.js)
* [.eslintignore](https://github.com/RoleModel/almanac/blob/add_rubocop_scss_and_eslint/.eslintignore)

* Note: Need to update various [environments](http://eslint.org/docs/user-guide/configuring#specifying-environments) (i.e. jQuery)

### Rails

#### Install ESLint
Follow the directions for [eslint-rails](https://github.com/appfolio/eslint-rails)
setup. This includes a different location for your config files!
```
group :development, :test do
  gem 'eslint-rails'
end
```

### Stand Alone

#### Install ESLint
```
npm install -g eslint
```

#### Running ESLint

##### Local
```
# Run ESLint, showing Errors and Warnings
eslint '**/*.js'
# Only show Errors (ignore Warnings)
eslint --quiet '**/*.js'
```

##### Editor Plugins

##### Semaphore / Other CI
You can run either of the Local commands above on Semaphore / CI environments.
However, if you want to pass the build, regardless of any errors:
```
eslint '**/*.js' || echo "Please clean up any errors"
```

## SCSS Lint
* [SCSS Lint Documentation](https://github.com/brigade/scss-lint)

### Configuration
We're currently using the default config file. No action required at this time.

### Install SCSS Lint
```
group :development, :test do
  gem 'scss_lint', require: false
end
```

### Running SCSS Lint

#### Local
```
scss-lint
```

#### Editor Plugins

#### Semaphore / Other CI
```
scss-lint
```
