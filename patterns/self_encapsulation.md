# Reusability Through Self-Encapsulation

_NOTE: This was originally written in 1994 and published in the Pattern Languages of Program Design book. The following is an updated version customized for HTML, Ruby and Javascript and altered slightly to use a more widely accepted pattern naming principle (noun phrases) and for readability._

## Introduction

Object-oriented technology has long promised us Reusability as one of its benefits. Champions of object-oriented design have promoted Inheritance as a significant way to achieve that promised Reusability. In real-life projects, however, many people find it difficult to extend existing classes through Inheritance. After they have successfully exploited Inheritance, they find it increasingly difficult to change a class's definition or implementation without wreaking havoc on its subclasses.

We solve this problem using the pattern language presented here. It exploits the notion of Encapsulation--isolating implementation decisions to a small number of methods--to improve the Reusability of classes and hierarchies. I call this technique **self-encapsulation**.

**Self-encapsulation helps programmers avoid many of the difficulties they would otherwise encounter when using Inheritance.**

Programmers have successfully applied this pattern language in Smalltalk and many other object-oriented languages. It is easier to introduce self-encapsulation when implementing new classes from scratch, but self-encapsulation can also be used to refactor existing classes in order to improve their reusability. Examine the context of your class to determine when it is appropriate to apply each of the following individual patterns of self-encapsulation:

## The individual patterns are:

* Behavior-Defined Class
* Abstract State
* Message Layers
* Deferred State Variables
* Encapsulated Concrete State
* Lazy Initialization
* Default Value Method
* The Pattern Language

## Behavior-Defined Class
_**Also Known As: Define Classes by Behavior, Not State**_

### Context:

You are creating a new class. You want your implementation to maximize the Reusability of your class and its subclasses as they evolve.

### Problem:

Typically, we want subclasses to inherit *behavior*. How do we define classes so that behavior is reliable?

### Constraints:

In a collaborating system of objects, the essence of an object is its responsibilities. Other objects rely on it to fulfill these responsibilities. How it fulfills them is relatively unimportant. Even less important is an object's data structure (that is, the number of slots*, the slots' names, and the type of object that is expected to live in those slots). First and foremost, the essence of an object is its responsibilities.

An object fulfills its responsibilities by passing messages*. Programmers usually find it a lot less time-consuming to define message names (protocols) than to define the functional details of how an object responds to them. (Note: I refer here to the time necessary to define these names for the rest of the system. Don't confuse that with the time needed to determine high-quality message names, which should always be done with care.)

Additionally, the object's data structure often plays an important role in how an object responds to the messages it receives. An object cannot do much without eventually manipulating some sort of data. Implementing an object's data structure forces the programmer to make certain trade-offs between memory space and speed. Considering those trade-offs can distract a programmer from a more serious implication of their decisions: **every data structure implemented in a base class affects its subclass.**

Subclasses automatically inherit the data structure of their base class. So, any decisions about data structure are virtually irreversible by subclasses without overriding every base class method that refers to the data structure. Therefore, each time you add detail to the data structure, some implementation options are lost and others imposed on the class and its subclasses. And, the amount of time it takes to refactor anything involving the data structure of a base class is quickly multiplied by the number subclasses affected by the change.

* Slots could refer to storage slots of any kind (memory, database, etc.)
* Passing messages usually, but not always, refers to a method call. Conceptually, any time you ask an object to perform some action or respond to you in any way, you pass it a message and expect a certain response.

### Solution:

The pain of dealing with this scenario make one desperately want to decouple a class' data structure from the list of responsibilities it is duty-bound to fulfill. The first step toward that goal is to define what's on the object's list of responsibilities.

**Therefore, when creating a new class, the first thing you should do is define its public protocol.** Specify its behavior without thinking about its data structure (such as instance variables, class variables, and so on). Defining your object by its public methods, not by its properties.

For example, start with:
```ruby
class Rectangle
	def initialize(x: x, y: y, width: width, height: height)
	end

	def width
	end

	def height
	end

	def area
	end

	def perimeter
	end
end
```
When you define the method names, you are committing the class only to responding to those message names. You are not committing the class to any particular data structure or implementation, both of which could change in the future.

You might not think that, in this example, the implementation of ```area``` would ever change for a rectangle, and that in the case of an immutable object, it would safe to simply assign the area as a property during construction. (Isn't ```area``` always ```width * height``` for a rectangle?) Recently on a project, we had to face just that assumption, when we realized that a 2D rectangle, if suspended in 3D not 2D space, actually had two kinds of 2D area: area when laid flat and area when viewed aerially (which would be equal to or less than the other area). Because we were more committed to the behavior of calculating area than the underlying data structure, we were able to make changes with minimal side effects.

The point is, if you define a class by its behavior and not by its data structure, you minimize the upfront commitment and maximize the future possibilities and flexibility of the class.

## Abstract State
_**Also Known As: Implement Behavior with Abstract State**_

### Context:

You have identified the public behavior of a class (see Behavior-Defined Class above) but not yet implemented its behavior.

### Problem:

How do we approach implementation without prematurely and unnecessarily forcing data structure design decisions on subclasses?

### Constraints:

After you identifying the names and intents of protocols, your next step is to implement their behavior. For many method implementations, you will need access to the implied state of the object. For example, in order to calculate the area of a Circle, you need access to its radius.

Many programmers' first instinct when they see the need for state is to define a data structure (e.g., ```this.radius = 10;``` in javascript). Don't do that! You can easily end up with a bunch of unnecessary state variables that you'd be better off deriving from existing variables or methods. For example, you can derive a Circle's diameter from its radius, so adding a second state variable for its diameter is unnecessary. Remember, every detail introduced into the data structure reduces the flexibility of subclass implementations.

### Solution:

**If you need implied state information in order to implement a behavior, define a message that returns that state instead of defining a variable.**

For example, encapsulate the radius state inside a radius message. Don't call the state variable directly:

```ruby
class Circle
	def radius # state-encapsulating method that returns a message
	end

	def pi # state-encapsulating method that returns a message
	end

	def area
		return radius ** 2 * pi # gets the state information from the state-encapsulating methods
	end
end
```

So far, you've implied that methods for radius and pi must be implemented, but you still have not yet determined any particular data structure. The details for how the radius is retrieved (or derived) will be determined in one place. And if it ever needs to be changed, it will be changed in one place. The same is true for the details of pi: how pi is retrieved and what precision is used are determined and changed in one place. In short, you can modify implementation details and the changes will automatically proliferate through the rest of the class without further intervention.

_Note: there may already be a global variable for pi that would alleviate the need to encapsulate this constant in a method. Consider whether constants could require modification due to potential constraints imposed upon the system; for example, precision, performance, special cases, and so on._

This technique proves incredibly valuable on complex projects. For example, we had a javascript-based construction project with 1500+ lines of code for each class. These classes contained basically the computerized version of construction objects and math that you might imagine carpenters doing on-site. For example, we had something like:
```javascript
class Board {
	area() {
		return this.length() * this.width()
	}
}

```
Then, we had to add:
```javascript
class Board
	cutToShape(overlappingShape) { // overlappingShape be of any shape
		...
	}
}
```
Having Boards that were cookie-cutter-cut by overlap with other shapes meant Board were no longer guaranteed to be rectangular. That really changed how we needed to calculate the area. Luckily, we only calculated the area in one place: the implementation of the ```area``` function, which we could modify like so:

```javascript
class Board
	area() {
		var area;
		this.vertices().forEach((vertex)=> {
			// calculate area using vertices-based formula that works with any polygon
		});
		return area;
	}
}
```
Making this change would have been far more difficult if we had unnecessary state in the form of an instance variable like ```this.area```.

This same technique can also be used for "indexed" state by identifying abstract state messages. For example, you could create a method like ```Rectangle.leftEdge()``` to avoid having to call ```Rectangle.edges()[0]```. The second one is more fragile, since it depends on the index and could break should you ever introduce, for example, ```Rectangle.rotate90DegreesClockwise()```. Instead, encapsulate the abstract state, so if you later change it, you only have to change it in one place.

## Message Layers
_**Also Known As: Identify Message Layers**_

### Context:

* You have defined and implemented basic public behavior. You have also identified many abstract state messages, but you have not yet defined them (see Abstract State).
Or,
* You have fully defined a class. Now, you want to create specialization through subclassing (with as few undesirable side effects as possible).

### Problem:

How do you write methods that make the class both efficient and simple to subclass?

### Constraints:

Larger data structures impose less flexibility and less efficient use of space on a class and its subclasses. You want to keep the data structure to a minimum unless a conscious decision (such as trading off space for speed) requires you to add additional details. Avoid implementing abstract state methods as concrete state methods whenever possible. Find your performance gain elsewhere if you really need one.

Many abstract state methods can be implemented in terms of others to minimize the amount of necessary concrete state. You can implement a lot of protocols that are not bound to state references in terms of other protocols. If you define every single protocol in terms of another one, though, you'll eventually end up with circular dependencies, like this one:
```javascript
class Circle {
	radius() {
		return this.diameter() / 2
	}
	diameter(0 {
		return this.radius() * 2
	})
}
```
Or, you can end up  with gross inefficiencies or convoluted code, like this:
```javascript
class Rectangle {
	center() {
		return this.topLeftVertex() + (this.bottomRightVertex() - this.topLeftVertex()) / 2
	}
	topLeftVertex() {
		return new Point(this.bottomleftVertex().x(), this.topRightVertex().y())
	}
	bottomLeftVertex() {
		return new Point(this.leftCenterVertex().x(), this.bottomCenterVertex().y())
	}
	leftCenterVertex() {
		return new Point(this.leftEdge().x(), this.center().y())
	}
}
```
When a better solution would have just used a data structure:
```javascript
class Rectangle {
	vertices() {
		return this._vertices // original array of points passed to constructor and added to the data structure
	}
	topLeftVertex() {
		return this.vertices()[0] // can always refactor if new functionality is introduced (e.g., rotating the rectangle)
	}
}
```
and so on.

### Solution:

First, identify a small subset of the abstract state and behavior methods that all other methods can rely on as kernel methods. Alter other methods so they use these kernel methods wherever possible.

Second, when you find yourself duplicating logic used in other non-kernel methods, refactor that logic out into private methods for reuse. For example, do not use ```this.radius() * 2``` all over your method implementations if you can go ahead and extract that logic into the private method, ```this.diameter()``` (which, of course, returns ```this.radius() * 2```). These private methods, along with other existing "self-reusable" non-kernel methods, form an additional layer of self-encapsulated methods.

Lastly, refactor the remaining non-kernel "leaf" methods to use the self-encapsulated private and kernel methods.

Conceptually, the class now has three layers of messages it responds to:
```
  LEAF METHODS providing non-duplicated, unique functionality (e.g., this.expandCircle())
   |	\
	 |	PRIVATE METHODS defining commonly used logic that would otherwise be duplicated (e.g., this.diameter() -> radius * 2)
   |		|
 KERNEL METHODS accessing minimal data structure (e.g., this.radius())
```
Refactoring a class to this structure may take several iterations.

If you implement message layers in this way, concrete subclasses then only need to implement (or override) the kernel methods to reliably provide the appropriate functionality. And, changing the functionality of "leaf" methods will not produce undesirable side-effects. Each layer will have a known sphere of influence. For example:
```javascript
class Circle {
	// minimal data structure
	constructor(radius, center) {
		this._radius = radius
		this._center = center
	}
	// kernel methods
	radius() {
		return this._radius
	}
	center() {
		return this._center
	}
	setRadius(radius) {
		this._radius = radius
	}
	setCenter(point) {
		this._center = point
	}
	// private methods
	pi() {
		return Math.PI
	}
	diameter() {
		return this.radius() * 2
	}
	area() {
		return this.radius() ** 2 * this.pi()
	}
	circumference() {
		return this.diameter() * this.pi()
	}
	// leaf methods
	moveBy(point) {
		this.setCenter(this.center() + point)
	}
	scaleBy(number) {
		this.setRadius(this.radius() * number)
	}
}
```
You can see that as you move outward to the leafs that the complexity of the functionality increases and so does the distance from the underlying data structure.

## Deferred State Variables
_** Also Known As: Defer Identification of State Variables**_

### Context:

* You have identified your class's kernel methods (see Message Layers).
Or,
* You have fully defined your class and now want to write a subclass with as few undesirable side effects as possible.

### Problem:

Once you have given your class a data structure and methods using that data structure, any subclasses you define automatically inherit these assumptions whether or not you want them to. Is there any way to avoid contaminating the subclass with the base class's data structure?

### Constraints:

Programmers often succumb to the temptation to just go ahead and add state variables (such as instance or class variables) to the parent class. But every state variable you put into the base class imposes that implementation on the subclasses. The subclass must, at a minimum, allocate memory or other space to accommodate the data you feel the need to store in a state variable. If later you want to increase the efficiency of your class, imagine how difficult it could be, on a production project, to refactor to remove these instance variables without breaking anything in any of the other classes in the hierarchy. Adding instance variables can be orders of magnitude easier than removing them.

For example, suppose we add the instance variables ```left```, ```right```, ```top```, and ```bottom``` to Rectangle. Later a highly specialized subclass of Rectangle called SmallConstrainedRectangle is added. Instances of this new class must take up as little memory as possible because of the sheer number of times SmallConstrainedRectangles will be generated and used in your program. The width and height of the SmallConstrainedRectangle must be a positive integer less than or equal to 16, and its center must always be an integer between 0 and 1023 in both the X and Y directions. We can hold all the info necessary (for example, centerX, centerY, width) packed into a single SmallInteger. Unfortunately, we already have four slots allocated per object. The base class's data structure has made the subclass take up too many data slots for your project constrains.

Usually, the space issue mentioned in the above example is not relevant in today's systems. But there are times when space issues are relevant, especially when space is multiplied in large sets of objects. The techniques described earlier (in Behavior-Defined Class, Abstract State, and Message Layers) usually render a fairly minimal set of state variable requirements. However, there is the possibility that even these relatively few variables will become a point of confusion if they are reused or rendered useless by later subclasses.

Lastly, as soon as the base class is turned into a concrete class there is the temptation to add more data structure details. Each time more detail is added (such as an additional instance variable), more behavior often follows. Subclasses will be big and bulky before they ever add their first ounce of behavior.

### Solution:

Defer identifying state variables for as long as possible. Create a stateless base class and let subclasses add state. Future developers of subclasses can then choose either to inherit the state from one of the concrete (or more concrete) subclasses or to start with a clean slate using the abstract class as its base.

For example, create a class AbstractTwoDimensionalPoint with kernel methods of radius, theta, x, y, and equals with no instance variables. Then, create a concrete subclass, Point, which defines two instance variables x and y. Later another, you go to add another concrete subclass, PolarCoordinate. Although there are several ways it may be able to subclass Point successfully, it would be much more elegant (not to mention efficient) to subclass AbstractTwoDimensionalPoint. Your abstract class can even include circular logic, since by definition it is not a concrete class:
```javascript
class AbstractTwoDimensionalPoint {
	radius() {
		// calculate radius from x() and y()
	}
	theta() {
		// calculate theta from x() and y()
	}
	x() {
		// calculate x using radius() and theta()
	}
	y() {
		// calculate y using radius() and theta()
	}
	equals(other) {
		return this.x() == other.x() && this.y() == other.y()
	}
}

class Point extends AbstractTwoDimensionalPoint {
	constructor(x,y) {
		this._x = x
		this._y = y
	}
	x() {
		return this._x
	}
	y() {
		return this._y
	}
	// relies on base class' radius(), theta(), and equals() methods
}

class PolarCoordinate extends AbstractTwoDimensionalPoint {
	constructor(radius, theta) {
		this._radius = radius
		this._theta = theta
	}
	radius() {
		return this._radius
	}
	theta() {
		return this._theta
	}
	// relies on base class' x(), y(), and equals() methods
}
```
You might also identify a method in a stateless base class that you want to require all subclasses to override:
```javascript
class AbstractPoint {
	moveBy() {
		throw new Err('Subclass must override')
	}
}
```

## Encapsulated Concrete State
_**Also Known As: Encapsulate Concrete State**_

### Context:

You have identified the structure of a class and defined its behavior.

### Problem:


How do we minimize the negative effects that data structure decisions have on the class hierarchy's flexibility? How do we reduce the implications of change as the class hierarchy evolves?

### Constraints:

Every time you add a state variable and define what it holds, you make an implementation decision. That decision impacts every method that will refer to the state variable. If you alter the decision in any way in the base class or a subclass, every method that references the state variable may then require a new implementation, including methods in the base class.

It is typically very efficient to reference a variable directly. Although methods that have only a single line of code that returns or sets a variable are also efficient due to language implementation shortcuts, they are not as efficient as directly referenced variables. However, in either case, the overhead of going through a method is not usually significant enough to introduce any sort of perceived performance problems:
```javascript
class Deck {
	constructor(beams) {
		this._beams = beams
	}
	beams() {
		return this._beams
	}
}

deck.beams()
deck._beams // more efficient, but not by much...
```

### Solution:

**When adding state variables, only refer to them directly in accessor methods.** If you are refactoring a class, modify any methods that use state variables directly to instead reference them indirectly, via accessors. (See "Variables Limit Reusability", Wilkerson, Wirfs-Brock, Journal of Object-Oriented Programming, 1989.)

Accessor methods will often exist already and may even already be implemented as public or private protocols. In Ruby, it is actually now the standard convention to refer to instance variables through accessor methods:
```ruby
class Banana
	attr_accessor :color # shorthand for setters and getters on the color instance variable

	def initialize(color)
		@color = color
	end

	def print_color
		print color # uses attr_accessor (follows convention)
		print @color # accesses the variable directly (breaks convention)
	end
end
```
The ```@color``` instance variable is accessible privately to the class regardless of whether or not you put in ```attr_accessor```. Putting in the accessor adds public getters and setters. Because ```attr_accessor```is such convenient shorthand for making the data available publicly, programmers actually prefer it verses writing individual getter and setter methods. Then, when implementing other methods in the class, it's shorter to go through the accessor and write ```color``` instead of the instance variable, ```@color```. So in the final result, Rubyists often end up implementing the pattern we are describing here without necessarily understanding the advantages of encapsulating state.

The fact that an accessor does its work by using an instance variable is irrelevant to whoever calls the accessor. As you add additional behavior to a class, implement other methods by going through the accessor, not by referencing the instance variable directly. This will allow you to make simple modifications to the accessor in the future without worrying about side effects.

For example, if we followed these rules and later changed our implementation of Circle to hold an instance variable of diameter instead of radius, we would only have to change the methods ```radius```, ```setRadius```, ```diameter```, and ```setDiameter``` in the class where we are making the change. Any subclasses (such as Sphere) would remain completely unaffected, except perhaps for a minuscule change in performance on a method-by-method basis.

As an additional benefit, you can confine to one location anything that often happens when accessing the variable, such as common modifications (like rounding the result) or side-effects (like notifying observers of a change).

Plus, encapsulated concrete state is easier to debug, to the programmer's delight. You can throw a debugger into a method call and stop at a break point, for example, every time ```diameter()``` is called. It's not possible to do that with an instance variable. You might think your editor's `find` function could give you the same information just as quickly, but consider this ```length``` method (from a real project):
```javascript
class Edge {
	constructor(beginPoint, endPoint) {
		this._begin = beginPoint
		this._end = endPoint
	}
	begin() {
		return this._begin
	}
	end() {
		return this._end
	}
	length() {
		return this.begin().distanceTo(this.end())
	}
}
```
Because the word ```length``` is rather generic and used by many other classes in unrelated contexts (Array.length...), `find` does not work very well. Breakpoints are a better choice to discover when and where the method is really being called. Likewise, consider if you wanted to see only where a method is called using a particular optional argument:
```javascript
class Point() {
	rotateBy(theta, phi) { // theta angle to rotate in 2D, optional phi angle to rotate in 3D
		if (phi) debugger;
		...
	}
}
```
Etc.

## Lazy Initialization
_**Also Known As: Use Lazy Initialization**_

### Context:

You have identified the data structure of the class, defined its behavior, and encapsulated its data structure via accessors (see Encapsulated Concrete State). You would like to initialize certain elements of the data structure to specific values.

### Problem:

When state variables have an initial or default value, how can we set them in a way to retain the most flexibility? How can we maximize performance, knowing that some data might not actually be used for a given instance of a class?

### Constraints:

There are several ways to set the initial default values of state variables. The most common are explicit initialization and lazy initialization.

Lazy initialization keeps the state variable uninitialized (e.g., nil) until something executes its "get" accessor. For example:
```javascript
class Deck {
	beams() {
		if (!this._beams) {
			this._beams = this._calculateBeams()
		}
		return this._beams
	}
}
```
Lazy initialization offers several benefits:

* It provides an obvious place to set the value independently of other variables and initialization routines
* The performance cost of initialization does not take place if the variable is never accessed
* The value can easily be reset without affecting other variables

Explicit initialization adds an initialize method to a class and has the metaclass send the message to any newly created object. This can provide slightly more efficient objects than lazy initialization, because it won't have to check for nil every time the variable is accessed:
```javascript
class Deck {
	constructor() {
		this._beams = this._calculateBeams()
	}
	beams() {
		// no need to check if this._beams is nil (it was initialized in the constructor), so just return it
		return this._beams
	}
}
```
 But, explicit initialization can have the following undesirable side effects:
* Performance loss from running expensive calculations to determine and set variables that are never used
* A subclass can override its base class's constructor in one of the following ways:
	* calling ```super initialize``` and adding behavior, which can sometimes result in setting the same variable multiple times; or,
	* rewriting the constructor completely which makes the subclass vulnerable to missing future changes in the base class
* Adds another place where variables are accessed directly, exposing them to problems when future implementation decisions are altered

You could try to avoid that last problem by using "set" accessors instead of direct reference to set the variables in your constructor. But that forces default settings and explicit settings to be treated the same, which may not be desirable if "set" accessors have side-effects:
```javascript
class Deck {
	constructor() {
		this._beams = this.setBeams(this._calculateBeams())
	}
	setBeams(beams) {
		this._beams = beams
		this.notifyObservers('Beams changed') // results in observers being notified whenever a deck is created
	}
}

```
Some might argue explicit initialization has aesthetic or maintainability benefits. But honestly, those "benefits" are a cultural issue or a matter of personal taste. The most significant argument for explicit initialization is execution efficiency. However, that efficiency gain often pales in comparison to the gain of avoiding expensive calculations that are never used.

### Solution:

Use lazy initialization to set a state variable's initial, default values whenever you need to use default values. Set the variable to the value returned by a default message (see Default Value Method).
```javascript
class Circle {
	radius() {
		if (!this._radius) this._radius = this.defaultRadius()
		return this._radius
	}
	defaultRadius() {
		return 10
	}
}
```
If a variable needs to be reset to its default for future use, reset it by calling the "set" accessor with nil, undefined or null (depending on language) as the argument. This avoids the overhead of initializing the value if it is not needed again:
```javascript
class Banana {
	color() {
		if (!this._color) this._color = this._defaultColor()
		return this._color
	}
	setColor(color) { // paint the banana blue, for example
		this._color = color
	}
	removePaint() { // reset the banana to its default color
		this._color = undefined
	}
}
```
Lazy initialization is especially effective with variables that exist as a cache for a calculated value. For example, a SquareMatrix class may need to refer to its determinant for many algebraic operations. Since the calculation of a determinant is complex, it may be valuable to cache this value in a variable called ```determinant```. Whenever a new entry is placed anywhere in the matrix, the determinant can be flushed (```this._determinant = undefined```). If the determinant is never needed again, it will never be recalculated. If it is used, it will be recalculated once and used each time the determinant is needed until one or more new entries are made to the matrix.

We actually solved a project-wide performance problem by refactoring most of our classes to use lazy initialization. The project involved 3D modeling software with draggable handles that recalculated the underlying model every time the user's mouse moved even one pixel. The constant recalculation was more than the browser could handle as the user ran the mouse across the screen. We had decreased the number of instance variables in our project for the reasons described above, but then faced performance issues from repeating complex calculations over and over again, since the resulting data was not stored and had to be recalculated every time it was needed. Lazy initialization eliminated calculations whose result was never used, and allowed us to avoid unnecessary recalculations.

When we later had to serialize the objects, we did so without the instance variables that had only been created to avoid repetitive recalculation. The data in these instance variables was not essential to deserializing the object, since it could be recalculated when it was actually needed.

To implement this across the project, we designated 'non-essential' instance variables. When we serialized or saved the object to persist it, we did not save the disposable instance variables that could be regenerated. For example, let's take ```board.edges()``` and imagine that a) we do not need to store it, since edges can be generated using the ```vertices``` and b) that for whatever reason, ```edges()``` is an excessively expensive operation that we do not want to constantly recalculate:
```javascript
class Board {
	edges() {
		if (!this._edges) {
			const vertices = this.vertices()
			this._edges = vertices.map((vertex, index)=> {
				var nextVertex = vertices[(index + 1) % vertices.length]
				return new Edge(vertex, nextVertex)
			})
		}
		return edges()
	}
	nonEssentialProperties() {
		return [this._edges]
	}
	serialize() {
		// do not include nonEssentialProperties
		...
	}
}
```

## Default Value Method
_**Also Known As: Define Default Values via Explicit Protocol**_

### Context:

You want to initialize certain instance variables with default values, perhaps because you're encapsulating concrete state as describe above. Or, you are just trying to simplify the number of parameters required to construct an object.

### Problem:

Where should you define these default values for maximum flexibility?

### Constraints:

For maintainability, reliability, and understandability, identify and define default values in one place. That way, if you ever need to change the default value, you only need to change it in once place. There are several potential methods that could define the default value: the constructor, the getter or an explicit default value method.

If you are using explicit initialization (in spite of the Lazy Initialization pattern described above), you could put the default values in the constructor:
```javascript
class Circle {
	constructor() {
		this._radius = 10
		this._center = new Point(0,0)
	}
}
```
We already mentioned two problems with explicit initialization: letting the constructor (which is a method other than the setter) set the variable, or if you go through the setter, causing side-effects at initialization time.

Now we can point out a third problem: explicit initialization forces subclasses to override the constructor just to change a default value. Then, you are faced with two bad choices:
* do not call the base class constructor, which would break the inheritance link for future modifications of this method
* write a new version of the method which retained the inheritance link, but end up setting the value of the variable multiple times... once for each time the subclass desired a different default value than its parent

In the example above, ```this._center``` is first set to 0,0 when the base class constructor is called. Now it is immediately reset to 0,0,0 in the subclass constructor:
```javascript
class Sphere extends Circle {
	constructor() {
		super()
		this._center = new Point(0,0,0)
	}
}
```
If you use Lazy Initialization, you can store the default value in the "get" accessor. For example:
```javascript
class Circle {
	center() {
		if (!this._center) this._center = new Point(0,0)
		return this._center
	}
}
```
Just as with putting default values in the constructor, putting the default value in the "get" accessor would force subclasses to override that method to change the default value. You'd end up rewriting all three lines of code (most of which is redundant), and you would break the getter's inheritance link to the base class for future modifications.

Therefore, no matter what type of initialization you use--explicit or lazy--you end up overriding code other than the default itself. You then have no way to test either in development or at run-time whether a default value is being used without expressing the default in a second method.

### Solution:

Define initial, default values in explicit methods with a selector that has "default" as its prefix and the capitalized variable name as its root. Have other methods that need the value for initialization and testing call this method to retrieve the default value. For convenience, we usually put all of these default value methods near the top of a class, just after the constructor, for easy reference during development. For example, an explicit default method for a Circle's center would look like:
```javascript
class Circle {
	constructor() {
		...
	}
	defaultCenter() { return new Point(0,0) }
	...
	center() {
		if (!this._center) this._center = this.defaultCenter()
		return this._center
	}
}
```
Separating default values into their own methods allows subclasses to easily override the default value without repeating other code or breaking inheritance links. It also allows you to write tests without "magic values" that determine if a value is the default value or not:
```javascript
it('centers itself at the default location', () => {
	const circle = new Circle()
	expect(circle.center()).toEqual(circle.defaultCenter())
})
```
Following this pattern consistently allows maintenance programmers to reliably find and change default values without breaking tests and without having to determine, or care about, the type of initialization used or where the default value may be defined.

## Conclusion

Use these patterns to produce classes, and the classes will invite easy reuse through inheritance. Self-encapsulation discourages you from having to think about data structures and produces cleaner, behavior-driven designs. These classes are easier to understand and document because they are so consistent within themselves and alongside their subclasses. A developer is more likely to use or to subclass that which he can understand.

Self-encapsulation allows Inheritance to fulfill in practice the Reusability promised in theory by object-oriented design.

Copyright © 1994 Ken Auer and Knowledge Systems Corporation, 1997-98 Ken Auer and RoleModel Software, Inc.
