# SOLID principles

> SOLID principles are a set of five foundational guidelines in **object-oriented design** that help developers create software that is **easy to maintain, extend, and scale**. They were introduced by Robert C. Martin ("Uncle Bob") and are widely used in professional software engineering. [UW Bothell Library](https://learning.oreilly.com/library/view/clean-architecture-a/9780134494272/contents.xhtml)


## The SOLID Principles

### **S — Single Responsibility Principle (SRP)**

```{admonition} Definition
A module should be response to one, and only one, **actor**.<a href="#footnotes"><sup>[1]</sup></a>
```
- Identify the actors    
- Create separate modules for each actor  
- Use the Facade Pattern to simplify if necessary  

**Details:**  
The idea says to serve a **single actor** where an *actor* is defined to be a group of users or clients that have the *same* expectations of behavior. 

When a module serves multiple actors then this can result in a kind of "whack-a-mole" situation. One actor wants X, but another wants Y. *Fix it for X, break it for Y.* As the module is updated to serve both, the code becomes unnecessarily complicated, convoluted, and a tangled mess. As developers fix the symptoms, they unwittingly repeat logic with fragile code.  

A better design is to encouraging clear boundaries between responsibilities with *intentional duplication* (or better yet, **separation**). This is a design choice to isolate responsibilities, even if it means similar code exists in multiple places. When truly exact and duplicate code is identified, it can be factored out. Sometimes, the commonality is the **data** and not functionality.  

When a solution involves the creation of an abundant number of classes that can cause client code to become unnecessarily complicated. A common fix is to use the **Facade** pattern to **aggregate** the set of classes. The *facade* is responsible for delegating to the appropriate class. 

---

### **O — Open/Closed Principle (OCP)**
```{admonition} Definition
Software entities should be open for extension but closed for modification.
```

- You should be able to **add new functionality** without changing existing code.
- Achieved through **inheritance** or **interfaces**.
- Instead of modifying a class to support a new behavior, consider creating a new subclass with the behavior.  

**Details:**  
It isn't *always* true that when an entity needs to be extended, that inheritance (or interfaces) are required to do it cleanly. An entity can be modified directly if the new behavior is always needed.  

There are many cases where the new needed behavior is for a subset of scenarios.  

A logical hierarchy of inheritance can help isolate the code and reduce complications. If the inherited classes require new getters be added to the base class to expose private state, then inheritance is probably not the right solution. Instead, consider either: a) the new behavior should be added to the base class; b) the new behavior should be exposed via an interface that the base class can implement possibly via containment.    

Also, as one considers reusing code and extending a base class, one needs to consider this next principle, LSP.  

---

### **L — Liskov Substitution Principle (LSP)**
```{admonition} Definition
Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.
```

- Subclasses should behave in a way that doesn’t surprise or break the expectations set by the parent class.
- **Example**: If `Bird` has a method `fly()`, a subclass `Penguin` shouldn’t inherit `Bird` unless it can also fly—or the design should be reconsidered.

**Details:**  
A base class can reasonably expect that all subclasses behave consistently. Let's consider an example of a Point3D that extends Point2D. In the base class, Point2D, there may be a need to calculate the distance between two points. It could reasonably use just the x & y instance fields to calculate the distance, but this would be incorrect for a point in 3D.  

If the base class ever starts to make use of `instanceof` to conditionally change behavior based on the actual sub-type of an object, then there is an issue.  

---

### **I — Interface Segregation Principle (ISP)**
```{admonition} Definition
Clients should not be forced to depend on interfaces they do not use.
```
- Prefer **smaller, more specific interfaces** over large, general-purpose ones.
- This avoids forcing classes to implement methods they don’t need.
- **Example**: Instead of one `IMachine` interface with `Print()`, `Scan()`, and `Fax()`, split it into `IPrinter`, `IScanner`, and `IFax`.

This principle is similar to using Microservices.  

---

### **D — Dependency Inversion Principle (DIP)**
```{admonition} Definition
High-level modules should not depend on low-level modules. Both should depend on abstractions.
```

- Code should depend on **interfaces or abstract classes**, not concrete implementations.
- Promotes **loose coupling** and easier testing.
- **Example**: A `NotificationService` should depend on an `INotificationSender` interface, not directly on `EmailSender` or `SmsSender`.

---

### Why SOLID Matters
- Encourages **clean architecture**.
- Makes code **easier to test and refactor**.
- Reduces **technical debt**.
- Supports **agile development** and **continuous integration**.

---

## TODO: Example
Here is bad code.

Here is why.

Here are ways to improve it.

## Resources
Here are some of the **top books and resources** to learn and master the **SOLID principles** in software engineering, recommended by experts and widely used in the industry:

### 1. **Clean Code: A Handbook of Agile Software Craftsmanship**  
**Author**: Robert C. Martin ("Uncle Bob")  
- Introduces key principles of writing clean, maintainable code.  
- Covers SRP and other SOLID principles through practical examples.  
- A must-read for understanding the mindset behind SOLID.  
[View on Amazon](https://www.guru99.com/software-engineer-book.html)

---

### 2. **Mastering SOLID: Advanced Software Architecture & Design Principles**  
**Author**: R. Parvin  
- A deep dive into all five SOLID principles with hands-on coding labs.  
- Focuses on Java but concepts apply broadly.  
- Includes real-world scenarios and refactoring techniques.  
[View on Amazon](https://www.amazon.com/Mastering-SOLID-Architecture-Object-Oriented-Depth-ebook/dp/B0CTYV2KK4)[2](https://www.amazon.com/Mastering-SOLID-Architecture-Object-Oriented-Depth-ebook/dp/B0CTYV2KK4)

---

### 3. **Design Patterns: Elements of Reusable Object-Oriented Software**  
**Authors**: Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides  
- While not solely about SOLID, it complements it by teaching reusable design strategies.  
- Helps understand how to apply OCP and DIP effectively.  
View on Amazon[1](https://www.guru99.com/software-engineer-book.html)

---

### 4. **Refactoring: Improving the Design of Existing Code**  
**Author**: Martin Fowler  
- Teaches how to evolve codebases toward SOLID principles.  
- Focuses on improving design without changing behavior.  
View on Amazon[1](https://www.guru99.com/software-engineer-book.html)

---

### 5. **The Pragmatic Programmer**  
**Authors**: Andrew Hunt and David Thomas  
- Offers practical advice on software craftsmanship.  
- Encourages modular, maintainable design aligned with SOLID.  
View on Amazon[3](https://discoveringsaas.com/books/best-books-for-software-engineers/)

---

### **Online Resources & Courses**
- **Pluralsight**: Offers dedicated courses on SOLID principles and design patterns.
- **Udemy**: Look for courses like *“SOLID Principles: Introducing Software Architecture & Design”*.
- **Medium & Dev.to**: Many developers share practical guides and examples of SOLID in action.
- **GitHub Repositories**: Search for SOLID principle examples in various languages.

## Footnotes
[1] *Clean Architecture: A Craftsman's Guide to Software Structure and Design*, Robert C. Martin. [UWB Library E-Book](https://learning.oreilly.com/library/view/clean-architecture-a/9780134494272/part3.xhtml)