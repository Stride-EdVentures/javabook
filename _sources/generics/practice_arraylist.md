# <i class="fas fa-pen-square fa-fw"></i> Practice: ArrayList

**Question #1:** Which of the following will correctly create an `ArrayList` that holds double values?  

```java
List option1 = new ArrayList<double>();
List<double> option2 = new List<>();
List<Double> option3 = new ArrayList<>();
List<> option4 = new ArrayList<Double>();
ArrayList<Double> option5 = new List<>();
```
```{admonition} Click to see answer
:class: dropdown hint
The correct answer is `option3`.  
Recall:
* An `ArrayList` may only contain `Object` types. We must use `Double` (captial-D).  
* The `new` operator must instantiate a `concrete` type. `List` is **not** a concrete type.  
```
**Question #2:** Which of the following lines have Boxing or Unboxing?
```{code-block} java
:linenos:
    List<Integer> list = new ArrayList<>();
    list.add(5);
    int n0 = list.get(0);
    Integer n1 = list.get(0);
    Integer num = 11;
    int n2 = num;
    int n3 = num.intValue();
    Integer num2 = Integer.valueOf(11);
    Integer num3 = num.intValue();
```
<details><summary>Click to see answer</summary>
See the table:

|line|code|Auto-boxing|Auto-Unboxing|Boxing<br>(explicit)|Unboxing<br>(explicit)|
|----|----|:----------:|:----------:|:------------------:|:--------------------:|
|2   | `list.add(5);`| ✅      |   |       |            |
|3   | `int n0 = list.get(0);`|    |   ✅   |         |           |
|4   | `Integer n1 = list.get(0);`|          |             |                    |                      |
|5   | `Integer num = 11;`|  ✅       |             |                    |                      |
|6   | `int n2 = num;`|          |       ✅     |                    |                      |
|7   | `int n3 = num.intValue();`|          |             |                    |        ✅             |
|8   | `Integer num2 = Integer.valueOf(11);`|          |             |        ✅           |                      |
|9   | `Integer num3 = num.intValue();`|    ✅     |             |                    |         ✅            |

</details>

**Question #3:** What is the output of the following code?

```{code-block} java
:linenos:
    ArrayList<String> words = new ArrayList<String>();
    words.add("Olympia");
    words.add("Everett");
    words.add("Tacoma");
    words.add("Woodinville");
    words.set(1, "Bothell");
    words.add(3, "Kenmore");
    words.remove(0);
    if (!words.contains("Olympia")) {
        String word = words.get(words.indexOf("Kenmore") + 1);
        System.out.println(word);
    } else {
        System.out.println(words.get(1));
    }
```

<details><summary>Click to see answer</summary>
The output is: `Woodinville`  

This is because the list progresses as shown below. After line 8, the list does not contain `"Olympia"` so it gets the element that is after `"Kenmore"`.  

|Index|After line 5|After line 7|After line 8|
|-----|------------|------------|------------|
|0    |Olympia     |Olympia     | Bothell    |
|1    |Everette    |Bothell     | Tacoma     |
|2    |Tacoma      |Tacoma      | Kenmore    |
|3    |Woodinville |Kenmore     | Woodinville|
|4    |            |Woodinville |            |

</details>

**Question #4:** Write a method that will accept an `ArrayList<String>` and manually remove all occurrences of the argument `removeMe`. There are several ways to do this. How many can you implement?    


```{admonition} Click to see answer
:class: dropdown hint
```java
// Method 1: The most basic and expected answer.
// To remove all instances, we need to traverse the list backwards
public static void removeAll(ArrayList<String> list, String removeMe) {

    // iterate backwards. If not, we'll erroneously skip items.
    for (int i = list.size() - 1; i >= 0; i--) {
        if (list.get(i).equals(removeMe)) {
            list.remove(i);
        }
    }
}  

// Method 2: Use the removeAll method.
// We need to create a Collection, or List, with removeMe in it.
public static void removeAll(ArrayList<String> list, String removeMe) {

    // Takes a Collection as an argument.
    // Use the Arrays.asList to quickly create a list with our one element.
    list.removeAll(Arrays.asList(removeMe));
}  

// Method 3: Use the iterator.
// While this uses interfaces, the fact that it uses an interface is
// essentially transparent and can be ignored.
public static void removeAll(ArrayList<String> list, String removeMe) {

    // Ask the list for an iterator that offers the ability to remove
    // an element while iterating through the list. 
    Iterator<String> iterator = list.iterator();
    while (iterator.hasNext()) {
        if (iterator.next().equals(removeMe)) {
            iterator.remove();
        }
    }
}  

// Method 4: Use a lambda expression.
// This is an advanced technique. See Interfaces -> Lambdas
public static void removeAll(ArrayList<String> list, String removeMe) {
      // Removes all elements that match the condition.
      // The condition is a generic functional interface: Predicate<String>.
      // The Functional Interface is fulfilled with a Lambda Expression.
      list.removeIf(element -> element.equals(removeMe));
}  
```

See Also: <a href="../interfaces/lambdas.html#functional-interface">Functional Interface</a>.