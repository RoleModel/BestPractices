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

All systems have a context: the real life problem it is meant to solve.  Systems cover at least one problem space or domain, but can cover more than one.
> "Naming classes is your biggest billboard for communicating about your system.  The first thing readers will look at when they look at your code is the names of the classes. Those names will go beyond your code. Insidiously, they leak into everyday conversation...
Good class names provide insight into the purpose and design of a system.  They reveal underlying metaphors. They communicate themes and variations.
They break the system into parts and show how the parts get put back together."
>
> p. 61, Classes, Smalltalk Best Practice Patterns, Kent Beck

In your programming literature, class names are the subjects of your sentences.

Just like systems have a context, all methods have a context, too. For methods within classes, the method's class naturally provides the context for the method. In a pure object-oriented system, methods are always in the context of an instance of a class or the class itself.

The method signatures are the verbs of your programming literature.

Inside the methods are the implementation.  They draw their context from the method signatures inside the context of a class.

This is where the sentences and paragraphs are put together.  Messages are sent to objects.

If you use _Intention Revealing Names_ for classes and method signatures, the implementation can read almost like natural language. Really.

## Solution

In order to allow readers to grok your code at the Conceptual, Specification, and Implementation levels,
You must write your code with these three levels of thinking in mind at all times.
* _Conceptual_ should be clear from reading class names alone.
* _Specification_ should be clear from reading method signatures.
* _Implementation_ should be clear from reading method details that follow the conceptual and specification naming schemes.

Classes should be named to convey their purpose and answer the question, `What is this component responsible for?`
Typically these are nouns or short noun phrases that further qualify the context the main noun is appropriate in. For example, you might have a class hierarchy like this:
```
Frame
    |
  StructuralFrame
        |        \
    RoofFrame    DeckFrame
```
In this example, StructuralFrame's context and singular responsibility should be a subset of Frame's context and responsibility. Likewise, DeckFrame's and RoofFrame's context and responsibility should be a subset of StructuralFrame's.

Method signatures should indicate `What command does this execute?` or `What question does this answer?` without having to read the implementation details.
Parameter's names should be suggestive of their type (e.g. ```name``` suggests a string, not an array).

Once you are working on the implementation of a method, exploit the power of class names (conceptual thinking level) and method signatures (specification thinking level). You can exploit the power of these two things by using instance and local variable names suggestive of their role (implementation thinking level).

Someone who reads your implementation likely has two questions in mind: `What information does the component manage?` and
`How does it execute the commands and answer the questions specified in its interface?` Name your instance and local variables (or properties) and design your implementation in such a way as to respond clearly to those two questions.

For example, the initialize method should use either named or keyword arguments (not a hash of "attributes"). It should be clear from reading the method signature how one initializes an instance. Someone should not have to comb through the implementation or know the names of instance variables to figure out how to call the method successfully.

## Examples

### Ruby
Use
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

### JavaScript (es5)
Use
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

### Javascript (es6)
Use
```javascript
class PlayingCard {
  constructor(rank, suit) {
    this._rank = rank
    this._suit = suit
  }
}
```
but NOT implicit arguments
```js
class PlayingCard {
  constructor() {
    this._rank = arguments[0];
    this._suit = arguments[1];
  }
}
```
and NOT arguments as a generic object/hash
```js
class PlayingCard {
  constructor(attributes) {
    this._rank = attributes.rank;
    this._suit = attributes.suit;    
  }
}
```
