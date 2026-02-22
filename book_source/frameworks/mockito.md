# Mockito

Mockito helps you create **mocks** so your unit tests can focus on a component in isolation. For example, it allows test code to run without requiring a real database, without making actual HTTP calls, and without waiting for slow dependencies to produce their lengthy results.  

In Mockito, a **mocked object** is a *test double* whose behavior you control. If you don't specify behavior for a method (via *stubbing*), Mockito supplies a default return. 

A developer can easily **stub out** simple behavior and then verify higher level interactions.  

```{admonition} Good Practice
:class: note
Keep unit tests fast by stubbing all **external I/O**.
```

## Quick Example
  

In code example below, the goal is to test the `UserService` implementation. It depends on the `UserRepository` to perform the action `findNameById`. Instead, we *stub* out *findNameById* to eliminate that dependency and to assure behavior.  
 

```java
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;

class UserServiceTest {
    @Test
    void getsUserName_fromRepositoryMock() {
        // quick mock of a UserRepository. No stubbing. 
        UserRepository repo = mock(UserRepository.class); 

        // quick stub with a canned result, "Ada"
        when(repo.findNameById(42L)).thenReturn("Ada");

        // The UserService depends on the UserRepository.
        // Here we directly inject the dependency with a Constructor Injection
        UserService service = new UserService(repo); 
        String result = service.getUserName(42L);

        // No DB calls actually happen because of the stub.
        // With the stub, the behavior is deterministic and quick.
        assertEquals("Ada", result);
    }
}
```
This shows quick ways to mock and isolate. Here we see:  
* `mock(...)` creates a dummy object.  
* `when(...).thenReturn(...)` stubs the method. It means that when the method is invoked, dependencies (external systems) are not used because we provided the actual behavior.

```{admonition} Good Practice
:class: note
While tht test above may seem *dumb*, you need to zero in on the **concept**. We are **isolating** the code we want to test and **eliminating dependencies**.  

*UserService* does more than just delegate to the *UserRepository*. We are testing all that *UserService* does without testing *UserRepository*.
```
   
## Annotations
Here are some common annotations and what they do:  

| Annotation  | What It Does |
| -------------- | -------- |
| **`@Mock`**   | Creates and manages a mock instance for you. Mockito handles its lifecycle.  |
| **`@InjectMocks`**  | Creates the class under test and injects the mocks into its constructor, fields, or setters. |
| **`@Spy`** | Wraps a real instance; real methods run unless you explicitly stub them. Useful for partial mocking. |
| **`@Captor`**  | Provides a type‑safe `ArgumentCaptor` for capturing method arguments during verification. |
| **`@ExtendWith(MockitoExtension.class)`**| Bootstraps Mockito’s annotation processing (e.g., enables `@Mock`, `@Spy`, `@InjectMocks`).  |

## Mocked but Unstubbed
When an object is *mocked but unstubbed*, the method return the following default values:  


| Category | Default Behavior for Mocked Methods  |
| ------------------------- | ------------------ |
| **Primitives**            | Returns `0`, `false`, or `'\0'` depending on type                                         |
| **Wrappers / Objects**    | Returns `null`                                                                            |
| **Collections & Maps**    | Returns an empty collection/map (e.g., `Collections.emptyList()`)                         |
| **Optional**              | Returns `Optional.empty()`                                                                |
| **Streams**               | Returns an empty stream (e.g., `Stream.empty()`)                                          |
| **void methods**          | Performs no action (no‑op)                                                                |
| **toString()**            | Returns a Mockito‑generated identifier such as: *Mock for MyService, hashCode: 123456*    |
| **equals() / hashCode()** | Uses identity equality — the mock equals itself and has a stable identity‑based hash code |

### Unstubbed but customized
Mockito lets you change what **unstubbed** methods return by choosing a different *default answer*:

1) **Smart nulls** — helpful failure messages  

```java
Repo repo = mock(Repo.class, RETURNS_SMART_NULLS);
```

Unstubbed methods still return "defaults", but references that would be `null` may become *smart nulls* that throw with a helpful message if triggered.  

2) **Deep stubs** — fluent chain-friendly<a href="#footnotes">[1]</a> mocks  

```java
OrderService svc = mock(OrderService.class, RETURNS_DEEP_STUBS);
when(svc.currentOrder().billing().getCurrency()).thenReturn("USD");

// Unstubbed intermediate calls like currentOrder() and billing() return mocks,
// so fluent chains don't throw a NullPointerException.
```

Great for fluent APIs or builders, but use judiciously (can hide design issues if overused).

 3) **Custom default answer**  

```java
Repo repo = mock(Repo.class, withSettings()
        .defaultAnswer(invocation -> {
            // return a sensible default per method/return type
            if (invocation.getMethod().getReturnType() == String.class) return "DEFAULT";
            return RETURNS_DEFAULTS.answer(invocation);
        }));
```

You can program your own strategy for all unstubbed methods.

## Mock, Spy, InjectMocks, Captor
These annotations add greater power and flexibility in your testing.  

Consider this example code:   
```java
@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock // auto-created mock (like Dependency Injection)
    Gateway gateway;    

    @Spy  // partial mock (real unless stubbed)
    Logger logger = new Logger(); 

    @InjectMocks  // PaymentService will receive gateway & logger
    PaymentService service;

    @Captor 
    ArgumentCaptor<String> idCaptor;

    @Test
    void chargesThroughGateway_andLogs() {
        when(gateway.charge(anyString(), eq(100))).thenReturn(true);

        boolean ok = service.process("order-123", 100);

        assertTrue(ok);
        verify(logger).info(idCaptor.capture());
        assertEquals("order-123", idCaptor.getValue());
    }
}
```
**`@ExtendWith(MockitoExtension.class)`:**  
This says, *"Turn Mockito features on for this test class."*  

It tells JUnit to enable Mockito's annotation system. Without it, annotations like @Mock, @Spy, @InjectMock, and @Captor won’t work. MockitoExtension automatically creates mocks, injects them, and handles cleanup.


**`@Mock`**:  
This say, *"Give me a pretend object so the test only focuses on what I'm testing."*  

@Mock *automatically* provides a mock object without you having to create it directly. This is similar to how dependency injection works. You're not manually wiring it together.    

Mockito:  
*   Creates a **mock object** for you. You do *not* need to construct it. Mockito does it for you.
*   Manages its lifecycle during the test.
*   Injects it into your class during testing when used with `@InjectMocks`.

**`@Spy`:**  
This says, *"Use the real object, but let me intercept or override calls if I want."*
*   Wraps a **real object**. This is called a **partial mock**.
*   Real methods run *unless* you override them with stubbing.


**`@InjectMocks`**:  
This says, *"Build an object for me and plug in all the mocks/spies it needs."*
*   Creates the *PaymentService* instance for the test.
*   Automatically injects the `@Mock` and `@Spy` fields into it.

**`@Captor`**:  
This says, *"Capture whatever argument was passed so I can assert on it later."*   

@Captor allows you verify impacts to arguments that were passed to a mocked method.  

## Spies vs. Mocks (quick contrast)

**Mock**: all methods return defaults unless stubbed.  
**Spy**: wraps a real instance; **real methods run** unless you stub them.    

```{admonition} Good Practice
:class: note
When stubbing spies, prefer `doReturn(...).when(spy).method(...)` to avoid invoking the real method during stubbing.
```

```java
MyComponent real = new MyComponent();
MyComponent spy = spy(real);

// Override just one method; others stay real:
doReturn(42).when(spy).compute(); 
```
## What's so Important? ![Billy](../_static/whats_so_important.png)   
* Mockito lets you isolate a class under test by replacing real dependencies with **mocks**, so tests run fast, deterministically, and without touching external systems.  
* Mockito allows a developer to override specific methods during a test via **stubbing**. For example, `when(...).thenReturn(...)` lets you specify exactly what a mocked method should return, allowing you to test logic without relying on real dependency behavior.
* Annotations simplify setup. Here are some annotation:  
    *   `@Mock` creates fake dependencies
    *   `@Spy` partially wraps real objects
    *   `@InjectMocks` wires mocks into the class under test
    *   `@Captor` captures arguments
    *   `@ExtendWith(MockitoExtension.class)` activates all of the above for JUnit 5
* Mockito can test whether methods was called or not, and to inspect the arguments of a method.   

## Footnotes
[1] A **fluent chain** (or *fluent interface*) is a style of method calling where each method returns an object that allows another method to be called immediately, forming a **chain** of calls that reads more like natural language.

Here is a simple example of a fluent chain:  
```java
svc.currentOrder().billing().getCurrency();
```
Each method returns the same object (often `this`), allowing the next method to be called using the chaining pattern. This is a good design, but in Mockito, if any intermediate method in a fluent chain returns `null`, the chain will throw a NullPointerException. Mockito address this with **deep stubs**. This makes fluent chains safe to use in unit tests without having to manually stub every intermediate method.  

```java
// Example Deep Stub to reduce NullPointExceptions in a fluent chain
MyService service = mock(MyService.class, RETURNS_DEEP_STUBS);

// Now, fluent chains succeed because methods return a mock.
```

