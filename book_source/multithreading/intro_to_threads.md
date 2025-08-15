# Introduction to Threads

## What is a thread?
A thread is like a small, lightweight process that runs within a larger program. Think of it as a single path of execution through your program. Multiple threads can run at the same time, allowing your program to perform multiple tasks simultaneously.  

A thread has its own “context”. It has its own stack. It started somewhere unique, has its own local variables, and will end in its own unique way.  

A thread shares the memory space with the rest of the process. Many threads can access the same objects simultaneously.  

Multiple threads does NOT necessarily mean faster execution. It depends on the specific task, resource contention, and the count of CPU cores.  

A process will consist of one or more threads.  

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

```{admonition} Video Q & A
:class: dropdown
**Q: How do we create a Thread?**  
**A:** There is a Thread object, which is different from a "thread of execution." 
The easiest way to create a thread is to:  

    Thread t = new Thread() {
        @Override
        public void run() { }
    };
    t.start();

Other ways to create threads are:  
* Create a thread by creating a `Timer()`.  
* Call `SwingUtilities.invokeLater()`.  
* Use other libraries or Frameworks like the `ForkJoin Framework`.  

**Q: What is the difference between creating and starting a thread?**  
**A:** A Thread object can be created, but that doesn’t actually create a “thread of execution”.
The “thread of execution” is created when we call `t1.start();`

Once a thread is created, it can also be suspended. (see below **TODO**)
A suspended thread can be restarted. 


**Q: Which API are (a)synchronous?**  
**A:**  
Synchronous:  

    Thread t1 = New Thread();  
    t1.run();  
    t1.join();  

Asynchronous:  

    t1.start();

**Q: How to wait for a thread to complete?**  
A: We simply need to call `t1.join();`  

**Q: How are interfaces used?**  
**A:** The Thread constructor takes a `Runnable` interface.
```

