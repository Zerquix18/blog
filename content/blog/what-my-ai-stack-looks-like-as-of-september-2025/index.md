---
title: What my AI stack looks like as of September 2025
date: "2025-09-05 12:55 AST"
description: ""
tags: ai, tools, productivity, cursor, chatgpt, claude, grok, replicate, xai, openrouter
---

As AI progress continues to accelerate, new tools come out every day that have the potential to make my life (as a developer) easier. I talk about AI tools way too much with friends and coworkers and sometimes it's hard to keep up with all of them.

The goal of this post is to document my current list of tools. This list was very different a few months ago, and will likely be different a few months into the future. I want to keep track of how these change and maybe help out people who would like to try AI tools but don't know where to start!

I use most of these tools for coding, research and personal projects. Some of these are paid, some are free. Some I use every day and others I rarely use them.

[toc]

## Cursor

[Cursor](https://cursor.com) is an IDE, a popular fork of VS Code. I use it for coding and for writing this article. It has many AI features, but the two that I use the most are cursor tab and the agentic mode. There are many competitors with similar features (such as [Windsurf](https://windsurf.com), [Kiro](https://kiro.dev)), and I haven't tried them yet.
I use Cursor both at work and in my personal projects. My current job provides me with Cursor, but I also pay for the $20 subscription for personal projects.

I also use Cursor to run other tools in this post (such as Claude Code and Codex) and ultimately having a place to review the final code before committing. This is more of a VS Code thing, but again, even for the final touches, cursor tab is great.

Cursor has two things that are great and mean that it'll probably stay for a long time.

#### Agentic Mode

Cursor's **agentic mode** (or simply chat) (not necessarily "vibe coding", but just generally asking the AI to do something). This mode now has several competitors, some of which I'll talk about in the rest of this article.

Cursor has a very good agentic mode. It's basically a chat interface where it can search files, edit code, run commands and much more. My most common use cases:

* Implement new features, especially in repositories where the patterns are already set (e.g there's other endpoints or tests that it can use to know the style).
* Lay the foundation for something I need to work on. For example, I want to make a new component: create the necessary files and I'll fill the rest.
* Update the tests after I made manual changes (using things like @Diff of Current State), or add new tests entirely, using the patterns from other test files.
* Make big, repetitive changes across a codebase.
* Run commands I don't necessarily remember:
* * Run the linter and fix the issues.
* * Delete all branches, except for main.
* Using the MCP integration:
* * Pulling documentation from Jira so it's in the context for whatever changes I request.
* * For projects without authentication, using the Playwright MCP so it can test UI changes before I review the functionality/code myself.

The agentic mode is also amazing for testing new models, even if other tools in this post can be used to achieve the same purposes as the agentic mode I listed here.

#### Cursor Tab

**Cursor Tab** is amazing. Even for workflows where I'm actively coding myself ("traditional" coding they'd say), it is very useful to auto complete what you're doing. The autocomplete can replace multiple lines at a time. It can find the patterns of whatever you're doing (e.g I'm deleting comments, or I'm removing whitespace) and autocomplete that as well. In a way, since it came out, I was very happy that Cursor Tab existed, even before agentic coding or "vibe coding" as even a thing.

Even after using agentic mode, I find myself having a better time cleaning up the code / making style adjustments because of how good the prediction is.

#### Background agents

Cursor also has background agents. Basically, you run a prompt and the model goes to work on it on a virtual machine in the background. This is great because you can prompt on a phone or tablet and preview the results by deploying that branch. You can also pick any model that would do a good job for that particular task.

The downside of background agents is that, since you're not necessarily there to stop the model from derailing, you may end up with a horrible result.

I find background agents to be better for very straightforward tasks, where it's very clear what needs to be done, and I prefer to the task in parallel (same prompt with Codex and Jules), and then pick the best result.

## ChatGPT / Codex

#### ChatGPT
[ChatGPT](https://chatgpt.com) is my chatbot of preference. Using GPT 5 Thinking (previously o3) is a blessing. I keep having to tell people (even those who also pay for the same $20 Plus subscription) that they need to switch to this model instead of using 4o or base GPT 5.

Here's what makes it great: General chatbots, even those which have access to Internet search, are very deterministic. They will do a broad internet search and then summarize the results.

GPT 5 Thinking will:
1. Do multiple searches
2. Reflect on the results
3. Decide if they're good enough, otherwise go back to step 1.

This significantly increases the quality of the responses. You are no longer googling something, opening 20 tabs, reading each one of them, coming up with theories, invalidating them, following additional paths, etc., the model is doing all of this for you.

This also means of course, that the seach will take longer, and you don't know when it will end. But the results are spot on and you can then validate the claims yourself.

The projects feature in ChatGPT is also is also fantastic. Each project:
* Has a memory of their own, so you can have multiple chats well organized under a "Project" and keep track of how things have changed.
* Has a base instruction with files. So you can add base knowledge that will be in the context for all the chats.

Examples of things that can be in a project:
* Management of your portfolio (as in you can explain your risk profile, your current portfolio)
* Job search (as in, it can hold your CV as the base knowledge and what your goals are)
* Some kind of theme or project you're working on for which you will be asking several questions across multiple chats

Obviously, ChatGPT has many more features: can create images, voice mode, work with you in canvas, etc. But by far the most useful is its ability to search for answers for a well written question.

#### Codex

[Codex](https://chatgpt.com/codex) refers to the CLI version of ChatGPT and their version of background agents. The CLI version also recently has a VS Code extension. They all have the same name (OpenAI is really bad at naming things), but one could argue the underlying project is the same, except for the presentation.

I've used the CLI and can say it's decent, but I haven't tried it for a heavy workflow yet. I've read comments that it's now almost as good as Claude Code, but haven't run enough tests to confirm that.

I've tried the background agent and can say it's decent too.

They are both covered by the $20 subscription, so if you have ChatGPT Plus, you can use these two tools!

## Claude / Claude Code

At the beginning of the year, I used to use [Claude](https://claude.ai) and ChatGPT more or less at the same frequency. But with ChatGPT's memory features and powerful search, I've found fewer reasons to justify my subscription. I still see a lot of value in:

1. It's good for conversations where you may want to get pushback. It's great for keeping theories in check and not being sycophantic.
2. It's the only major chatbot that supports remote MCPs. You can plug in [Coingecko's MCP](https://mcp.api.coingecko.com/) to get pricing data or [Zapier's MCP](https://zapier.com/mcp) to connect to your beloved, behind-auth services (e.g Google, Facebook, etc.), and get MCP access to things that don't support MCP.
3. Claude Code

#### Claude Code

I think [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) is by far the best coding tool for serious work that there is, even better than Cursor (even though they can use the same model!). You get very generous usage of Claude Code with your $20 subscription.

Claude Code is better at understanding what I want, even if I use the same model (sonnet 4) in Cursor. The quality of the resulting code is also much higher and the result feels much complete and ready-to-commit than with Cursor. It seems like the model spends more time understanding the codebase and the patterns and follows them more closely, so there's less post-work refinement for me to do.

I use Claude Code when I need to implement something well and do a lot of thinking and iterations during the process (it's not just "follow the existing pattern").

In Cursor I have YOLO mode on. It's like "do this while I distract myself with other stuff". In Claude Code, I'm in the zone. Actively reviewing what it's doing and checking if it's on the right path.

I also use Claude Code for CLI processes where I want the model to do something and also deal with any potential issues that arise. Since it's CLI, it's better that I'm there to monitor what's going on and approve commands that will be run. For example, I can ask it to fetch logs from GCP, analyze them and turn them into structured data (good for recovering from an incident).

## Google / Gemini / Jules

I don't use Google AI products too much. I think their base models aren't great, because they are not good at tool calling.

I use:
1. **[Gemini](https://gemini.google.com/app)**: Mostly to get summaries of Youtube videos and ask questions about them. Sometimes to get summaries of what a whole channel has been posting. On this second case, there's a luck component because again, the models may do the wrong tool call.
2. **[Gemini CLI](https://github.com/google-gemini/gemini-cli/)**: I've tried it to make WordPress themes (because of the massive context size). The design wasn't great and again there's a struggle sometimes with the tool calls. It supports MCP much like Claude Code or Cursor and it's free to use with a personal google account.
3. **[Jules](http://jules.google/)**: This is by far the best out of the three. It's their version of background agents / codex. For the simple tasks that I've given to it, it has done a good job.

I think Google has a chance to beat everyone else on this race (they have the talent, the TPUs and the unlimited cash), so I'm hoping that the next version of this article has better things to say.

## Grok

For xAI's [Grok](https://x.ai), I use:

1. **Grok Code** in cursor, by far the best model for simple task. It is mad fast
2. **Grok on Twitter** to get extra context for a tweet. There is simply no need to tag it - there's an icon at the top of each tweet.

## OpenRouter / Replicate

For personal projects, I use [OpenRouter](https://openrouter.ai) to get programatic access to models. [OpenRouter](https://openrouter.ai) is great because with a single API key and funding a single account, you get access to most models and they also take care of picking the right provider. This is much easier than doing it yourself, both the process of setting up the API key (Google's process is horrendous), and the process of knowing which provider has better uptime and lower latency.

[Replicate](https://replicate.com) is a provider I use to programatically generate images. It has support for top providers too. They support all kinds of models, not just image ones.

## Final Thoughts

There's never beeing a better time for someone who loves learning and automating things. With the fierce competition, I think we as consumer stand to win, and there's so much to try and more incoming.

I question how sustainable the business model for some of these products is. I expect some of them to hike prices over the next months or years. In fact, Cursor has already done so with great pushback.

But the need for these things is here to stay. One of the reasons why I like to try many tools is not just so I can see which tools work for what purposes, but also to consider cost and when it's preferrable to use one over the other.

If you were to ask me for a base set of tools today for someone who hasn't interacted with any of these yet:
1. Cursor for IDE - can try all the models from there. Use Grok Code for easy stuff, Sonnet 4 for more complicated stuff, GPT-5/Opus 4.1 for the greatest challenges.
2. ChatGPT for all the rest

But if you're a power user, then it's on you to identify the workflows and models that work best for you :)
