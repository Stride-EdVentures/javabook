# Good Test Guidelines

> **Good tests protect behavior and intent; bad tests protect structure and syntax.**

Good JUnit tests verify externally observable behavior, protect meaningful rules, and remain stable under refactoring. Bad tests add volume without value: they test implementation details, trivial accessors, object existence, or repeat the code under test. When reviewing AI‑generated tests, prioritize tests that could catch real bugs, explain intent through naming, and fail only when behavior—not structure—changes.

## Test Guidelines
Consider these to separate **valuable tests** from **AI‑inflated noise**.  

1️⃣ **Test behavior and outcomes, not implementation**

| ✅ **Good Tests**                      | ❌ **Bad Tests**                          |
| ------------------------------------- | ---------------------------------------- |
| Verify externally observable behavior | Asserts private fields   |
| Remain valid after refactoring        | Break when implementation details change |
| Assert what the system guarantees     | Assert **how** the system is built           |
 |Verifies visible state changes | |


**Good tests** verify *what the system does*, not *how it does it*.  
**Litmus test:** *“If I rewrote the method but kept the contract, would this test still pass?”* If the answer is *no*, the test is fragile.  

2️⃣ **Don’t restate the implementation in the test**  
AI loves writing tests that simply mirror the implementation line‑by‑line.  

| ✅ **Good Tests**                       | ❌ **Bad Tests**                          |
| -------------------------------------- | ---------------------------------------- |
| Assert results, rules, or constraints  | Recompute the same logic as the code     |
| Uses realistic values that exercise logic | Mirror the algorithm step‑by‑step        |
| Can catch logic bugs                   | Can be wrong in the same way as the code |

**Example smell:**  
If the test can be wrong in the *same way* as the code, it adds little value.
```java
assertEquals(a + b, calculator.add(a, b));
```

3️⃣ **Don’t test getters, setters, or trivial constructors**  
These tests are almost always **low signal** and **high maintenance**.  
These good tests *might* be worth it.

| ✅ **Good Tests**                 | ❌ **Bad Tests**              |
| -------------------------------- | ---------------------------- |
| A constructor enforces invariants  | obj.setX(5);</br>assertEquals(5, obj.getX()); |
| A setter rejects invalid input | Only check object existence  |
| A getter computes derived state | Prove only that Java works   |

**Rule of thumb:** If a failure would only prove that Java works as documented, don’t test it.  

4️⃣ **Every test should fail for a meaningful reason**  
Every test should answer the question: *“What defect would this test catch?”*  
If you can’t name the bug the test guards against, it’s probably noise.  
| ✅ **Good Tests**                   | ❌ **Bad Tests**                 |
| ---------------------------------- | ------------------------------- |
| Identifies a real class of bug | Fail only if code is deleted    |
| Protect important behavior                | Only fails due to formatting, timing, or structure change |

5️⃣ **Prefer fewer, stronger tests over many weak ones**
AI tends to maximize count, not coverage.  
Guideline: One test per behavior, not per method.  
| ✅ **Good Tests**                       | ❌ **Bad Tests**             |
| -------------------------------------- | --------------------------- |
| One test per behavior or rule          | One test per method call    |
| Multiple assertions about **one** scenario | Many nearly identical tests |
| Focus on coverage of **behavior**          | Maximize test count only    |


6️⃣ **Tests should read like specifications**  
A strong test explains why the behavior exists.  
If the test name doesn’t describe a rule or guarantee, the test probably isn’t asserting one.  
| ✅ **Good Test names**                   | ❌ **Bad Test names**                |
| ---------------------------------- | ------------------------------ |
| testWithdraw_throwsException_whenBalanceIsInsufficient | testWithdraw1 |
| testPasswordMeetComplexityRequirements        | shouldWork   |

7️⃣ **Avoid over‑mocking and interaction obsession**
AI often overuses mocks, especially verifying call counts.  

| ✅ **Good Tests**                | ❌ **Bad Tests**                  |
| ------------------------------- | -------------------------------- |
| Mock only expensive or external dependencies | Verifying internal method calls      |
| Assert outcomes, not call choreography     | Asserting “method X was called once” without caring about result |


8️⃣ **Prefer boundary cases over random variation**  
AI often generates many similar tests with “different numbers.”  

| ✅ **Good Boundaries**                     | ❌ **Bad Tests**                        |
| ------------------------------------ | -------------------------------------- |
| Empty vs non‑empty | Use arbitrary or random values         |
| Focus on high‑risk scenarios         | Duplicate logic with different numbers |
| First, last, and beyond limits                | Large datasets with no semantic meaning     |


9️⃣ **Tests should be cheap to understand and maintain**
Complex tests rot quickly—even if they are “correct.”  
If a developer hesitates to update a test, it’s already too complex.  

| ✅ **Good Tests**                | ❌ **Bad Tests**                |
| ------------------------------- | ------------------------------ |
| Minimal setup         | Excessive setup   |
| Clear Arrange / Act / Assert    | Dense or tangled structure     |
| Only the necessary assertions | Looks "scary" |


🔟 **Avoid tests that only test “existence”**
AI loves existence tests.  
| ✅ **Good Tests**                  | ❌ **Bad Tests**                 |
| --------------------------------- | ------------------------------- |
| Verify object is created correctly | Assert `not null`           |
| Test meaningful state  | Test that something was created |
| Tests visible behavior after creation  | Tests nothing of value          |

## Checklist: Approving AI‑Generated JUnit Tests

**Each test should pass *all* items below. If not, revise or delete the test.**

*   ☐ I can explain *what bug or behavior* this test protects.
*   ☐ The test would fail for a meaningful reason.
*   ☐ The test checks **observable behavior**, not internal details.
*   ☐ It would still pass after refactoring the implementation.
*   ☐ The test does **not** only test getters, setters, or object creation.
*   ☐ It tests correctness, rules, or constraints—not Java basics.
*   ☐ The test has a clear **given / when / then** structure.
*   ☐ Assertions are specific and informative (not just `notNull`, `true`, etc.).
*   ☐ The test covers an important edge case (invalid input, empty data, limits, exceptions).
*   ☐ It is not just another random value with no meaning.
*   ☐ The test name describes a **behavior or rule**, not `test1` or `shouldWork`.
*   ☐ Another student could understand the test without reading the implementation.
*   ☐ Mocks replace only external or expensive dependencies.
*   ☐ The test checks results, not internal call sequences.
*   ☐ Setup is minimal and relevant.
*   ☐ I would not hesitate to update this test during refactoring.
*   ☐ If this test failed, I would be glad it caught the issue.
*   ☐ The test exists because it adds value—not because AI generated it.

