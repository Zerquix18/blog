---
title: Things I tell myself to stay sane in an AI-accelerated world
description:
date: 2026-02-23 00:00 CET
tags:
  - ai
  - software engineering
  - thoughts
---

There's a lot happening in the AI world now (for the past 3 years, it just doesn't matter when you read this). Every day we're getting better models across all modalities, and for agentic work, they're every day more capable of working for longer hours. It seems like in the future, most of our jobs will be running teams of agents.

As someone who's done software development for more than half his life, being something I would do even if money isn't an issue, there's a lot of food for thought about the future of my career.

I titled this "things I tell myself" because I never know if I'm just coping or there's actual, valid reasons to stay sane. I keep going from "it is so over" when a new model comes out and tops the benchmarks and even user sentiment, to "we are so back" every time the same model does something stupid that I wouldn't do.

So here's a list of reasons why I tell myself that knowledge work (and perhaps more specifically software engineering, is something that will stay).

### AI does not have experience, and so it can never have taste

One of the reasons why I dislike background agents, ralph loops or even my own attempts at having my own clawdbot do work for me during heartbeats is that in those setups, there's no way to stop an agent that derails. An agent is one bad decision away from turning a lot of productive work into unrecovable slop that has to be redone (and you still have to pay for those useless tokens).

AI does not have taste and it will never have it, because it can't experience things.

I know a lot of engineers who I respect, who have wildly different opinions on the same things. These opinions are molded by years of experience: trial and error. This doesn't happen just in software engineering, but the point is the same: past experience gives you a solid direction on how to do things and what to avoid based on intuition.

The day you learn through a mistake that having two sources of truth for something means that at some point, they will go out of sync, is the day you become almost religiously against the idea of ever having multiple sources of truth. You form strong opinions, become assertive, and you'll argue and even quit your job if someone asks you to do something that you know will unequivocally fail based on past experience.

AI possesses none of this. It can know about best practices, but it doesn't have an opinion of them. You may see it's in favor of all opinions, because it simply doesn't care, it'll do what you say and build on top of any bad pattern or decision that any good engineer would immediately ask to refactor.

A lot of the good decisions that models make such as Opus and Codex are due to RLFH and they only help with syntax and how to do the most common things. They can't simply account for all situations.

The moment a vibecoded app has no taste, it becomes slop. And we've all collectively decided that we hate slop with passion.

### Some projects matter, others do not

You may say that I only care about taste and good code because I'm a software engineer and I obviously care about my craft. But a lot of the explosion I've seen in "vibecoding" is for new projects. The impact on existing projects and especially projects that already make money is a lot more mixed, ocassionally making things worse when something goes unreviewed.

3 years ago, I thought customer service agents would be the hardest hit by AI and the entire job would likely by automated. I think a lot of them are not greatly implemented, but to finish this point: the cost of failure in that industry is high. And so we don't see CS agents being entirely replaced. We may see bots as the first line of defense, and we hate when they fail and act stupid, so ultimately we want talk to someone who may even be better at describing the problem than we are.

In software engineering, we are very fault tolerant. Software is failing all the time. We take it for granted. So it's no wonder that this is an industry where automating everything in a non-deterministic, non-stressed manner has succeeded the most. But this is only true for non-critical software that doesn't make money.

Good software engineering is needed for anything that matters: anything that someone relies on or makes money. Slop doesn't make money, or at least not for a very long time.

And so I think that explains why you can vibecode a lot of small apps but for projects that are important you still need to review and test the code, and keep things consistent. Someone needs to hold a mental model of the app and enforce rules: think ahead to see what tech debt is ok to have, what should be refactored, where new things fall. Existing projects which matter will move slower even if AI speeds up the code generation part. You can't one-shot your way out of maintenance, that only works for new projects.

### At some point, tokens will not be subsidized

I have no evidence to claim that tokens by major labs are subsidized. But the $20/$200 subscriptions that we pay for, definitely give us more tokens than we would pay if we just used an API key. And if tokens over the API are already subsidized, we're talking about a subsidy inside a subsidy. Subsidiception.

This is understandable now because major labs can't increase prices without losing significant market share, but at some point this will no longer hold.

Even if prices per token continue to decrease, especially because of open source models, at some point we should expect to me be more mindful about cost. Right now it's almost as if we had unlimited tokens.

Whenever that happens, knowing which model works best at the lowest price and the fastest speed for a _particular use case_ will be an important skill to have, like whoever decides whether to go with AWS/GCP/Azure for a company.

This will also mean being more mindful about what we prompt and making sure the agent is in the right path. Ralph loops won't be economically viable. You'd literally have to "throw more money at the problem", at which point you better hire someone who knows what they're doing (and uses AI).

### This change takes time

Another thing I like to think about is that we're in a bubble when we're at the frontier, and the rest of society takes a long time to adapt. This means we have time to adapt as well, and see how our own work changes.

The way I see it is that:

1. We will be working with lots of agents much more.

2. PMs/Stakeholders will generate prototypes, then give us to the engineers to ensure consistency/stability/keep an updated mental model, in the form of code or just "prompt requests" (borrowing from Pete Steinberger).

3. There will be an extra layer of knowledge for accuracy, cost, speed and harness for given tasks or ranges of tasks. Right now this is pure trial and error, but people will have this knowledge better defined in the future.

4. If demand for reliable software persists and even increases, the layer of knowledge for agent orchestration may be its own speciality area, completely removed from the person actually reviewing or generating the work. Think of it as the cloud architect for agentic work.
