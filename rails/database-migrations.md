# DB Migrations Best Practices

## Principles

### Use the strong_migrations library
https://github.com/ankane/strong_migrations helps catch many common database migration mistakes, especially when using Postgres.

### Use Rails migrations for simple data migrations
Using Rails' `db:migrate` to migrate data has many advantages over custom scripts:

- Rails schema versioning makes it easy to know the status of each migration.
- It's simple for other developers on your team. They only need to `git pull` and then run `db:migrate`.
- Deployment pipelines are usually set up to run data migrations, so there are no extra steps to run.

Of course, there are exceptions to this rule. Super complex data migrations may need more involved scripts.

### Keep migrations runnable for as long as possible
Migrations that break after only a few git commits are a nightmare for teams. This problem is almost always caused by migration code relying on application code like model associations and methods. A migration runs at a single point in time, whereas application code is always changing, so the two get out of sync.

For example, suppose a migration is added to the master branch which uses an association defined on an ActiveRecord model. Two commits later, the association is removed from the ActiveRecord model, but the migration code isn't updated.

Now, another developer rebases his feature branch onto master and attempts to run the pending migration.

Failure. To be specific, a `NoMethodError: undefined method` failure because the association the migration depended on isn't defined on the model anymore, so the migration blows up. 😩

You can avoid this problem by following a simple rule:

> Migrations may only use code defined within their own class.

If you're migrating data and need helper methods or ActiveRecord associations, define them directly in the migration class itself. See the **Use Cases** section below for an example of how to properly use ActiveRecord associations in a migration.


### Do not use migrations to create new data
Use `seeds.rb` or a rake task to populate necessary app data. Otherwise running `db:schema:load` will leave the app's database without the needed data.

### Always test your migrations
Always run the migration, roll it back, and re-run it (`rails db:migrate:redo` is handy for this). This prevents accidentally writing irreversible migrations because you forgot to specify all the needed details the `change` method needs to calculate the reverse of the operation you're running.

If a migration by its nature cannot be rolled back, be explicit about it by raising `IrreversibleMigration` in the `down` method.

Other common gotchas to test for:
- The migration won't run on a fresh database because there was something in the local dev db it was relying on.
- Use realistic production sized data to check for speed.

## Use Cases

### Use ActiveRecord associations in a migration

Existing model:

```ruby
class Tag
  belongs_to :blog_post
end

class BlogPost
  has_many :tags
end
```

You decide for performance reasons to move the tags into an array column on the `blog_posts` table instead of having them in a separate `tags` table.

Write the migration this way:

```ruby
class MoveTags < ActiveRecord::Migration[5.2]
  # Inherit from ActiveRecord::Base instead of ApplicationRecord since the
  # ApplicationRecord is subject to changes as the app changes.
  class Tag < ActiveRecord::Base; end

  class BlogPost < ActiveRecord::Base
    has_many :tags
  end

  def up
    add_column :blog_posts, :categories, :string, array: true

    say("Moving #{Tag.count} tags to #{BlogPost.count} blog posts")

    # Use find_each to minimize memory usage when dealing with many records
    BlogPost.find_each(batch_size: 100) do |blog_post|
      tags = blog_post.tags.pluck(:value)

      # You can never have too much logging when migrating data!
      say("Moving tags #{tags} to BlogPost #{blog_post.id}")

      blog_post.update!(categories: tags)
    end
  end

  def down
    remove_column :blog_posts, :categories
  end
end
```

**Output:**
```
$ bin/rails db:migrate
== 20190604160527 MoveTags: migrating =========================================
-- add_column(:blog_posts, :categories, :string, {:array=>true})
   -> 0.0006s
-- Moving 6 tags to 3 blog posts
-- Moving tags ["tag-0", "tag-1"] to BlogPost 5
-- Moving tags ["tag-0", "tag-1"] to BlogPost 6
-- Moving tags ["tag-0", "tag-1"] to BlogPost 7
== 20190604160527 MoveTags: migrated (0.0259s) ================================
```

A few things to note about this data migration:
- The `MoveTags` migration defines to child classes: `MoveTags::Tag` and `MoveTags::BlogPost`. These classes are completely different than the classes residing in `app/models`. You can even delete the now unused `Tag` class in `app/models` and this migration will still run!
- For brevity, this example doesn't worry about dropping the `tags` table, and the `down` method should be expanded to move the tags from blog posts back to tags.
- Logging is your friend when doing data migrations. Do it early and do it often.

### Heroku review app setup
For Heroku review apps, use the `postdeploy` script to load the database schema and seed the DB with example data. Use the `release` phase in the `Procfile` to run migrations. This is because `postdeploy` _only runs once_ when the review app is created, whereas the `release` phase _runs on every deploy_ to the review app.

Running `db:migrate` in `postdeploy` is not ideal for two reasons:
- It takes longer for Heroku to set up review apps because it has to run every migration from the beginning of time. As the months roll by and more and more migrations are added, it starts to add up.
- It's more brittle. If you follow my recommendation of never using external code in a migration, you might never run into this problem. But as months pass, versions of Rails change, and developers make mistakes, it becomes more laborious to keep a migration from years ago working. A migration is for transitioning a database from one version to the next. Once everyone on your team has run it and you're out of the rollback window, its useful life is over and it's only good for reference.

Here's an example of how to use Heroku's config files (see Heroku's documentation for the latest syntax):

**app.json**
```
{
  "name": "Example Heroku Review App",
  "scripts": {
    "postdeploy": "bundle exec rake db:schema:load db:seed"
  },
}
```

**Procfile**
```
web: bundle exec puma -C config/puma.rb
release: bundle exec rake db:migrate
```
