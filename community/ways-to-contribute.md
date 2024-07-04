---
description: >-
  If you want to contribute to Bacalhau and the Compute ecosystem, we have
  provided a quick list of things we need help with and how you can get started.
---

# Ways to Contribute

{% hint style="info" %}
We welcome your contributions ❤️. If what you want to do is not listed here or you need more guidance, do reach out to us on [Slack (#bacalhau channel)](https://bit.ly/bacalhau-project-slack)&#x20;
{% endhint %}

## Code

You are always welcome to make code contribution to Bacalhau. This can be done by fixing open issues or opening PRs. You can start by cloning the [Bacalhau code repository](https://github.com/bacalhau-project/bacalhau).

## Documentation

With lots of code comes the need for lots of good documentation! If writing technical documentation is your area or you love writing, we would greatly value your contribution!

Before contributing to the Bacalhau docs, please read through our [Style guide](style-guide.md) and check out the [Bacalhau documentation](https://github.com/bacalhau-project/docs) repo.

## Community

For questions, give feedback or answer questions that will help other user product please use [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions).

### Build with Bacalhau

Bacalhau has an extensive list of examples and tutorial that showcase its abilities. However this is just the tip of the iceberg, there are more use cases where Bacalhau can be implemented, if you have a specific idea you want to try out with Bacalhau, we encourage you to do that and build anything that you think is missing.

If you're interested in contributing, please reach out to [contribute@bacalhau.org](mailto:contribute@bacalhau.org) for more information. Include what your interests are so we can make sure you get to work on something fun and valuable.

## Writing Guide

This guide explains things to keep in mind when writing for Bacalhau's documentation. While the [grammar, formatting, and style guide](style-guide.md) lets you know the rules you should follow, this guide will help you to properly structure your writing and choose the correct tone for your audience.

**Walkthroughs**

The purpose of a walkthrough is to tell the user _how_ to do something. They do not need to convince the reader of something or explain a concept. Walkthroughs are a list of steps the reader must follow to achieve a process or function.

Most of the documentation within the Bacalhau documentation project falls under the _Walkthrough_ category. Walkthroughs are generally quite short, have a neutral tone, and teach the reader how to achieve a particular process or function. They present the reader with concrete steps on where to go, what to type, and things they should click on. There is little to no _conceptual_ information within walkthroughs.

**Goals**

Use the following goals when writing walkthroughs:

| Goal          | Keyword     | Explanation                                                       |
| ------------- | ----------- | ----------------------------------------------------------------- |
| **Audience**  | _General_   | Easy for anyone to read with minimal effort.                      |
| **Formality** | _Neutral_   | Slang is restricted, but standard casual expressions are allowed. |
| **Domain**    | _Technical_ | Acronyms and tech-specific language is used and expected.         |
| **Tone**      | _Neutral_   | Writing contains little to no emotion.                            |
| **Intent**    | _Instruct_  | Tell the reader _how_ to do something.                            |

**Function or process**

The end goal of a walkthrough is for the reader to achieve a very particular function. _Installing Bacalhau_ is an example. Following this walkthrough isn’t going to teach the reader much about working with the decentralized web or what Bacalhau is. Still, by the end, they’ll have the Bacalhau Desktop application installed on their computer.

**Short length**

Since walkthroughs cover one particular function or process, they tend to be quite short. The estimated reading time of a walkthrough is somewhere between 2 and 10 minutes. Most of the time, the most critical content in a walkthrough is presented in a numbered list. Images and GIFs can help the reader understand what they should be doing.

If a walkthrough is converted into a video, that video should be no longer than 5 minutes.

**Walkthrough structure**

Walkthroughs are split into three major sections:

1. What we’re about to do.
2. The steps we need to do.
3. Summary of what we just did, and potential next steps.

**Conceptual articles**

Articles are written with the intent to inform and explain something. These articles don’t contain any steps or actions that the reader has to perform _right now_.

These articles are vastly different in tone when compared to walkthroughs. Some topics and concepts can be challenging to understand, so creative writing and interesting diagrams are highly sought-after for these articles. Whatever writers can do to make a subject more understandable, the better.

**Article goals**

Use the following goals when writing conceptual articles:

| Goal          | Keyword                  | Explanation                                                                      |
| ------------- | ------------------------ | -------------------------------------------------------------------------------- |
| **Audience**  | _Knowledgeable_          | Requires a certain amount of focus to understand.                                |
| **Formality** | _Neutral_                | Slang is restricted, but standard casual expressions are allowed.                |
| **Domain**    | _Any_                    | Usually _technical_ but depends on the article.                                  |
| **Tone**      | _Confident and friendly_ | The reader must feel confident that the writer knows what they’re talking about. |
| **Intent**    | _Describe_               | Tell the reader _why_ something does the thing that it does, or why it exists.   |

**Article structure**

Articles are separated into five major sections:

1. Introduction to the thing we’re about to explain.
2. What the thing is.
3. Why it’s essential.
4. What other topics it relates to.
5. Summary review of what we just read.

**Tutorials**

When writing a tutorial, you’re teaching a reader how to achieve a complex end-goal. Tutorials are a mix of walkthroughs and conceptual articles. Most tutorials will span several pages and contain multiple walkthroughs within them.

Take the hypothetical tutorial _Get up and running with Bacalhau_, for example. This tutorial will likely have the following pages:

1. A brief introduction to what Bacalhau is.
2. Choose and install a command line client.
3. Understanding storage deals.
4. Import and store a file.

Pages `1` and `3` are conceptual articles, describing particular design patterns and ideas to the reader. All the other pages are walkthroughs instructing the user how to perform one specific action.

When designing a tutorial, keep in mind the walkthroughs and articles that already exist, and note down any additional content items that would need to be completed before creating the tutorial.

#### Grammar and formatting <a href="#grammar-and-formatting" id="grammar-and-formatting"></a>

Here are some language-specific rules that the Bacalhau documentation follows. If you use a writing service like [Grammarly](https://www.grammarly.com/), most of these rules are turned on by default.

**American English**

While Bacalhau is a global project, the fact is that American English is the most commonly used _style_ of English used today. With that in mind, when writing content for the Bacalhau project, use American English spelling. The basic rules for converting other styles of English into American English are:

1. Swap the `s` for a `z` in words like _categorize_ and _pluralize_.
2. Remove the `u` from words like _color_ and _honor_.
3. Swap `tre` for `ter` in words like _center_.

**The Oxford comma**

In a list of three or more items, follow each item except the last with a comma `,`:

| Use                           | Don’t use                    |
| ----------------------------- | ---------------------------- |
| One, two, three, and four.    | One, two, three and four.    |
| Henry, Elizabeth, and George. | Henry, Elizabeth and George. |

**References to Bacalhau**

As a proper noun, the name “Bacalhau” (capitalized) should be used only to refer to the overarching project, to the protocol, or to the project’s canonical network:

> Bacalhau has attracted contributors from around the globe!&#x20;

> The Bacalhau ecosystem is thriving! I love contributing to Bacalhau's documentation!

Consistency in the usage of these terms helps keep these various concepts distinct.

**Acronyms**

If you have to use an acronym, spell the full phrase first and include the acronym in parentheses `()` the first time it is used in each document.&#x20;

> Virtual Machine (VM), Compute over Data (CoD).

#### Formatting <a href="#formatting" id="formatting"></a>

How the Markdown syntax looks, and code formatting rules to follow.

**Syntax**

The Bacalhau Docs project follows the _GitHub Flavoured Markdown_ syntax for markdown. This way, all articles display properly within GitHub itself.

**Rules**

We use the rules set out in the [VSCode Markdownlint](https://github.com/DavidAnson/vscode-markdownlint) extension. You can import these rules into any text editor like Vim or Sublime. All rules are listed [within the Markdownlint repository](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md).

We highly recommend installing [VSCode](https://code.visualstudio.com/) with the [Markdownlint](https://github.com/DavidAnson/vscode-markdownlint) extension to help with your writing. The extension shows warnings within your markdown whenever your copy doesn’t conform to a rule.
