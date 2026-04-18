# Introduction to Threads
**First, an analogy.**  

Let's think of a program as a long list of instructions that you are following. There is only one set of instructions written down on paper, and you start at the top and may jump around to different pages depending on the situation. You would be the `main` **thread** executing the instructions of this program.  

Now imagine the program includes the following instruction:  
> Get a friend to follow the instructions on page 4. You will continue to the next instruction below.  

In this situation, the friend is following the instructions found on a different page. The friend works at the same time as you and represents a new **thread**. When the friend is done with their portion of work, they go home.  

Let's get more specific by thinking about building a house. You are the general contractor responsible for hiring workers and coordinating the entire project. Some tasks must finish before others begin. For example, the foundation must be complete before the walls go up, and the external walls must be standing before the roof is built.  

Each contractor has their own set of instructions, but all of those instructions are part of the same overall project. The workers act as if they're the only ones reading their instructions.  

There will be times when workers are active at the same time. In some situations, many workers can be on the same task. For example, several workers may frame the same wall together. When the framers finish their job, they go home, and new workers arrive later to continue the work.  

These workers share materials: a pile of wood used for framing and a limited supply of drills, hammers, and nails. Access to these resources needs to be controlled so two workers do not fight over the same hammer or nail. The construction project breaks if two workers simultaneously grab the same piece of wood and pull in opposite directions. Synchronization of the workers' access to shared resources is required.   

In an uncontrolled workspace, one worker may grab all the nails and then look for a hammer, but no hammers are available. Another worker has a hammer but refuses to give it up until their wall is done. That worker cannot finish without nails. The first worker will not release the nails until they can finish their task, but they have no hammer. Both workers come to a halt. This is called a `deadlock`.  

Each worker can be thought of as a `thread` running in a program. The issues they face are the same kinds of issues a multi-threaded program encounters. In this chapter, we will learn how to coordinate worker threads: create new workers, control access to resources, notify workers of important information, and avoid deadlocks. We will also discuss ways to optimize this orchestration, such as reusing existing workers instead of taking extra time to hire new ones.  

## What is a thread?
A thread is like a small, lightweight process that runs within a larger program. It focuses on a single path of execution through your program. Multiple threads can run at the same time, allowing your program to perform multiple tasks simultaneously.  

A thread has its own "context." It has its own stack<a href="#footnotes"><sup>[1]</sup></a>. It starts somewhere unique, has its own local variables, and ends in its own unique way.  

A thread shares the same memory space with the rest of the process. Many threads can access shared resources simultaneously. This can cause contention and deadlocks. The best way to avoid problems is to limit sharing by using local variables and having exclusive access to their own copies of resources where possible. This is called `mutual exclusion`.   

Multiple threads do NOT necessarily mean faster execution. It depends on the specific task, resource contention, and the number of CPU cores.  

```{admonition} Definition
:class: note
A *thread* is a sequence of instructions that can be executed independently within a program. Threads enable multitasking and parallelism, allowing programs to perform multiple operations simultaneously.
```

## Why Use Threads?
Threads are useful for:
* **Multitasking:** Running multiple tasks at the same time, like downloading a file while updating the user interface.  
* **Responsiveness:** Keeping your program responsive, especially in applications with user interfaces, by performing long-running tasks in the background.  

**Example**
Imagine you have a program that needs to do two things: download a file and update a progress bar. You can create two threads:   
1. Download Thread: Handles the file download.  
2. UI Thread: Updates the progress bar.  
This way, the progress bar can update in real-time while the file is being downloaded, making your program more efficient and user-friendly.  

**Simple Code Example**
Here's a basic example of creating and starting a thread in Java:
```java
class MyTask extends Thread {
    public void run() {
        System.out.println("Thread is running...");
    }
}

public class ThreadExample {
    public static void main(String[] args) {
        MyTask task = new MyTask();
        task.start(); // Start the thread
    }
}
```

## Coding with John
Watch the following video. As you watch, takes notes on the following:  

* How do we create a Thread?  (in 4+ different ways)  
* What is the difference between creating and starting a thread?  
* Which of the Thread API are (a)synchronous?  
* How do we wait for a thread to complete?  
* How are interfaces used?  

<iframe width="560" height="315" src="https://www.youtube.com/embed/r_MbozD32eo?si=5hTdi9iOCo59CI28" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
</iframe>

***

<details><summary>Click here for important Q & A on Video</summary>  

**Q: How do we create a Thread?**   
**A:** There is a Thread object, which is different from a "thread of execution." 
Here are two easy ways to create and start thread:  

```java
    // Anonymous Inner Class used to override the `run` method
    Thread t1 = new Thread() {
        @Override
        public void run() { System.out.println("Running in a thread"); }
    };
    t1.start();

    // Using a Lambda Expression to pass in a Runnable interface
    Thread t2 = new Thread(() -> {
        System.out.println("Running in a thread");
    });
    t2.start();
```
Another way to create a thread is to write a class that implements Runnable.
```java
    class MyTask implements Runnable {
        @Override
        public void run() {
            System.out.println("Running in a thread");
        }
    }

    // Create a thread using the constructor that takes a `Runnable` interface
    Thread t = new Thread(new MyTask());
    t.start();
```

Other ways to create threads are:   
*   Create a thread by creating a `Timer()`.  
*   Call `SwingUtilities.invokeLater()`.  
*   Use other libraries or Frameworks like the `ForkJoin Framework`.  

**Q: What is the difference between creating and starting a thread?**  
**A:** A Thread object can be created, but that doesn’t actually create a “thread of execution”.
The “thread of execution” is created when we call `t1.start();`

Once a thread is created, it can also be suspended. (see below **TODO**)
A suspended thread can be restarted. 


**Q: Which API are (a)synchronous?**  
**A:**  
 
```java
    // Synchronous: Fully complete before the next line begins
    Thread t1 = new Thread();  
    t1.run();  
    t1.join();  

    // Asynchronous: May not complete. There is no waiting! 
    t1.start();
```
**Q: How to wait for a thread to complete?**  
A: We simply need to call `t1.join();`  

**Q: How are interfaces used?**  
**A:** The Thread constructor takes a `Runnable` interface.
</details>

***

## What's so important? ![Billy](../_static/whats_so_important.png)
The following reinforce *what threads are*, *why they matter*, and *what students should be careful about* as they move forward into concurrency and synchronization.  

*   A thread is **a separate path of execution within a program**, with its own call stack and local variables, while still sharing the same memory space as other threads.

*   Threads **enable multitasking and responsiveness**, allowing programs to perform long‑running work (like downloads or calculations) without freezing other tasks such as user interfaces.

*   **Multiple threads do not automatically mean faster programs**. Performance depends on CPU cores, task independence, and how much shared data must be coordinated.

*   **Shared resources introduce risk**, including race conditions, deadlocks, and contention, which is why controlling access to shared data (synchronization and mutual exclusion) is essential.

*   **Creating and starting threads are distinct actions**, and understanding how threads are created, started, coordinated, and waited on is foundational to safe and effective multithreaded programming.


## Footnotes
[1] Stack: **The stack** is a region of memory used primarily to manage **function (method) calls** and local execution state. It follows a *last‑in, first‑out (LIFO)* discipline: when a method is called, a stack frame is pushed onto the stack containing that method’s parameters, local variables, and return address; when the method returns, its frame is popped off.  

The stack is utilized automatically by the runtime during program execution, especially for **control flow and scoping**. It enables fast allocation and cleanup of short‑lived data, enforces method call order, and supports features such as recursion and exception handling.  

Each thread has its own stack. In Java (and most modern runtimes), every thread is allocated a **private call stack** that stores that thread's method calls, local variables, and intermediate execution state. Because stacks are not shared, threads do not see or interfere with each other's local variables, which is a key reason local variables are inherently thread‑safe. When a thread terminates, its stack is discarded.  
