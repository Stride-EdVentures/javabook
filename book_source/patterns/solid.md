# SOLID principles

> SOLID principles are a set of five foundational guidelines in **object-oriented design** that help developers create software that is **easy to maintain, extend, and scale**. They were introduced by Robert C. Martin ("Uncle Bob") and are widely used in professional software engineering.


## The SOLID Principles

### 1. **S — Single Responsibility Principle (SRP)**
> **A class should have only one reason to change.**

- Each class should do **one thing** and do it well.
- This makes code easier to understand, test, and maintain.
- **Example**: A `ReportGenerator` class should only generate reports, not handle file saving or formatting.

---

### 2. **O — Open/Closed Principle (OCP)**
> **Software entities should be open for extension but closed for modification.**

- You should be able to **add new functionality** without changing existing code.
- Achieved through **inheritance** or **interfaces**.
- **Example**: Instead of modifying a class to support a new payment method, create a new subclass that implements a common interface.

---

### 3. **L — Liskov Substitution Principle (LSP)**
> **Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.**

- Subclasses should behave in a way that doesn’t surprise or break the expectations set by the parent class.
- **Example**: If `Bird` has a method `fly()`, a subclass `Penguin` shouldn’t inherit `Bird` unless it can also fly—or the design should be reconsidered.

---

### 4. **I — Interface Segregation Principle (ISP)**
> **Clients should not be forced to depend on interfaces they do not use.**

- Prefer **smaller, more specific interfaces** over large, general-purpose ones.
- This avoids forcing classes to implement methods they don’t need.
- **Example**: Instead of one `IMachine` interface with `Print()`, `Scan()`, and `Fax()`, split it into `IPrinter`, `IScanner`, and `IFax`.

---

### 5. **D — Dependency Inversion Principle (DIP)**
> **High-level modules should not depend on low-level modules. Both should depend on abstractions.**

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
View on Amazon[1](https://www.guru99.com/software-engineer-book.html)

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

