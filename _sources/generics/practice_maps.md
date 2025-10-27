# <i class="fas fa-pen-square fa-fw"></i> Practice: Maps

**Question #1**: Write a method `evenValues` that take a `Map<String, Integer>` argument. It will print out every Key that has an even value. As a *BONUS*, output the results with the keys ordered alphabetically (case-insensitive). Note that you **cannot** assume that the map has its keys in sorted order.    

```{admonition} Click to see answer
:class: dropdown hint
```java
public static void evenValues(Map<String, Integer> map) {
    // Soln 1: Not sorted order
    for (String key : map.keySet()) {
        if (map.get(key) % 2 == 0) {
            System.out.println(key);
        }
    }

    // Soln 2: Using Map.Entry. Still not sorted.
    for (Map.Entry<String, Integer> entry : map.entrySet()) {
        if (entry.getValue() % 2 == 0) {
            System.out.println(entry.getKey());
        } 
    }

    // Soln 3: Sort the Keys
    List<String> keys = new ArrayList<>();
    for (String key : map.keySet()) {
        if (map.get(key) % 2 == 0) {
            keys.add(key);
        }
    }
    // Sort the list of keys, using the case-insensitive comparator
    Collections.sort(keys, String.CASE_INSENSITIVE_ORDER);
    for (String key : keys) {
        System.out.println(key);
    }
}

```