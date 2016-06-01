# Reusability Through Self-Encapsulation

_NOTE: This was originally written in 1994 and published in the Pattern Languages of Program Design book. The following is an updated version customized for HTML, Ruby and Javascript and altered slightly to use a more widely accepted pattern naming principle (noun phrases) along with some minor wordsmithing._

## Introduction

Reusability has long been a promise of object-oriented technology, and the use of inheritance has been promoted as a significant means to that end. In practice, however, extending existing classes through inheritance can be difficult. Once inheritance is successfully exploited, changing the definition or implementation of a class can often wreak havoc on its subclasses. Many of these difficulties are due to the fact that the benefits of encapsulation are easily ignored when exercising inheritance.

Adherence to the pattern language presented here will lead to classes and class hierarchies that overcome many of these difficulties. The language exploits the notion of encapsulation to isolate implementation decisions to a small number of methods. I call this technique **self-encapsulation**.

This pattern language has been successfully applied in Smalltalk and many other object-oriented languages. It is best used when implementing new classes from scratch. However, it can also be used to refactor existing classes to improve their reusability. See the context for each pattern to determine when it is appropriate to apply.

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

You are creating a new class, and would like to avoid inserting implementation characteristics that would be detrimental to its reliability or to that of its subclasses as they evolve.

### Problem:

Inheritance of behavior is what we typically want to exploit. How do we define classes in such a way that behavior is reliable?

### Constraints:

The essence of an object that is part of a collaborating system of objects is its responsibilities. Other objects rely on it to fulfill these responsibilities. The manner in which it fulfills them is relatively unimportant. Even less important in an object-oriented system is the data structure of an object (that is, the number of slots, the slots' names, and the type of object that is expected to live in those slots).

But an objects responsibilities cannot be fulfilled without message passing. Defining method details is typically much more time-consuming than defining message names (protocols). (Note: I refer here to the time necessary to define these names for the rest of the system. This should not be confused with the time needed to determine high-quality message names, which should always be done with care). Additionally, the data structure of an object is often important in making received messages actually respond in a meaningful way.

The data structure of objects is important, as there is very little that can be done without eventually manipulating some sort of data. Trade-offs between space and speed are often closely tied to the data structure used in implementing an object. However, subclasses automatically inherit the data structure of their superclass. Any decisions about data structure is virtually irreversible by subclasses without overriding every method that refers to the data structure. Each time detail is added to the data structure, some implementation options are lost and others imposed on the class and its subclasses.

### Solution:

When creating a new class, define its public protocol and specify its behavior without regard to data structure (such as instance variables, class variables, and so on).

For example:

Class:
	Rectangle

Protocol:
	area
	corners
	intersects:
	contains:
	perimeter
	width
	height
	insetBy:
	translateBy:
	center
	<etc.>

## Abstract State
_**Also Known As: Implement Behavior with Abstract State**_

### Context:

The public behavior of a class is identified (see Behavior-Defined Class) but the actual implementation of this behavior is undefined.

### Problem:

How do we approach implementation without prematurely and unnecessarily forcing data structure design decisions on subclasses?

### Constraints:

Identifying names and intents of protocols does not provide functionality. Methods associated with these protocols must be implemented. In order to implement certain methods, access to the implied state of the object is necessary. For example, in order to calculate the area of a Circle, its radius is required.

If portions of the data structure (such as an instance variable) are defined as soon as the need for particular state is identified, there may be an abundance of state variables that may not be necessary, as they can be derived from other state variables (for example, a Circle's diameter can be derived from radius). Additionally, each detail introduced into the data structure reduces the flexibility of subclass implementations.

### Solution:

If implied state information is needed in order to complete the implementation details of behavior, identify the state by defining a message that returns that state instead of defining a variable.

For example, use

	Circle>>area
		^self radius squared * self pi
not

	Circle>>area
		^radius squared * pi.

This implies that methods for radius and pi must be implemented, but it does not yet determine any particular data structure. Both the details for how the radius is retrieved (or derived) and the details of retrieval and precision for which pi is used are determined in one place and changed in one place. Changes in any of these details will proliferate through the rest of the class with no further intervention.

This technique can also be used for "indexed" state by identifying abstract state messages such as atIndex: or atIndex:put:.

Note that the author acknowledges that there may already be a global variable for pi that would alleviate the need to encapsulate this constant in a method. This example is used to make the reader think twice before determining whether what is thought of as a constant may need to be modifiable due to potential constraints imposed upon the system (for example, precision, performance, special cases, and so on).

## Message Layers
_**Also Known As: Identify Message Layers**_

### Context:

This pattern is applicable to either of these contexts:

* Basic public behavior has been defined and implemented, and many abstract state messages have been identified but not yet defined (see Abstract State).
* A class has been fully defined, and specialization through subclassing is now desired (with as few undesirable side effects as possible).
Problem:

How can methods be factored to make the class both efficient and simple to subclass?

### Constraints:

Larger data structures impose less flexibility and less efficient use of space on a class and its subclasses. It is desirable to keep the data structure to a minimum unless a conscious decision (such as trading off space for speed) necessitates the initiation of additional details. This implies that we should avoid implementing abstract state methods as concrete state methods whenever possible. It also implies that we should examine our implementation of other methods for efficient execution so as to avoid prematurely initiating additional data structures for the sake of efficiency.

Many abstract state methods can be identified in terms of others to minimize the amount of concrete states necessary. Additionally, protocols that are not bound to state references can often be defined in terms of other protocols. However, this can also lead to circular dependencies, like this:

	Circle>>radius
		^self diameter / 2
	Circle>>diameter
		^self radius * 2

It can also lead to gross inefficiencies or convoluted code, as shown here:

	Rectangle>>center
		^self topLeft + (self bottomRight - self topLeft / 2).
	Rectangle>>topLeft
		^self bottomLeft x @ self topRight y
	Rectangle>>bottomLeft
		^self leftCenter x @ self bottomCenter y
	Rectangle>>leftCenter
		^self left @ self center y
and so on.

### Solution:

Identify a small subset of the abstract state and behavior methods which all other methods can rely on as kernel methods. Alter other methods so they use these kernel methods wherever possible without duplicating the logic of other nonkernel methods (for example, do not use "self radius * 2" if you can use "self diameter"). Often, logic that is duplicated in several methods can be extracted into additional private methods. These new methods can be included with existing "self-reusable" nonkernel methods to form an additional layer of self-encapsulated methods that remaining nonkernel "leaf" methods could be altered to use. (Note: this may take several iterations). Concrete classes then only need to implement (or override) the kernel methods appropriately to reliably provide all the implied functionality. Changing the functionality of "leaf" methods will not produce undesirable side-effects. Each layer will have a known sphere of influence.

For example, identify Circle's kernel methods as radius, radius:, center, center: and pi. Other methods would use these kernel methods. Methods like diameter would become second layer methods

	Circle>>radius
		^???
	Circle>>radius:
		???
	Circle>>pi
		^???
	Circle>>center
		^???
	Circle>>center:
		???
	Circle>>diameter
		^self radius * 2
	Circle>>area
		^self radius squared * self pi
	Circle>>topCenter
		^self center - (0 @ self radius)
	Circle>>circumference
		^self diameter * self pi
	Circle>>moveBy: aPoint
		^self center: self center + aPoint
	Circle>>scaleBy: aNumber
		^self radius: self radius * aNumber

## Deferred State Variables
_** Also Known As: Defer Identification of State Variables**_

### Context:

This pattern is applicable to either of these contexts:

The kernel methods of the class have been identified (see Message Layers).
A class has been fully defined, and specialization through subclassing is now desired (with as few undesirable side effects as possible).
Problem:

Once a data structure is defined and methods refer to it, subclasses inherit these assumptions whether or not they are desirable. Can this be avoided?

### Constraints:

It is very tempting to add state variables (such as instance or class variables) to the class we've been defining. However, as soon as we do we've imposed implementation decisions on our subclasses, requiring them to allocate at least as much space as the base class. If we later need a more space efficient version of the class, we'll have to rearrange things.

For example, suppose we added the instance variables left, right, top, and bottom to Rectangle. Later a highly specialized subclass of Rectangle called SmallConstrainedSquare is added. Instances of this new class must take up as little memory as possible. The width and height of the square must be a positive integer less than or equal to 16, and the center of the square must always be an integer between 0 and 1023 in both the X and Y directions. We can hold all the info necessary (for example, centerX, centerY, width) packed into a single SmallInteger. Unfortunately, we've already got 4 slots allocated per object.

Usually, the space issue mentioned in the above example is just not very relevant in today's systems. There are times when space issues are very relevant, especially when space is multiplied in large sets of objects. The techniques described earlier (in Behavior-Defined Class, Abstract State, and Message Layers) usually render a fairly minimal set of state variable requirements. However, there is the possibility that even these relatively few variables will become a point of confusion if they are reused or rendered useless by later subclasses.

Lastly, as soon as the base class is turned into a concrete class there is the temptation to add more data structure details. Each time more detail is added (such as an additional instance variable), more behavior often follows. Subclasses will be big and bulky before they ever add their first ounce of behavior.

### Solution:

Defer identification of state variables for as long as possible. It is often a good idea to make the base class stateless and let subclasses add state. Future developers of subclasses can then choose either to inherit the state from one of the concrete (or more concrete) subclasses or to start with a clean slate using the abstract class as its base.

For example, create a class AbstractTwoDimensionalPoint with kernel methods of radius, theta, x and y with no instance variables. A concrete subclass, Point, is created which defines two instance variables x and y. Later another concrete subclass, PolarCoordinate, is added. Although there are several ways it may be able to subclass Point successfully, it would be much more elegant (not to mention efficient) to subclass AbstractTwoDimensionalPoint.

## Encapsulated Concrete State
_**Also Known As: Encapsulate Concrete State**_

### Context:

The data structure of a class has been identified and its behavior has been defined.

### Problem:

How do we minimize the negative effect that data structure decisions have on the flexibility of the class hierarchy and reduce the implications of change as the class hierarchy evolves?

### Constraints:

Adding a state variable and defining what it holds is a single implementation decision. Every method that refers to the state variable will be impacted by that decision. If the decision is altered in any way in the base class or a subclass, it is possible that a new implementation will be required for every method that references the state variable (including those defined in its superclasses).

It is typically extremely efficient to reference a variable directly. Although methods that have only a single line of code that returns or sets a variable are also very efficient due to language implementation shortcuts (as per Dave Leibs, then of ParcPlace Systems, Inc.), they are not as efficient as directly referenced variables. However, in either case the overhead is not usually significant enough to introduce any sort of perceived performance problems.

Additionally, it is often necessary during maintenance, or even at run-time, for classes (or subclasses) to determine exactly when an attribute is retrieved or set.

### Solution:

When adding state variables, only refer to them directly in "getter" or "setter" methods. (See "Variables Limit Reusability", Wilkerson, Wirfs-Brock, Journal of Object-Oriented Programming, 1989). These methods will often exist already (although undefined; see Abstract State, and Message Layers) and may already be defined as public or private protocols. The fact that such a method provides access to a variable is irrelevant to every object except the one in which it is implemented. As additional behavior is added, continue to access state variables only through these getter and setter methods, to allow for simple modifications in the future. Modify any other methods which refer to state variables directly (if earlier patterns were not followed) so that they instead refer to them indirectly, via these getter and setter methods.

For example, if we followed these rules and later changed our implementation of Circle to hold an instance variable of diameter instead of radius, we would only have to change the methods radius, radius:, diameter, and diameter: in the class where the change was made. Any subclasses (such as Sphere) would not be affected in any way, other than a possible change in performance on a method-by-method basis.

As an additional benefit, any modifications or side-effects (like change notification, rounding, and so on) to the manner in which these variables are treated can be easily confined to a single location.

## Lazy Initialization
_**Also Known As: Use Lazy Initialization**_

### Context:

The data structure of a class has been identified, its behavior has been defined, and the data structure has been encapsulated via accessing methods (see Encapsulated Concrete State). The programmer would like to initialize certain elements of the data structure to specific values.

### Problem:

When state variables have an initial or default value, how can we set them in a way that best retains flexibility?

### Constraints:

There are several ways to set initial, default values of state variables. The most common are explicit initialization and lazy initialization.

Lazy initialization is done in a getter method if the state variable is nil. This offers several benefits:

It provides an obvious place to set the value uncluttered by other variables and initialization routines.
The overhead of initialization does not take place if the variable is never accessed.
The value can easily be reset to its default independently of other variables.
Explicit initialization adds an initialize method to a class and has the metaclass send the message to any newly created object. This can provide slightly more efficient objects than lazy initialization, due to the lack of checking for nil on each access of the variable. But, it can have several undesirable side effects.

Variables may be set to non-trivial values (that is, variables that take some calculation to derive) and never be used.
A subclass can override its superclass version in one of two ways:
Calling super initialize and adding behavior, which can sometimes result in setting the same variable multiple times;
Rewriting it completely which makes the subclass vulnerable to missing future changes in the superclass.
Adds another place where variables are accessed directly, exposing them to problems when future implementation decisions are altered. If setter methods are used instead of direct reference to avoid this problem, it forces default settings and explicit settings to be treated the same, which may not be desirable if setter methods have side-effects.
Although some would argue that there are aesthetic or maintainability benefits to using explicit initialization, this is mostly a cultural issue or one of personal taste. The most significant argument for explicit initialization is execution efficiency.

### Solution:

Use lazy intialization to set initial, default values of a state variable whenever default values are desired. Set the variable to the value returned by a default message (see Default Value Method).

If a variable needs to be reset to its default for future use, reset it by sending the setter message with nil as the argument. This avoids the overhead of initialization of the value if it is not needed again.

For example, if we followed these rules we could have the following methods in Circle:

	Circle>>radius
		radius == nil
			ifTrue: [radius := self defaultRadius].
		^radius
	Circle>>defaultRadius
		^10
Note the use of '== nil' instead of 'isNil'... this is much more efficient due to the language implementation (for some dialects/versions of Smalltalk) as it avoids the overhead of a message send, making the potential performance benefit of the alternative explicit initialization much less significant.

This technique is especially valuable for the initialization of variables which exist as a cache for a calculated value. E.g. a SquareMatrix may need to refer to its determinant for many algebraic operations. Since the calculation of a determinant is fairly complex and lengthy, it may be valuable to cache this value in a variable called determinant. Whenever a new entry is placed anywhere in the matrix, the determinant can be flushed ("self determinant: nil"). If the determinant is never needed again, it will never be recalculated. If it is used, it will be recalculated once and used each time the determinant is needed until one or more new entries are made to the matrix.

## Default Value Method
_**Also Known As: Define Default Values via Explicit Protocol**_

### Context:

Initial, default values for class specific variables are desired to either encapsulate the need for this state (see Encapsulated Concrete State) from creators of instances of a class, or simplify the number of parameters needed at creation time for typical cases.

### Problem:

Where should these default values be defined for maximum flexibility?

### Constraints:

For maintainability, reliability, and understandability, default values should be identified in one place. This would allow changes to that default value to be made once in the base class or its subclasses. For each such case, there are many potential methods in which this single value could be defined.

If explicit initialization is being used (in spite of [6. Use Lazy Initialization]) the initialize method could house the default value(s). E.g.

	Circle>>initialize
		super initialize.
		radius := 10.
		center := 0@0.
-or-

	Circle>>initialize
		super initialize.
		self radius: 10.
		self center: 0@0.
In addition to the other problems mentioned with explicit initialization (an additional method referring to a variable and side-effects at initialization time), this would force subclasses to have to override this method even if it only desired a change of one default value (e.g. center) and cause either

a rewrite which did not include "super initialize" which would break the inheritance link to the base class for future modifications of this method, or
a new version of the method which retained the inheritance link via "super initialize", but end up setting the value of the variable multiple times... once for each time the subclass desired a different default value than its parent.
If Lazy Initialization is used, the getter method could be used to house the default value, e.g.

	Circle>>center
		center == nil
			ifTrue: [center := 0@0].
		^center
This would force subclasses to override the getter method if they wanted to change the default value, rewriting all three lines of code (most of which is redundant), and breaking the inheritance link to the base class for future modifications if any other side-effects of the getter method are desired. (Note: having a getter method have side effects is not often recommended at run-time although it can prove useful during development).

No matter which sort of initialization is defined, significant (greater than one line of) code would be overriden and there would be no way to test at either development or run-time whether a default value was being used as there would be no way to test the value other than expressing the default in a second method.

### Solution:

Define initial, default values in an explicit methods with a selector which has "default" as its prefix and the capitalized variable name as its root. Have other methods which need the value for initialization, testing, etc. send the message to self to retrieve the value. For example, an explicit default method for a Circle's center would look like:

	Circle>>defaultCenter
		^0@0
This allows subclasses to easily override the default value without repeating other code or breaking inheritance links. It also allows for simple testing as to whether the value is the default value or not (e.g. aCircle center = aCenter defaultCenter). Following this pattern consistently will allow maintenance programmers to reliably find and change default values without having to determine, or care about, the type of initialization used or where the default may be defined.

## Conclusion

Use these patterns to produce classes, and the classes will invite reuse through inheritance. Self-encapsulation discourages thought about data structures and produces cleaner behavior-driven designs. These classes will be easier to understand and document due to their self-consistency. A developer is more likely to subclass that which he can understand. Through this technique, much of promised benefits of inheritance can be realized.

Copyright © 1994 Ken Auer and Knowledge Systems Corporation, 1997-98 Ken Auer and RoleModel Software, Inc.
