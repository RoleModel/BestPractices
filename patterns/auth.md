# Authorization

## Rationale

Authorization answers the question: am I allowed to do that? Not wanting to introduce a lot of complexity in controllers, services, and views, we introduce an authorization model. This model is the abstraction used for all the logic pertaining to authorization. To implement this, we can extract policy objects from our domain model entities or resources. Policy objects encapsulate business rules describing which actions can be performed on a particular resource. For instance, if we have a `Post` model, we might implement a `PostPolicy` to handle authorization logic around posts.

## Tools

* [Pundit](https://github.com/varvet/pundit) is most common and well received. Being relatively simple, it lacks features such as multiple scopes and custom error messages.

* [Action Policy](https://github.com/palkan/action_policy) is similar to Pundit and provides those missing features.

## Better Policies

### Keep authorization logic outside of controllers

🟥 Bad
```ruby
class PostsController < ApplicationController
  def destroy
    post = Post.find(params[:id])
    if post.user_id == current_user.id
      post.destroy	
      redirect_to posts_path
    else
      redirect_to posts_path, alert: 'Forbidden'
    end
  end
end
```

🟩 Good
```ruby
class PostPolicy < ApplicationPolicy
  def destroy?
    record.user_id == user.id
  end
end

class PostsController < ApplicationController
  def destroy
    post = aouthorize Post.find(params[:id])
    if post.destroy	
      redirect_to posts_path
    else
      redirect_to posts_path, alert: 'Forbidden'
    end
  end
end
```

