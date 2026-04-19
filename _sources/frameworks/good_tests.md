<style>
    table > thead > tr > th:first-child {
        background-color: #d4edda;
    }
    table > thead > tr > th:nth-child(2) {
        background-color: #f8d7da;
    }
    table > tbody > tr > td:nth-child(1) {
        background-color: #f9fffa;
    }
    table > tbody > tr > td:nth-child(2) {
        background-color: #fff9f9;
    }
</style>
# <i class="fas fa-pen-square fa-fw"></i> Practice: Test Guidelines

Good JUnit tests verify externally observable behavior, protect meaningful rules, and remain stable under refactoring. Bad tests add volume without value: they test implementation details, trivial accessors, object existence, or repeat the code under test. When reviewing AI‑generated tests, prefer cases that catch real bugs, use descriptive names, and remain valid after reasonable refactoring.

## Core Rules
- Test observable behavior and outcomes, not implementation details.
- Don’t recompute or mirror the implementation in tests (that makes tests fragile).
- Avoid tests for trivial getters/setters or plain constructors unless they enforce invariants.
- Each test must fail for a named, meaningful bug — know what defect it protects against.
- Prefer fewer, stronger tests (one test per behavior) over many near‑duplicate tests.
- Mock only external or expensive dependencies; assert results, not call choreography.
- Focus on boundary and high‑risk cases, not random variations of the same scenario.
- Keep tests simple: minimal setup, clear Arrange / Act / Assert, and readable names.

## Quick Checklist
Use this short checklist to approve or reject individual tests (keep if all true):

- I can explain the bug or behavior this test protects.
- The test checks observable behavior and would fail for a meaningful reason.
- It would still pass after reasonable refactoring of internals.
- It is not merely asserting getters/setters or `not null`.
- The test name describes the behavior or rule.
- Mocks are limited to external/expensive dependencies.
- Setup is minimal and focused on the behavior.
- The test covers a relevant edge case or rule, not an arbitrary value.

If a test fails any of the above, revise it to focus on behavior or delete it.


## Detailed Test Guidelines
When looking at AI-generated tests, consider these guidelines to distinguish the gems from the rubble.  

***

```{list-table} Test behavior and outcomes, not implementation
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - Verify observable behavior
  - Asserts private fields
* - Remain valid after refactoring
  - Break when implementation details change
* - Assert what the system guarantees
  - Assert *how* the system is built
```

Good tests verify *what the system does*, not *how it does it*.  
Litmus test: *“If I rewrote the method but kept the contract, would this test still pass?”* If the answer is *no*, the test is fragile.  

***

```{list-table} Don’t restate the implementation in the test
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - Assert results, rules, or constraints
  - Recompute the same logic as the code
* - Uses realistic values that exercise logic
  - Mirror the algorithm step‑by‑step
* - Can catch logic bugs
  - Can be wrong in the same way as the code
```
AI loves writing tests that simply mirror the implementation line‑by‑line.  
Example smell:  
If the test can be wrong in the *same way* as the code, it adds little value.
```java
assertEquals(a + b, calculator.add(a, b));
```


***

```{list-table} Don’t test getters, setters, or trivial constructors
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - A constructor enforces invariants
  - obj.setX(5);</br>assertEquals(5, obj.getX());
* - A setter rejects invalid input
  - Only check object existence
* - A getter computes derived state
  - Prove only that Java works
```
These tests are almost always *low signal* and *high maintenance*.  
These good tests *might* be worth it.
Rule of thumb: If a failure would only prove that Java works as documented, don’t test it.  
  
***

```{list-table} Every test should fail for a meaningful reason
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - Identifies a real class of bug
  - Fail only if code is deleted
* - Protect important behavior
  - Only fails due to formatting, timing, or structure change
```
Every test should answer the question: *“What defect would this test catch?”*  
If you can’t name the bug the test guards against, it’s probably noise.  

***

```{list-table} Prefer fewer, stronger tests over many weak ones
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - One test per behavior or rule
  - One test per method call
* - Multiple assertions about one scenario
  - Many nearly identical tests
* - Focus on coverage of behavior
  - Maximize test count only
```
AI tends to maximize count, not coverage.  
Guideline: One test per behavior, not per method.  
  
***

```{list-table} Tests should read like specifications
:widths: 20 20
:header-rows: 1
* - Good Test names
  - ❌ Bad Test names
* - testWithdraw_throwsException_whenBalanceIsInsufficient
  - testWithdraw1
* - testPasswordMeetComplexityRequirements
  - shouldWork
```
A strong test explains why the behavior exists.  
If the test name doesn’t describe a rule or guarantee, the test probably isn’t asserting one.


***

```{list-table} Avoid over‑mocking and interaction obsession
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - Mock only expensive or external dependencies
  - Verifying internal method calls
* - Assert outcomes, not call choreography
  - Asserting “method X was called once” without caring about result
```
AI often overuses mocks, especially verifying call counts.  

***

```{list-table} Prefer boundary cases over random variation
:widths: 20 20
:header-rows: 1
* - Good Boundaries
  - ❌ Bad Tests
* - Empty vs non‑empty
  - Use arbitrary or random values
* - Focus on high‑risk scenarios
  - Duplicate logic with different numbers
* - First, last, and beyond limits
  - Large datasets with no semantic meaning
```
AI often generates many similar tests with “different numbers.” 

***

```{list-table} Tests should be cheap to understand and maintain
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - Minimal setup
  - Excessive setup
* - Clear Arrange / Act / Assert
  - Dense or tangled structure
* - Only the necessary assertions
  - Looks "scary"
```
Complex tests rot quickly—even if they are “correct.”  
If a developer hesitates to update a test, it’s already too complex. 

***

```{list-table} Avoid tests that only test “existence”
:widths: 20 20
:header-rows: 1
* - Good Tests
  - ❌ Bad Tests
* - Verify object is created correctly
  - Assert `not null`
* - Test meaningful state
  - Test that something was created
* - Tests visible behavior after creation
  - Tests nothing of value
```
AI loves existence tests.  