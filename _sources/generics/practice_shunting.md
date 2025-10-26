# <i class="fas fa-pen-square fa-fw"></i> Practice: Shunting Yard


**Question #1**: Use an `ArrayDeque` to declare and initialize a Stack that holds strings. Similarly, declare and initialize a Queue that holds doubles. 

```{admonition} Click to see answer
:class: dropdown hint
```java
Deque<String> stack = new ArrayDeque<>();
Deque<Double> queue = new ArrayDeque<>();

stack.push("Acts like a stack!");
queue.add(93);  // Acts like a queue!
```
**Question #2**: Write a method `reverse` that accepts a `Queue` of Integers as input. It will modify the input queue to be in reverse order. Use only while-loops and a Stack in your implementation.  

```{admonition} Click to see answer
:class: dropdown hint
```java
public static void reverse(Queue<Integer> input) {
    Deque<Integer> stack = new ArrayDeque<Integer>();
    while (!input.isEmpty()) {
        stack.push(input.remove());
    }
    while (!stack.isEmpty()) {
        input.add(stack.pop());
    }
}
```

**Question #3**: What will the following code output?
```java
Deque<Integer> stack = new ArrayDeque<>();
Deque<Integer> que = new LinkedList<>();
for (int n = 1; n <= 16; n++) {
    que.add(n);
}
while (que.size() > 1) {
    while (!que.isEmpty()) {
        int x = que.remove() + que.remove();
        stack.push(x);
    }
    while (!stack.isEmpty()) {
        int y = stack.pop() - stack.pop();
        que.add(y);
    }
}
System.out.println(que.remove());
```

```{admonition} Click to see answer
:class: dropdown hint
Answer: `0`  

Here is how it works...  
The queue is filled with `[1, 2, ... 16]`.  
First outer loop:  
* After the first inner-while loop, the stack is: `[3, 7, 11, 15, 19, 23, 27, 31]`  
* After the second inner-while loop, the queue is: `[4, 4, 4, 4]`  

Second outer loop:  
* After the first inner-while loop, the stack is: `[0, 0]`  
* After the second inner-while loop, the queue is: `[0]`  

The queue has size == 1. We print the only value in the queue: `0`  
```

**Question #4**: Evaluate the following postfix expression: `8  2  1  3  +  -  2  *  /`

```{admonition} Click to see answer
:class: dropdown hint
Answer: `-2`
```

**Question #5**: Construct the **infix** expression that matches the following postfix expression: `8  2  1  3  +  -  2  *  /`

```{admonition} Click to see answer
:class: dropdown hint
Answer: `8 / ((2 - (1 + 3)) * 2)`  

To accomplish this, we evaluate the postfix expression, but we push an expression instead of the result from the math.  
1) Push 8, 2, 1, 3
2) Pop 3. Pop 1. Push `(1 + 3)`  
    Stack is now: `[8, 2, (1 + 3)]`
3) Pop (1 + 3). Pop 2. Push `(2 - (1 + 3))`  
    Stack is now: `[8, (2 - (1 + 3))]`  
4) Push 2  
5) Pop 2. Pop (2 - (1 + 3)). Push `((2 - (1 + 3)) * 2)`  
    Stack is now: `[8, ((2 - (1 + 3)) * 2)]`  
5) Pop ((2 - (1 + 3)) * 2). Pop 8. Push `8 / ((2 - (1 + 3)) * 2)`  
    Stack is now: `[8 / ((2 - (1 + 3)) * 2)]`  
    Queue is empty. Done.  
```


**Question #6**: Watch this animated Shunting Yard video and verify that you can predict each step.

<iframe width="560" height="315" src="https://www.youtube.com/embed/gHniHE_HvhM?si=1de4eWKMj37lALul" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

