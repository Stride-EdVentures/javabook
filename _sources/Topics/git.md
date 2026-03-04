# Git
In this topic, you will learn about both `git` and `GitHub`. You'll learn why and how git is used. This lesson will cover popular commands such as `pull` and `push`, and what a `branch` is. This lesson will discuss merge conflicts and how to resolve them.    

## What is Git?
`git` is a Source Control Management tool. It offers:  

* **History Tracking**  
    * Developers want to have access to every version of a file  
    * Enables rollback to any point in time  
* **Collaboration**  
    * Enables multiple developers to change the same file at the same time  
    * Merges changes and allows humans to do conflict resolution  
* **Server-side backup**  
    * The server can be on the cloud which is backed up  

## History of git
Git does not stand for anything; it's just the name of a version control system created in 2005 by Linus Torvalds, the founder of Linux.
The word "git" is a British slang term, which can refer to a silly, foolish, or annoying person. 
Linus said: Git is "the stupid tool that I made because I was fed up with other systems". 
Git is: distributed, fast, powerful, reliable
Git is: complicated and console based

### Linus Torvalds
> *I'm a bastard. I have absolutely no clue why people can ever think otherwise. Yet they do. People think I'm a nice guy, and the fact is that I'm a scheming, conniving bastard who doesn't care for any hurt feelings or lost hours of work, if it just results in what I consider to be a better system. And I'm not just saying that. I'm really not a very nice person. I can say "I don't care" with a straight face, and really mean it.*   <a href="#footnotes"><sup>[1]</sup></a> 

![Linus Torvalds](../_static/linus_torvalds.png)  

### The Early Days: Manual Version Control
To understand why Git exists, it helps to understand what developers were dealing with before it. Let's discuss the problem Git was built to solve.  

Before dedicated tools existed, developers managed versions by hand. A developer might save files like `project_v1.c`, `project_v2.c`, `project_FINAL.c`, and `project_FINAL_real.c`. This works fine for a single developer working alone, but falls apart completely the moment a second person joins the project. Who has the latest version? Whose changes win? What changed between versions? Nobody knows.

### Centralized Version Control
The first real solution was **Centralized Version Control Systems (CVCS)**, such as CVS (1990) and Subversion (2000). The idea was straightforward: one central server holds the authoritative copy of the code. Developers could check files out, make changes, and check them back in.

```text
        ┌─────────────────────────────┐
        │       Central Server        │
        │    (one copy of the repo)   │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   Developer 1    Developer 2    Developer 3
  (working copy) (working copy) (working copy)
```

This was a big improvement, but it introduced new problems:

* **Single point of failure**: If the central server went down, no one could commit, compare history, or collaborate. Work stopped.  
* **No offline work**: Every meaningful operation (committing, viewing history, branching) required a live connection to the server. Since this was before the internet became ubiquitous, this was a huge productivity problem.  
* **Slow operations**: Networking overhead made common operations sluggish.  
* **Painful branching**: Branching was technically possible but notoriously slow and error-prone. In practice, most teams avoided it.  
* **Lock-based conflicts**: Some tools used file locking, meaning only one developer could edit a file at a time. One developer working on a popular file could block everyone else.  

### Why Git?
By 2005, Linus Torvalds was managing the Linux kernel, one of the largest and most active open-source projects in the world with thousands of contributors across the globe. The version control solution he was using had a licensing dispute<a href=#footnotes><sup>[2]</sup></a> which forced the Linux community to stop using it. Linus looked at the available alternatives and found them all unacceptable. So he spent two weeks writing his own.

Git was designed from the ground up to fix the specific frustrations of centralized systems.

## Centralized vs. Distributed

The key architectural difference between old systems and Git is this: in a **centralized** system, there is one real copy of the repository on a server. In a **distributed** system like Git, every developer has a complete, fully functional copy of the entire repository on their own machine including all history, all branches, and all versions.

```text
    Centralized                         Distributed (Git)
  ─────────────────                     ─────────────────

  ┌──────────────┐                      ┌──────────────┐
  │ Central Repo │                      │ Remote Repo  │  ← GitHub, etc.
  │ (full history│                      │ (full history│
  │  lives here) │                      │  + branches) │
  └──────┬───────┘                      └──────┬───────┘
         │                                     │
  ┌──────┴──────┐                    ┌─────────┴──────────┐
  │             │                    │                    │
 Dev 1         Dev 2               Dev 1               Dev 2
(working      (working           (full local         (full local
 copy only)    copy only)         repo copy)          repo copy)
```

This distinction has practical consequences:

| | Centralized  | Distributed (Git) |
|---|---|---|
| **Work offline?** | No | Yes. Commit, branch, and view history without internet |
| **Server goes down?** | Work stops | Keep working; push when it's back |
| **Branching** | Slow, avoided in practice | Fast, lightweight, encouraged |
| **Backup** | One copy on server | Every developer's machine is a full backup |
| **Speed** | Network-bound | Most operations are local and instant |

Because every developer has a complete copy, there is no single point of failure. If the server disappears, any developer's machine can restore it. This is exactly what Linus needed for a globally distributed project like the Linux kernel, and it's why the model is called *distributed*.

## Git Definitions

* **Repository**: A database that stores all the files along with full version history tracked by Git.  
* **Commit**: A snapshot of your project at a specific time, created from changes that have been staged.  
* **Branches**: Parallel  versions of the repository used to develop features independently.  
* **Staging Area**: A place where you collect and review changes before committing them. Only staged changes go into the next commit.    
* **Merges**: Integrates commits from one branch into another. Git will auto‑merge when possible; otherwise, developers must resolve conflicts manually.  
* **Pull**: Downloads changes from a remote branch and merges them into your local branch.  
* **Fetch**: Downloads changes from the remote without merging them, allowing you to review them first.  
* **Push**: Uploads your local commits to a remote repository.  
* **Pull Request**: A request to merge changes from one branch into another (typically using platforms like GitHub). Used for code review, discussion, and automated checks.  
* **Remote**: A version of the repository hosted elsewhere (e.g., GitHub). “origin” is the default remote name.  
* **Clone**: Copies a remote repository onto your local machine, including its entire history.  
* **Tags**: A human-readable label pointing to a specific commit, typically used for releases (e.g., v1.0.0).  

## Sequence Diagram

```text
┌─────────────────── Local ────────────────────┐        ┌────── Remote ──────┐
│                                              │        │                    │
│  Working Dir     Staging Area     Local Repo │        │    Remote Repo     │
│                                        |<------ git clone ------|          │
│      |<--------- git checkout ---------|     │        │         |          │
│      |                 |               |     │        │         |          │
│      |--- git add ---->|               |     │        │         |          │
│      |                 |--git commit-->|     │        |         │          |
│      |                 |               |------ git push ------->|          │
│      |                 |               |     │        │         | <-- pull request
│      |                 |               |<----- git pull --------|          │
│      |                 |               |     │        │         |          │
│      |<--------- git checkout ---------|     │        │         |          │
│      |<----------- git merge ----------│     │        |         |          │
│      |--- git add ---->|               |     │        │         |          │
│      |                 |--git commit-->|     │        |         │          |
│      |                 |               |------ git push ------->|          │
│                                              │        │                    │
└──────────────────────────────────────────────┘        └────────────────────┘
```
The important concepts are the following:  
* You have a complete copy of everything on your machine.  
* There is a complete copy of everything in the cloud, called the Remote Repo.  
* You *move* the contents from one place to another.  

Here is a *story* that discusses the above diagram:  
> **Step 1 ("Enlist"):** *The first thing that generally happens is the developer `clone`s the repo from the remote server to the local client. This gives the developer a complete copy of all the code--its history and branches.* 
>
> **Step 2 ("Add content to a new branch"):** *This step is done completely on the local computer--no changes to the remote server. The developer creates a new branch so that new files can be added to it. A new branch is created with the command `checkout` (which can also switch to an existing branch). After the files have been authored, they are `add`ed to the Staged Area. The developer verifies and `commit`s the changes to the Local Repo.*  
> 
> **Step 3 ("Save work to the cloud"):** *The developer `push`es the changes to the remote repository. The new branch is now published on the remote server and can be copied to any other developer's machine if desired.*  
>
> **Step 4 ("Pull Request"):** *The developer creates a Pull Request (PR) on the remote hosting service (e.g., GitHub). A PR is a formal request to merge the changes from the new branch into a target branch such as main. Other developers can now review the changes, discuss them, request modifications, and run automated tests. Once approved, the PR is completed (merged), and the new code becomes part of the official project history. All of this happens remotely.*
>
> **Step 5 ("Developer 2 merges with own branch"):** *A second developer wants to bring the newly merged changes from main into their own feature branch. The developer pulls the updated main branch from the remote repo, then checkouts their own branch to make it active, and runs git merge main. If there are no conflicts, Git completes the merge automatically. If conflicts occur, the developer manually resolves them before proceeding.*  
>
> **Step 6 ("Merged code is pushed"):** *If Git performed the merge automatically with no conflicts, there is no need to add files to the Staged Area — Git creates a merge commit automatically. If there were conflicts, the developer fixes the conflicting files, then adds only those resolved files to the Staged Area, commits the merge, and finally pushes the updated branch to the remote repository.* 

## Branches
Think of a Git branch as a separate workspace or a parallel timeline where you can make changes without affecting the main project. A branch lets you explore new features, experiment, or fix bugs safely without breaking anything for other developers.  

In Git, branches are lightweight, easy to create, and easy to delete. Because they all share the same underlying history, switching between them is fast and smooth. 

A branch keeps your work separate from everyone else's. Everyone on the team can create their own branch and no one's changes collide until they're ready to merge. Most teams treat the `main` branch as the clean, stable, *production-ready* version of the code. Branches protect this stability by keeping unfinished work out of the mainline until it's reviewed, approved, and tested.  

### Branching Strategy
Individual developers use branches to isolate their own work. But teams and companies take this further by using branches to organize the entire software development lifecycle. A **branching strategy** is a set of rules a team agrees on for how and when to create, name, and merge branches. It's not a Git feature; it's an engineering practice built on top of Git.

The core idea is that different kinds of work — new features, bug fixes, releases, emergency patches — should never mix until they're ready. Branches make that separation possible and deliberate.

A common strategy used in industry is called [**Git Flow**](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). It defines a small set of long-lived branches, each with a specific purpose, and short-lived branches that feed into them.

```text
  time ──────────────────────────────────────────────────►

  main        ──●──●───────●──────────────────●──────────►
                |  |       ▲                  ▲
                |  ▼       |                  |
  hotfix        |  ●───────●                  |
                │                             |  
  release       │                      ●──────●─●──► 
                │                      ▲        | 
                │                      |        | 
                │                      │        ▼ 
  develop    ───●────●───●────────●────●────────●──►
                  │  |   ▲        ▲        
                  │  |   │        │         
                  ▼  |   │        │ 
  feature-A       ●──├───●        │ 
                     ▼            │    
  feature-B          ●────────────●     
```

Here is what each branch is for:

* **`main`:** The production branch. This is the code that is live and running in the real world. It is *never* edited directly. Code only arrives here through a controlled merge, typically from `release` or `hotfix`. Every commit on `main` represents a version that was shipped to users.

* **`develop`:** The integration branch. Completed features are merged here first. It represents the current state of work that is done but not yet released. Automated tests often run continuously against this branch.

* **`feature` branches:** Short-lived branches created off `develop`, one per feature. A developer works on `feature-login` or `feature-payment` in isolation. When done, it's reviewed and merged back into `develop`. The branch is then deleted.

* **`release` branches:** When `develop` has enough features for a release, a `release` branch is cut. Only bug fixes and release prep (version numbers, documentation) happen here — no new features. Once stable, it merges into both `main` and `develop`.

* **`hotfix` branches:** Created directly off `main` when a critical bug is discovered in production and cannot wait for the normal release cycle. The fix is merged back into both `main` and `develop` so the fix is not lost.

The key takeaway is that no single branch tries to do everything. Each branch has one job. This makes it easy to answer questions like: *"What's currently in production?"* (look at `main`), *"What's been finished but not shipped yet?"* (look at `develop`), or *"Is there an emergency fix in progress?"* (look for a `hotfix` branch).

Not every team uses Git Flow exactly as described. Many teams use simpler or customized variations, but the underlying principle is universal: **branches are how software teams manage complexity at scale.**

## Merge Conflicts
A merge conflict happens when Git cannot automatically combine changes from two branches because the same part of the same file was edited in different ways.
Git doesn’t know which version you want, so it asks you to decide.  

Git marks the conflicting section directly in the file. When students see `<<<<<<<`, `=======`, and `>>>>>>>` that means the file is in conflict and must be fixed manually. Here is an example:  
```text
<<<<<<< HEAD
this is your version from the current branch
=======
this is the other version from the branch being merged
>>>>>>> feature/new-ai
```
There are two general ways to resolve merge conflicts.  
1) **Resolve Manually** in the text editor. The developer will find and remove the special markers (e.g. `<<<<<<<`). It is important to verify that everything is fixed and still works. It can be cumbersome. Once this is done, the developer must `add` the resolved files to the Staged Area, `commit` and `push`.    
2) **Resolve Using Tools** such as VS Code. In the UI, one can click buttons to resolve conflicts. Usually the GUI will provide a side-by-side presentation of the file before and after, highlighting the differences and conflicts. The developer can click a button to accept the current change, the incoming change, or both changes. Regardless, once resolved, the developer must be sure to `commit` and `push` the resolved files.  

## Git ≠ GitHub
It is important to know that `git != GitHub`. 

Although people often use the terms interchangeably, **Git** and **GitHub** are fundamentally different tools with different purposes.
```{admonition} It's simple
:class: note
Git handles **version control**.  
GitHub handles **collaboration and hosting**.  
```

Here is an analogy: **Git** is like Microsoft Word: the application that creates and edits documents. **GitHub** is like OneDrive: a cloud service where you store and collaborate on those documents.  

**Git = the version control system**   
*   Git is **software** that runs on your computer.
*   It tracks changes to files, stores commit history, manages branches, and lets developers work offline.
*   You can use Git **without** any internet connection and **without** GitHub.
*   Other platforms (GitLab, Bitbucket, Azure DevOps) also use Git because Git is simply the underlying version-control tool.

**GitHub = a cloud hosting and collaboration platform**  
*   GitHub is a **website** (and cloud service) built *on top of Git*.  
*   It hosts remote repositories so teams can share work.  
*   It adds features Git does *not* provide:  
    *   Pull Requests  
    *   Code reviews  
    *   Issue tracking  
    *   Permissions and access control  
    *   Automation (or Actions) to preform CI/CD<a href="#footnotes"><sup>[3]</sup></a>   
    *   Project boards, wikis, release management tools  

## What's so Important? ![Billy](../_static/whats_so_important.png)   
* Git handles **version control**. GitHub handles **collaboration and hosting**.  
* There are both remote and local repositories, both of which contain complete copies of branches and version information.  
* We create branches to isolate changes from one another.  
* To avoid merge conflicts, keep your branch up to date by pulling and pushing frequently, and work in small, isolated branches so your changes don't collide with someone else's.    
* Branches are often strategically created to help manage versions, hot fixes, and new feature work without disrupting the stability of the main codebase.  

## Footnotes
**[1]** Linus called himself a *"scheming, conniving bastard"* in an [email](https://lkml.org/lkml/2000/9/6/65)  

**[2]** Linus Torvalds' [BitKeeper blunder](https://www.infoworld.com/article/2211030/linus-torvalds-bitkeeper-blunder.html)  

**[3]** CI/CD == Continuous Integration, Continuous Delivery (or Continuous Deployment)  
> Developers frequently merge their code changes into a shared branch, and an automated system immediately builds the code, runs tests, and checks quality. Every successful build from CI is automatically prepared for release. Deployment can be triggered manually, but every successful build is automatically deployed to production with no manual approval, assuming all tests pass.  
>
> CI/CD is a fundamental part of modern software engineering, ensuring that code is continuously tested, integrated, and delivered with automation and reliability.   
