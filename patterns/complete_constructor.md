# Complete Constructor

_NOTE: Some of the phrases used here come from "Smalltalk Best Practice Patterns" by Kent Beck, *Constructor Method*

In just about every language that is Object-Oriented (or allows/encourages the use of Object-Oriented techniques), the concept of _instance creation_ is present.

## Assumption(s)

* You have created a class/prototype with an _Intention Revealing Name_
* Programmers who want to use the class will ask, "What does it take to create an instance?"
* There is an interface to instances of your class with other _Intention Revealing Names_

## Discussion

* Single responsibility principle says one method does one thing
* Some languages make constructors a single method, others separate constructors into a class-specific constructor names and instance-specific initializers

One could just use the standard way of creating new instances and then send a serious of messages to put the instance into a useable state.
There is a lot of flexibility in doing this.
However, it is not obvious what state an object needs to be in to successfully use the rest of the interface.

## Solution

Provide obvious instance creation methods that create well-formed instances.
Pass all required parameters to them, giving each of their parameters _Intention Revealing Names_.

Users should not be able to create an instance that they can not use without sending a bunch of other messages to set it up before you send it further instructions.
I.e. they should not expect an error to occur when sending a message to an object that they just constructed.
And, of course, the Complete Constructor method does nothing else besides construct the object.
It would not have side effects like modifying one of the objects that was sent in as a parameter, or automatically call another public non-setter method.

## Examples

### Ruby

The initializer should give you an object that you can then send messages to in order to make things happen.

```
class Thing
  def initialize(name)
    @name = name
  end

  def doYourThing
    ...
  end
end
```

So, without having to read the implementation details of any of the methods, one who would like to use the Thing class would write…
```
thing = Thing.new(name)
thing.doYourThing
```
vs.
```
thing = Thing.new
thing.name = name
thing.doYourThing
```
vs.
```
thing = Thing.new(name) #which after it creates the instance of thing authomatically sends :doYourThing
```

The following:
```
numberArray = %w(1 2 3)
thing = AnotherThing.new(numberArray)
```
should not modify numberArray (e.g. doing a `pop`) on the numberArray inside the Constructor/Initializer

## JavaScript

There are a variety of decent articles to teach about Constructors in JavaScript, including:

* [Some Javascript constructor patterns, and when to use them](http://www.samselikoff.com/blog/some-Javascript-constructor-patterns/) - written November 14, 2013 but still a good overview
* [JavaScript Tutorial OOP Patterns](http://javascript.info/tutorial/oop)
