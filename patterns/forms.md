# Forms

## Why

Forms are crucial to nearly all apps.  They tend to comprise much of an app's view layer complexity.  For that reason, consist design & user interaction is very important.

## Tools

[SimpleForm](https://github.com/heartcombo/simple_form)

## Useful Patterns (embrace these)

* ActiveModel Form Objects <!-- TODO: concrete examples -->
* Lean on existing [Policies](authorization.md) for collection scoping
* custom inputs <!-- TODO: link to currency input example -->

## Code Smells (avoid these)

1. Passing lots of configuration options into input helpers. In most cases, `f.input :attr_name` should be sufficient.
   * If you find yourself passing the same options over and over again, those options probably belong in `config/initializers/simpleform.rb`
2. Explicitly setting the form action (`url` option)
   * <!-- TODO: explain (tldr; resource routing/ RESTful controllers, etc) -->
3. Custom Stimulus controllers used on only 1 form
   * This boils down to consistency.  Forms are often where we want to leverage JavaScript to enhance the user experience.  However, custom behavior should feel consistent between forms & Stimulus is flexible enough that you should be able to reuse the same controller between forms. So long as your forms adhere to the other patterns mentioned in this document.
4. `turbo: false`
   * Turbo is a core component of modern Rails apps.  Turning it off is an indicator that something is broken.

## Resources

* [ActionView::FormBuilder docs](https://api.rubyonrails.org/classes/ActionView/Helpers/FormBuilder.html)
* [Forms Chow Talk](https://rm-almanac.herokuapp.com/presentations/388)
* [RoleModel Rails Generator](https://github.com/RoleModel/rolemodel_rails/tree/master/lib/generators/rolemodel/simple_form)
