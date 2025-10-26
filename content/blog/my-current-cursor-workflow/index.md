---
title: My current Cursor workflow and why I believe Cursor is here to stay
description:
date: 2025-10-25 09:22 AST
tags:
  - cursor
  - ai
  - coding
---

A [couple of weeks ago](what-my-ai-stack-looks-like-as-of-september-2025) I wrote about my AI workflow and all of the tools that I use and today I would like to focus a little bit more on Cursor, which is one of my main drivers for coding.

### Why Cursor?

I moved off of VS Code because Cursor Tab seemed more promising than Copilot. I really loved Copilot when it came out, I was even part of the beta, and was [so amazed to see how good it was](https://x.com/Zerquix18/status/1455685424157007875). But Cursor tab and its ability to predict what I may want to do next, the multi-line edits, they just bought me completely. It allows you to focus more on the changes you want to make than in the process of making the changes.

Even to this day, I really love it and can't imagine how coding would be without it. I recently had a coding challenge where they asked me to turn it off, and the experience was horrible. I kept forgetting small things that I'd just usually tab my way to. I would immediately spot the errors, obviously, but it was annoying that I had to manually move my mouse to those parts and fix them.

### The Models

*  **gpt-5-high** and **gpt-5-high-fast** for very complex things. It takes a couple of minutes but the results are really good, so most times it's worth the try. This model is also great for plan mode.
* **claude-4.5-sonnet** or **haiku 4.5** for medium-effort. It's not as smart as GPT-5 High or Codex, but it does the job much faster. If the task already has well setup patterns, this is my go to. I also prefer the way it writes unit tests as opposed to GPT models.
* **cheetah** for very quick, easy things. Oh my God, this model is fast. I ask it to run the linter and clean things up. I ask it to propagate a change that I made in a function or quickly fix tests for a small change I made. It's insane how fast it is!

This combination allows me to move insanely fast when I need to implement something and I know what the end result looks like. For more exploratory tasks or tasks where the result is not 100% clear and I need to run some experiments, I prefer to write the code myself and order it/polish it as I go.
### MCP

I simply don't find it useful for anything coding-related. For things like triaging errors, it's amazing since you can connect to big platforms like Jira or Snowflake. For many things, their CLI tools suffice, don't pollute the context window as much and are more reliable.

### Why it'll stay?

I believe Claude Code and Code CLI are great too, but only Cursor gives me a unified interface where I can use the models they use, and other faster/cheaper options. *It gives you more control*. So much so I can run those other tools when I need them, _inside Cursor_.

After I ask a model something, it'll usually give me code that I may want to clean up (Claude is a big offender here: lots of comments and things I don't need). I can clean those things myself/polish.

You can do combinations like asking the smartest model to plan something with Plan Mode, and then asking the faster/cheaper model to execute. **You can optimize cost/benefit**.

### Any downsides?

Cursor is not as generous with the limits anymore. Tools like Claude and Codex are more generous with the limits. So yes, it is very easy to run out of credits with Cursor with long working sessions or experiments. Cursor was already generous in the past and had to pivot to something more sustainable.

In the end, I think this is another reason why Cursor will win. When the subsidies are no longer there, I believe it'll be a good skill to know which model is good for the job, especially in a couple of years when the use of these tools is priced in in the planning phase of projects.

Right now, we live in a bubble where we're "optimizing", but in a couple of years, this will not be an optimization, it'll just be part of the process.