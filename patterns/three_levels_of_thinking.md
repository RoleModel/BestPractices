# Three Levels of Thinking

_NOTE: This can be found in a different form in our RoleModel Way series of talks._

Whenever we think about our systems there are three levels of thinking:
* Conceptual
* Specification
* Implementation

Each level should be distinct and reflected in our code.

## Assumption(s)

* Code is read more often than it is written
* You understand the importance of _Intention Revealing Names_

## Discussion

All systems have a context.  They cover one or more problem spaces or domains.
> "Naming classes is your biggest billboard for communicating about your system.  The first thing readers will look at when they look at your code is the names of the classes. Those names will go beyond your code. Insidiously, they leak into everyday conversation...
Good class names provide insight into the purpose and design of a system.  They reveal underlying metaphors. They communicate themes and variations.
They break the system into parts and show how the parts get put back together."
>
> p. 61, Classes, Smalltalk Best Practice Patterns, Kent Beck

These are the subjects of your programming literature.

All methods have a context. In a pure object-oriented system, they are always in the context of an instance of a class or the class itself.
The method signatures are the predicates of your programming literature.

Inside the methods are the implementation.  They draw their context from the method signatures inside the context of a class.

This is where the sentences and paragraphs are put together.  Messages are sent to objects.
If _Intention Revealing Names_ are used for classes and method signatures,
the implementation can read almost like natural language.

## Solution

In order to allow readers to grok your code at the Conceptual, Specification, and Implementation levels,
You must write your code with these three levels of thinking in mind at all times.

Classes should be named to convey their purpose and answer the question, `What is this component responsible for?`
Typically these are nouns or short noun phrases that further qualify the context in which the main noun is appropriate.

Method signatures should indicate `What command does this execute?` or `What question does this answer?` without having to read the implementation details.
Parameters should have type suggesting names.

The internal code of a method should exploit the power of the conceptual class names and the specification level method signatures
with role suggesting variable names.
Instance variables (or properties) and the implementation of methods answer the question `What information does the component manage?` and
`How does it execute the commands and answer the questions specified in its interface?`

## Examples

### Ruby

The initialize method should use either named arguments or keyword arguments
so that it is clear how one initializes an instance
without having to read the implementation or knowing the names of instance variables.

```ruby
class PlayingCard
  def initialize(rank, suit)
    @rank, @suit = rank, suit
  end
end
```

or

```ruby
class PlayingCard
  def initialize(rank:, suit:)
    @rank, @suit = rank, suit
  end
end
```

but NOT

```ruby
class PlayingCard
  def initialize(attributes)
    @rank, @suit = attributes[:rank], attributes[:suit]
  end
end
```

### JavaScript

Constructors should use explicitly named arguments
so that it is clear how one initializes an instance of a particular type of object
without having to read the implementation or know the names of the private properties of the object.

```js
function PlayingCard(rank, suit) {
  this._rank = rank;
  this._suit = suit;
}
```

but NOT implicit arguments

```js
function PlayingCard() {
  this._rank = arguments[0];
  this._suit = arguments[1];
}
```

and NOT arguments as a generic object/hash

```js
function PlayingCard(attributes) {
  this._rank = attributes.rank;
  this._suit = attributes.suit;
}
```
