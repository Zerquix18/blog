---
title: The Sonic new model is really good
description: There's a new model in town, good at tool calls and very, very fast.
date: "2025-08-24T00:00:00.000Z"
tags: ai, sonic, xai, cursor
---

I've been playing with Cursor's new "Sonic" model. This was [announced](https://x.com/leerob/status/1957977611646439628) as a "stealth model by a partner" that we should try. Here's how it creates the folder and file in which this article is written, with a very lazy prompt:

<video width="100%" controls>
  <source src="/assets/the-sonic-new-model-is-really-good/sonic.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

For comparison, this is how Claude Sonnet 4 (non-thinking) does it:

<video width="100%" controls>
  <source src="/assets/the-sonic-new-model-is-really-good/sonnet.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

That is basically half as fast! It does honor its "sonic" name.

Keep in mind that, at the moment of writing this, this repo doesn't have an AGENTS.md or Cursor rules, meaning that there's nothing in the prompt to "guide" the moments to know what to do. They have to figure out the repo structure, by doing tool calls first.

Many rumors, like [the way it does function calling](https://x.com/mark_k/status/1958105227350900819), or the fact it mentions [it's developed by xAI](https://x.com/ryoppippi/status/1958175559936032852), point this to be Grok 4 Code, a new version of Grok specifically for coding.

I was working with Sonic for an entire afternoon in a create-react-app codebase. With very minimal feedback, Sonic was able to implement useQuery/useMutation to replace the use of useEffect for fetching data. It was also able to split React components into multiple subcomponents without breaking anything in a significant manner (I could just say "this is broken" and it would fix the issue).

It doesn't support pasting images, so I had to just paste errors. It does very ocassionally fail a function call/hangs, but it is very rare.

This is a very fast and reliable model. It brings me memories of when [4o came out](https://x.com/Zerquix18/status/1790176610202562821). The speed allows you to iterate so much faster and see what works/what doesn't.

The speed _can be a downside_ for some coding tasks though, since it's hard to keep track of what the model is doing (especially if you have YOLO turned on for some commands), you can't correct course in time. This may be too fast for tasks that are not straightforward.

I'm also happy that Anthropic is getting a little more competition in the tool calling department. To this day, Claude Sonnet remains the most reliable model for coding in my opinion, which means that for serious work, you have to use it and it's one of the most expensive models out there :). But with GPT-5, Sonic (and hopefully an upcoming Google model?), things are improving rapidly.

There are no details of when this model is coming out, but happy to see where things are headed! It's currently free to use in Cursor right now, and I'm very tempted to make it my default.
