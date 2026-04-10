# JUnit

JUnit is a widely-adopted testing framework for Java that allows developers to write and run automated unit tests. A **unit test** is a small, focused test that verifies the correctness of a single unit of code—typically a method or a small class. JUnit provides a structured way to organize tests, make assertions about expected behavior, and gain confidence that your code works correctly.

In this lesson we will be discussing **JUnit 5** (also called **Jupiter**), the modern standard for Java testing.

```{admonition} Good Practice
:class: note
A well-written unit test should be **isolated**, **repeatable**, **self-validating**, and **focused on a single behavior**. Tests should run quickly and independently of each other.
```

## Guiding Principles

When writing unit tests, certain characteristics make them effective and maintainable. These guiding principles help ensure your tests provide value and don't become a burden. 

* **Independent:** Each test should run in isolation without depending on other tests or shared state. Tests should be able to execute in any order without affecting each other. This prevents cascading failures and makes debugging easier.  

* **Quick:** Tests should execute rapidly (ideally in milliseconds). Slow tests discourage developers from running them frequently, reducing their effectiveness as a safety net during development. A full suite of tests should take at most a few minutes.  

* **Reliable:** Tests should consistently pass when the code is correct and fail when it's not. Flaky tests that pass or fail unpredictably erode confidence in the test suite.  

* **Repeatable:** Running the same test multiple times should produce the same result. Tests shouldn't depend on external factors like network connectivity, file system state, or random number generation.  

* **Understandable:** Test code should be clear and self-documenting. Method names should describe what is being tested and why. Complex setup or assertions should be well-commented.

* **Deterministic:** Given the same inputs, a test should always produce the same output. Avoid using random data, timestamps, or other non-deterministic elements unless you're specifically testing those behaviors.

* **Maintainable:** Tests should be easy to update when the production code changes. Well-structured tests with clear separation of concerns and minimal duplication make maintenance straightforward.

* **Targeted:** Each test should focus on one specific piece of functionality. When a test fails, you should immediately know what behavior is broken, making debugging straightforward and preventing the need to investigate multiple potential issues.

Following these principles leads to a test suite that developers trust and use regularly. When a test fails, you can be confident it's indicating a real problem in the code, not a flaw in the test itself.

```{admonition} Bad Tests Get Turned Off
:class: note
When a test fails too often, or inconsistently, or is too difficult to fix, developers take the shortcut of just turning it off.  
```
## Basic Structure

Every JUnit test follows a predictable structure:

1. **Arrange:** Set up the objects and state needed for the test.
2. **Act:** Call the method or behavior you're testing.
3. **Assert:** Check that the result matches your expectation.

Here's a simple example:

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {
    
    @Test
    void testAddition() {
        // Arrange: Create the object to test
        Calculator calc = new Calculator();
        
        // Act: Perform the action
        int result = calc.add(2, 3);
        
        // Assert: Verify the result
        assertEquals(5, result);
    }
}
```

The `@Test` annotation tells JUnit that this method is a test that should be executed. JUnit will automatically discover and run all methods annotated with `@Test`.

## Common Assertions

JUnit provides a rich set of assertion methods to validate your expectations. Here are the most commonly used:

| Assertion | Purpose |
| ----------- | -------- |
| **`assertEquals(expected, actual)`** | Verifies that two values are equal. |
| **`assertNotEquals(unexpected, actual)`** | Verifies that two values are not equal. |
| **`assertTrue(condition)`** | Verifies that a condition is true. |
| **`assertFalse(condition)`** | Verifies that a condition is false. |
| **`assertNull(object)`** | Verifies that an object is null. |
| **`assertNotNull(object)`** | Verifies that an object is not null. |
| **`assertThrows(Exception.class, executable)`** | Verifies that an executable throws a specific exception. |
| **`assertDoesNotThrow(executable)`** | Verifies that an executable does not throw an exception. |
| **`fail(message)`** | Explicitly fails the test with an optional message. |

Example using various assertions:

```java
@Test
void testUserCreation() {
    User user = new User("Alice", 30);
    
    assertEquals("Alice", user.getName());
    assertEquals(30, user.getAge());
    assertNotNull(user);                    // somewhat useless test
    assertTrue(user.isAdult());
}

@Test
void testInvalidAgeThrowsException() {
    assertThrows(IllegalArgumentException.class, () -> {
        new User("Bob", -5); // Negative age should throw
    });
}
```

## Test Lifecycle and Annotations

JUnit provides several annotations to run code at specific points in a test's lifecycle:

```java
public class UserServiceTest {
    private UserService service;
    private UserRepository repository;
    
    @BeforeEach
    void setUp() {
        // This runs before each test method
        repository = new UserRepository();
        service = new UserService(repository);
    }
    
    @AfterEach
    void tearDown() {
        // This runs after each test method
        // Clean up resources if needed
        repository.clear();
    }
    
    @BeforeAll
    static void setupAll() {
        // This runs once before any tests in this class
        System.out.println("Starting UserServiceTest suite");
    }
    
    @AfterAll
    static void tearDownAll() {
        // This runs once after all tests in this class
        System.out.println("Completed UserServiceTest suite");
    }
    
    @Test
    void testCreateUser() {
        User user = service.createUser("Charlie");
        assertNotNull(user);
    }
    
    @Test
    void testFindUser() {
        User user = service.createUser("Diana");
        User found = service.findUserByName("Diana");
        assertEquals(user, found);
    }
}
```

| Annotation | Frequency | Purpose |
| ----------- | -------- | -------- |
| **`@BeforeEach`** | Multiple times | Runs before each test method; use for setup. |
| **`@AfterEach`** | Multiple times | Runs after each test method; use for cleanup. |
| **`@BeforeAll`** | Once | Runs once before any test in the class; must be static. |
| **`@AfterAll`** | Once | Runs once after all tests in the class; must be static. |

```{admonition} Good Practice
:class: note
Use `@BeforeEach` for test-specific setup such as for initializing objects needed for a test.  

Use `@BeforeAll` sparingly. Use it only for expensive, one-time initializations like setting up a test database or loading shared resources. One of the guiding principles of a good suite of tests is that they run quickly. This can help the tests run more quickly.  

However, another guiding principle of a good suite of tests is that they run independently. One test should not rely on whether an earlier test passed or failed. If there is a shared object across the tests, that object could be uniquely changed by another test's success or failure. This can create an unwanted dependency.  
```

## Testing with Dependency Injection

JUnit works seamlessly with [Dependency Injection](../patterns/dependency_injection). The best practice is to use **constructor injection** in your production code, which makes tests straightforward without requiring Spring or any other framework. This topic is sufficiently discussed in [Mockito](./mockito). 


## Test Names

Test class names typically end with `Test`. Test method names should clearly describe what is being tested, often following the pattern `test[MethodName][Scenario][ExpectedResult]`.

Clear method names makes it easy to understand what each test validates and why it might fail.

```{admonition} Good Practice
:class: note
Each test method should test exactly one behavior or scenario. If you need to test multiple related scenarios, create separate test methods. This makes failures more informative and tests more maintainable.
```

## Running Tests

In VS Code, JUnit tests are most easily run using the Java Extension Pack and the Java Test Runner extension. These tools provide a test explorer sidebar, run/debug icons in the editor gutter, and a clean workflow for executing individual tests or entire test classes.

**In VS Code:** Open the Test Explorer and run a single method, a class, or the whole suite. You can also use the run/debug icons next to `@Test` methods in the editor gutter.
TODO: Show an image of it here.

### Test Discovery

JUnit automatically "discovers" tests by scanning your codebase for methods annotated with `@Test`. The framework uses Java's reflection capabilities to find these annotated methods at runtime. By convention, test classes are typically placed in a parallel directory structure under `src/test/java` and follow naming patterns like `*Test.java` or `Test*.java`.

When you run tests, JUnit will:
1. Scan the classpath for test classes
2. Identify methods marked with `@Test`
3. Execute each test method in isolation
4. Collect and report the results

This automatic discovery means you don't need to manually register or list your tests. JUnit handles it all through the annotations.

### Test Results and Reporting

After running your tests, JUnit provides detailed reporting through what we can think of as a "dashboard" in VS Code or your build tool. This reporting includes:

* **Test Execution Summary:** Shows which tests passed, failed, or were skipped, along with the total count of each.
* **Execution Time:** Displays how long each test took to run, helping you identify performance bottlenecks or slow tests that violate the "quick" guiding principle.
* **Failure Details:** For failed tests, provides stack traces, expected vs. actual values, and clear error messages to aid debugging.
* **Statistics:** Overall metrics like total tests run, success rate, and execution duration for the entire test suite.

In VS Code, the Test Explorer panel updates in real-time as tests execute, with green checkmarks for passes and red X's for failures. Clicking a failed test usually opens the source at the failing assertion.

### Code Coverage

Code coverage measures how much of your production code is exercised by your tests. It's an important metric that helps ensure you're testing all the important paths through your code. In VS Code, code coverage is usually generated by build tool integrations such as JaCoCo with Maven or Gradle, and can be visualized using coverage-focused extensions like Coverage Gutters.

Coverage reports typically show:

* **Line Coverage:** Percentage of executable lines that were executed during testing.
* **Branch Coverage:** Percentage of decision points (if statements, loops) that were tested with both true and false outcomes.
* **Class/Method Coverage:** Which classes and methods were tested.

While 100% coverage isn't always necessary or practical, aiming for high coverage (80%+) on critical business logic helps catch regressions. However, remember that coverage is a metric, not a goal—focus on testing meaningful behaviors rather than chasing coverage numbers.

```{admonition} Good Practice
:class: note
Use code coverage as a guide, not a target. High coverage with poor test quality is less valuable than lower coverage with well-designed, targeted tests.
```

While 100% coverage isn't necessary or practical, aiming for high coverage (80%+) on critical business logic helps catch regressions. However, remember that coverage is a metric, not a goal. Focus on testing meaningful behaviors rather than chasing coverage numbers.

```{admonition} Good Practice
:class: note
Use code coverage as a guide, not a target. High coverage with poor test quality is less valuable than lower coverage with well-designed, targeted tests.
```

## Best Practices

1. **Test Behavior, Not Implementation:** Focus on what the code should *do*, not *how* it does it. This makes tests more resilient to refactoring.

2. **Avoid Test Interdependencies:** Each test should be independent and runnable in any order. Don't rely on shared mutable state or test execution order.

3. **Use Meaningful Assertions:** Don't just assert that something isn't null. Assert the specific values or conditions you care about.

4. **Mock External Dependencies:** Use [Mockito](./mockito) to isolate the code you're testing from slow or external dependencies like databases, APIs, or file systems.

5. **Keep Tests Fast:** Slow tests discourage developers from running them frequently. Mock external I/O and avoid unnecessary setup.

6. **Test the Happy Path and Edge Cases:** Write tests for normal usage, but also test boundary conditions, null inputs, and error scenarios.

```java
// Good: Clear, focused, tests behavior
@Test
void testBankTransfer_insufficientFunds_throwsException() {
    BankAccount from = new BankAccount(50);
    BankAccount to = new BankAccount();
    
    assertThrows(InsufficientFundsException.class, () -> {
        BankService.transfer(from, to, 100);
    });
}

// Avoid: Too broad, unclear intent
@Test
void testTransfer() {
    BankAccount from = new BankAccount(50);
    BankAccount to = new BankAccount();
    assertTrue(from != null);
    assertTrue(to != null);
    // ... unclear assertions ...
}
```

## Integration with Spring Boot

While unit tests should typically avoid Spring (for speed and simplicity), sometimes you need to test Spring-specific components or integrations. For those scenarios, use Spring Boot Test. The sample code below uses `@Autowired` to trigger [Dependency Injection](../patterns/dependency_injection). 

```java
@SpringBootTest
public class RepositoryIntegrationTest {
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testSaveAndRetrieveUser() {
        User user = new User("Eve", 28);
        userRepository.save(user);
        
        User retrieved = userRepository.findByName("Eve");
        assertEquals(user, retrieved);
    }
}
```

Note: Use `@SpringBootTest` only when you genuinely need the full Spring context. For most unit tests, avoid it to keep tests fast and isolated. See the [Spring lesson](spring.md) for more details on testing annotations like `@TestConfiguration`.

## What's so Important? ![Billy](../_static/whats_so_important.png)   
* 

JUnit is the foundation of professional Java development. By writing clear, focused tests with good organization, you'll gain confidence in your code, make refactoring safer, and communicate your intentions to other developers. Start with simple assertions and the `@Test` annotation, graduate to lifecycle methods like `@BeforeEach`, and combine JUnit with [Mockito](mockito.md) for powerful, fast unit tests.
