# Complete Constructor

_NOTE: Some of the phrases used here come from "Smalltalk Best Practice Patterns" by Kent Beck, *Constructor Method*_

The concept of _instance creation_ exists in just about every language that is Object-Oriented or allows/encourages the use of Object-Oriented techniques.

## Assumption(s)

* You have created a class/prototype with an _Intention Revealing Name_
* Programmers who want to use the class will ask, "What does it take to create an instance?"
* Your class has an interface to its instances, and, this interface uses _Intention Revealing Names_

## Discussion

* The _Single Responsibility Principle_ means that each method should do just one thing
* Some languages make constructors a single method. Others separate constructors into class-specific constructor names and instance-specific initializers.

In general, keep constructors as minimal as possible. The single responsibility of a constructor is to make an instance, so a constructor should only include the minimal logic needed to create an instance than can successfully use the rest of the interface.

One could argue that it is best to keep the constructor completely empty, and thus require the programmer to add a series of messages after construction to put the instance into a fully usable state. There is a lot of flexibility in doing this. However, it is not always obvious what state an object needs to be in to successfully use the rest of the interface. So a strictly empty constructor can leave a lot of room for programmer error.

## Solution

Provide obvious instance creation methods that create well-formed instances. Therefore, the constructor's single responsibility is, "To create a _fully-formed_ instance."
Pass all required parameters to the constructor, giving each of its parameters _Intention Revealing Names_.

Essentially, your constructor should prevent users from creating instances they cannot use. If a user needs to send messages post-construction to finish setting up the object before they can send it further instructions, something is missing from your constructor. It should be impossible for users to get an error when sending a message to an object they just constructed.

And, of course, your constructor should do nothing else besides construct the object. Side effects like these should never happen in a constructor:
* modifying one of the objects that was sent in as a parameter
* automatically calling another public, non-setter method

Lastly, a complete constructor should use _keyword arguments_ if supported by the language. In the following examples, Ruby supports keyword arguments but Javascript does not.

## Examples

### Ruby

The initializer should give you an object that you can then send messages to in order to make things happen.

```ruby
class Thing
  def initialize(name:)
    @name = name
  end

  def doYourThing
    ...
  end
end
```

So, without having to read the implementation details of any of the methods, you should be able to use the Thing class like so:
```ruby
thing = Thing.new(name)
thing.doYourThing
```

You should NOT have to call something after the constructor to use ```doYourThing```:
```ruby
thing = Thing.new
thing.name = name # should have been in the constructor
thing.doYourThing
```

The constructor should NOT call ```doYourThing```:
```ruby
class Thing
  def initialize(name:)
    @name = name
    doYourThing # constructor (wrongly) calls thing.doYourThing
  end
  ...
end
thing = Thing.new(name)
```

The constructor should not modify an object passed as a parameter:
```ruby
numberArray = %w(1 2 3)
thing = AnotherThing.new(numberArray)
```
`AnotherThing` should not modify numberArray (e.g. doing a `pop` on numberArray) inside the Constructor/Initializer

### JavaScript (es5)

There are a variety of decent articles to teach about Constructors in JavaScript, including:
* [Some Javascript constructor patterns, and when to use them](http://www.samselikoff.com/blog/some-Javascript-constructor-patterns/) - written November 14, 2013 but still a good overview
* [JavaScript Tutorial OOP Patterns](http://javascript.info/tutorial/oop)

```js
function Thing(name) {
  this._name = name;
}

Thing.prototype.doYourThing = function() {
  ...
}
```
So, without having to read the implementation details of any of the methods, you should be able to use the Thing class like so:
```js
var thing = new Thing(name);
thing.doYourThing();
```

You should NOT have to call something after the constructor to use ```doYourThing```:
```js
var thing = new Thing();
thing._name = name; // should have been in the constructor
thing.doYourThing();
```

The constructor should NOT call ```doYourThing```:
```js
function Thing(name) {
  this._name = name
  this.doYourThing() // constructor (wrongly) calls thing.doYourThing
}
var thing = new Thing(name);
```

The constructor should not modify an object passed as a parameter:
```js
var numberArray = [1, 2, 3];
var thing = new AnotherThing(numberArray);
```
`AnotherThing` should not modify numberArray (e.g. doing a `pop` on numberArray) inside the Constructor/Initializer

### Javascript (es6)

There are a variety of decent articles to teach about Constructors in JavaScript, including:
* [Some Javascript constructor patterns, and when to use them](http://www.samselikoff.com/blog/some-Javascript-constructor-patterns/) - written November 14, 2013 but still a good overview
* [JavaScript Tutorial OOP Patterns](http://javascript.info/tutorial/oop)

```js
class Thing
  constructor(name) {
    this._name = name;
  }
  doYourThing() {
    ...
  }
}
```
So, without having to read the implementation details of any of the methods, you should be able to use the Thing class like so:
```js
let thing = new Thing(name);
thing.doYourThing();
```

You should NOT have to call something after the constructor to use ```doYourThing```:
```js
let thing = new Thing();
thing._name = name; // should have been in the constructor
thing.doYourThing();
```

The constructor should NOT call ```doYourThing```:
```js
class Thing {
  constructor(name) {
    this._name = name
    this.doYourThing() // constructor (wrongly) calls thing.doYourThing
  }
  ...
}
let thing = new Thing(name);
```

The constructor should not modify an object passed as a parameter:
```js
let numberArray = [1, 2, 3];
let thing = new AnotherThing(numberArray);
```
`AnotherThing` should not modify numberArray (e.g. doing a `pop` on numberArray) inside the Constructor/Initializer
