---
title: My setup for running agents in parallel
description: A practical setup for running multiple coding agents across separate repo clones without losing context.
date: 2026-05-10 00:00 CEST
tags:
  - agents
  - software engineering
  - productivity
  - workflow
---

For most of the software engineering stuff I do, I rely on agents. Either for researching the task, validating the approach, implementation or reviewing what’s been done, I rely on having some CLI or chatbot running somewhere, which is great because it speeds things up.
But I occasionally get greedy, very greedy, and wonder if I should just sit down and wait until an agent is done working. Maybe I can run another agent separately so I can do more in less time. So here’s the things I’ve learned doing that.

### The tech setup

I unfortunately don’t know how to use git worktrees yet. So big disappointment if you came here to read about that 😔. I find that my current setup works great for me, and will consider learning git worktrees later, and see if that is simpler and better than what I currently have.

TLDR; My repo is basically cloning the repo multiple times, and then running those things completely separate.

Let’s say you have repo `foo` and you want to work on two separate features. What I do is I have two folders with the same repo:
1. `foo-1`
2. `foo-2`

If you cloned them twice, you’ll be on branch `main` for both of them. If these are monorepos (ideally), you can run both apps, and specify a port that matches their number:
1. [`http://localhost:3001`](http://localhost:3001)
2. [`http://localhost:3002`](http://localhost:3002)

And now on your browser, you can use tab groups to group based on the *feature* you’re working on. Because these are numbers, it’s relatively easy to know that feature A goes on 1, feature B goes on 2. The numbers actually help you prioritize, because the most important feature could go on 1, while bugfixes and other small things can always go on 2.

So now you can open your editor (in my case Zed or Cursor) on both repos, and either use the editor or the terminals inside each editor, all dedicated to that *one* feature, based on the number. Using a shortcut (in my case command + \~), you can swap between each editor, as each agent finishes.

The beauty of it is that each swap completely changes the context from one feature to the other, and all your terminals and code are now for that other feature. There’s nothing from the other feature along the way that bothers you.

Once you’re done working on a feature, you will `git checkout main` on that directory, and you’ll know it’s free for your next feature.

If a feature you’re working on gets blocked and you can’t continue working on it, you can continue working on `foo-2` with no problems, and then come back to `foo-1`  right where you left it! No need to stash the code and change to another branch, or even do pnpm install again. It’s like never shutting down your computer, you’re always ready to continue. And it scales to as many as you need, 1, 2, 3 and more, with obvious implications for both your computer’s memory and your mental health.

I think this setup is extremely simple since I always know what I’m working on on 1 or 2. And it’s as easy as going back to main and creating a new branch whenever I’m ready to work on the next thing.

### The Mindset

Mindset here is important. Having multiple streams of work can be valuable but can also come with drawbacks, especially when it comes to managing your cognitive load. Here’s a couple of things I’ve learned:

- Never work on more than 2 things at a time, unless you really think you’re exceptional. You’ll get tired much faster, you’ll make mistakes that are easy to avoid if all your mental CPU is spent on a single task.
- Most times it’s better to plan sequentially, then execute in concurrently. Spend one hour planning and breaking down the problem in multiple smaller problems. Then execute both at the same time and test them both at the same time. Then review the work sequentially again, as that validation is better if all your focus is on it.
- Work a difficult thing and other easier things. Maybe a big feature goes on your `foo-1`  with all your attention there, but a couple of smaller bug fixes go on your `foo-2` . This means 80% of your attention is on `foo-1` but only 20% on `foo-2` , which may not need as much.
- Sometimes… it’s okay. You can do one thing at a time! It’s okay to put all your focus and attention on one thing. You have the rest of your life to get things done, and get them done correctly. Do this because it’s fun and something to experiment/iterate on, not because it’s a necessity. You can get tired/burn out faster if you do this very often.
