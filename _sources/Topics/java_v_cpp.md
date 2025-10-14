# Java <--> C++


## Top Things a C++ Developer Needs to Know When Learning Java

### 1. **Memory Management**
- **C++**: Explicit use of pointers, references, and pointer arithmetic. Objects can be created on the stack without using `new`. Manual memory management; `delete` objects. Constructors and Destructors.  
- **Java**: Objects need to be explicitly created. No pointers; all objects are accessed via references. Automatic garbage collection — no `delete`, and `new` is used but memory is managed by the JVM. 
- **Hurdle**: Need to explicitly create objects. No ability to directly manage memory; only reference semantics. Destructors don't really exist as objects are deleted by the garbage collector at unknown times.   

### 2. **Build Ecosystem & File Structure**
- **C++**: Include `header` files for definitions. Access modifiers used to label 'sections' of the file. Uses `make` or IDE-specific build tools. Compiles to native machine code. 
- **Java**: Only `.java` files. Packages and imports. Each member has its own access modifiers. Uses `Maven`. Has a large ecosystem of frameworks (e.g. Spring). Compiles to bytecode and runs in the JVM.  
- **Hurdle**: Getting comfortable with Java’s JVM, classpath, file structure, package-based access control, and build management tools.

### 3. **Virtual Methods and Polymorphism**
- **C++**: Methods are non-virtual by default; must use `virtual` for polymorphism.
- **Java**: All instance methods are **virtual by default** (unless marked `final`, `static`, or `private`).
- **Hurdle**: Understanding that Java supports polymorphism more naturally and consistently.

### 4. **Templates vs Generics**
- **C++**: Templates are compile-time and more flexible.
- **Java**: Generics are type-safe but use **type erasure**, which limits runtime type information.
- **Hurdle**: Understanding the limitations of Java generics compared to C++ templates.

### 5. **Standard Libraries**
- **C++**: STL (Standard Template Library) with containers and algorithms.
- **Java**: Rich standard library with collections, streams, and concurrency utilities.
- **Hurdle**: Learning Java’s collection framework and functional-style APIs (like `Stream`).

### 6. **Interfaces & Functional Programming**
- **C++**: Interfaces are implemented using **abstract classes** with pure virtual functions (`= 0`). Functional programming is supported via **function pointers**, **functors**, **lambdas**, and **`std::function`**. The STL provides higher-order functions like `std::for_each`, and algorithms that accept callable objects. Lambdas and smart pointers make modern C++ more expressive and safer.
- **Java**: Interfaces are first-class citizens with the `interface` keyword. Interfaces can include **default** and **static** methods. Functional programming is supported via **lambdas**, **method references**, and the **Stream API**, which enables declarative data processing.
- **Hurdle**: In C++, functional programming requires understanding multiple callable types (function pointers, functors, lambdas) and how they interact with templates and type inference. In Java, the challenge is mastering the Stream API and functional interfaces like `Predicate`, `Function`, and `Consumer`.

### 7. **Operator Overloads**  
- **C++**: offers powerful syntax customization, but overuse of operator overloading can reduce traceability.  
- **Java**: Operator overloads are **NOT** offered. Attempts clarity by enforcing explicit method calls.    
- **Hurdle**: Losing the ability to overload operators using C++'s syntactic sugar will be cumbersome as Java's syntax is verbose.  

### 8. **Multiple Inheritance**
- **C++**: Supports multiple inheritance of classes.
- **Java**: Only single inheritance for classes, but allows multiple interfaces.
- **Hurdle**: Learning to use **interfaces** and **composition** instead of multiple inheritance.
---


## Header Files
In C++, the definitions are found in a `.h` header file. The implementation is found in the `.cpp` file.  
In Java, all the definitions and implementation are found in the same file.  


### Compiler directives
In C++, regardless of where an implemenation resides, all definitions are provided with `#include`.  
In Java, code in the same `package` is automatically included (or imported). Other definitions are provided with `import`.   

In C++, definitions are provided by including the header files. To prevent **re**definitions, compiler directives (or preprocessor directives) are used to assure that a header file is included only once.  
* `#ifndef MYSTUFF_H`
* `#pragma once`

In Java, code can be outside of all named packages. This set of files is called the `default package` and can import any other package. It has has access to all the code in the default package. However, the default package cannot be imported into any other code. It stands alone.  

**Impact**  
Java makes it pretty easy to control what code is used. An intentional design of packages and explicit importing of specific classes allows a file to categorically use code while also picking classes a la cart. There is no need for a long list of including files, or a header file that includes header files.  

### Syntax
Clearly there are a lot of syntax differences. Here are some of the ones top of mind:  
* Scoping:  Class methods are scoped using double colons `::`. Ex:  `MyClass::method`  
* Deconstructors: When an object is destroyed and its memory is freed, the deconstructor is called. Ex: `MyClass::~MyClass()`.  
* Constructors: A constructor offers a shorthand way to initialize instance fields. `MyClass::MyClass(int value) : fieldName(value) {}`  
 
### public private
In C++, access modifiers are more like labels for a section of the file.  
In Java, each method/class has its access modifier applied to it individually; there are no file sections.

## Object Creation
In C++, objects are implicitly created on the `stack`. There is no need to use the `new` keyword to create an object on the stack. Objects on the stack are deconstructed at the close of the scope. When the `new` keyord is used, the object is created on the `heap` and the pointer to this object it given to the developer who is responsible for releasing (deleting)  it when the object is no longer needed.  
In Java, the `new` keyword must be used to create all objects which are located in the `heap`. The `Garbage Collector` is responsible for releasing the memory when the object is no longer referenced.   

```C++
// myclass.h
#ifndef MYCLASS_H
#define MYCLASS_H

class MyClass {
public:
    MyClass();              // Constructor
    ~MyClass();             // Destructor

    void demoStackHeap();   // Demonstrates stack vs heap allocation
};

#endif // MYCLASS_H

// myclass.cpp
#include <iostream>

class MyClass {
public:
    MyClass() {
        std::cout << "Constructor called\n";
    }

    ~MyClass() {
        std::cout << "Destructor called\n";
    }

    void demoStackHeap() {
        // Creating stack instance
        MyClass stackInstance;

        // Creating heap instance
        MyClass* heapInstance = new MyClass();

        // Deleting heap instance
        delete heapInstance;

        // closing method scope. stackInstance is destroyed.
    }
};

int main() {
    // Creating stack instance
    MyClass obj;
    obj.demoStackHeap();

    // closing method scope. obj is destroyed.
    return 0;
}
```
## `new` and `delete`
In C++, 


##  Object Creation in C++:

1. **Stack Allocation (Automatic Storage):**
   - In C++, when you declare an object like `MyClass obj;`, it is created on the **stack**.
   - No `new` keyword is needed.
   - The object is **automatically destroyed** when it goes out of scope (e.g., at the end of a function or block).
   - This is known as **automatic storage duration**.

2. **Heap Allocation (Dynamic Storage):**
   - When you use `new`, like `MyClass* obj = new MyClass();`, the object is created on the **heap**.
   - You receive a **pointer** to the object.
   - You are responsible for **manually deleting** it using `delete obj;` when it's no longer needed.
   - Failure to do so results in a **memory leak**.

### Additional Notes:
- **Smart pointers** (like `std::unique_ptr` or `std::shared_ptr`) in modern C++ help manage heap memory automatically and reduce the risk of leaks.

## Virtual Keyword
Virtual methods behave polymorphically.  

In C++, methods can be one of three types. By default, a method is a non-virtual instance method.    
* instance : a non-virtual method that has access to the instance fields belonging to the object. It cannot be overridden by a derived class. When a derived class provides a method with the same signature, no polymorphism occurs, and the base class method can only be invoked by scoping to the base class. The method was not overridden. Code invoke this method does not behave polmorphically.  When a class calls a non-virtual instance method, it always invokes its own implementation.     
* `static` : a method that belongs to the class (namespace) and does not have access to any instance members.  
* `virtual` : This is an instance method that can be overridden so that code can support `polymorphism`.  

In Java, there are only two types of methods (`static` or instance). All instance methods are virtual.  
