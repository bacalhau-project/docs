---
description: >-
  If you want to contribute to Bacalhau and the Compute ecosystem, here is a
  list of things that need help and instructions for getting started.
icon: toolbox
---

# Ways to Contribute

:::info
We appreciate any help that would improve Bacalhau. If you need more guidance, reach out to us on [Slack (#bacalhau channel)](https://bit.ly/bacalhau-project-slack)\&#x20.
:::

## Code

You can contribute to the Bacalhau code by opening an issue with a bug report, requesting a feature, suggesting changes, and others. You can also clone the [Bacalhau code repository](https://github.com/bacalhau-project/bacalhau) and submit a pull request for an open issue.

## Documentation

With lots of code comes the need for lots of good documentation! If writing technical documentation is your area, or you love writing, we greatly value your contribution!

Before contributing to the Bacalhau documentation, please read through our [Style guide](style-guide.md) and check out the [Bacalhau documentation](https://github.com/bacalhau-project/docs).

## Community

For questions, feedback, or answers to questions that help other users, use [GitHub Discussions](https://github.com/bacalhau-project/bacalhau/discussions).

### Build with Bacalhau

Bacalhau has an extensive list of examples and tutorials that showcase its abilities. However, this is just the tip of the iceberg; there are more use cases where Bacalhau can be implemented. If you have a specific idea you want to try out with Bacalhau, we encourage you to do that and build anything that you think is missing.

If you are interested in contributing, please email [contribute@bacalhau.org](mailto:contribute@bacalhau.org) for more information. Include your interests so we can ensure you get to work on something fun and valuable.

## Writing guide

This guide explains what to keep in mind when contributing to Bacalhau documentation. While the [grammar, formatting, and style guide](style-guide.md) outlines the rules to follow, this guide helps you structure your writing properly and choose the correct tone for your audience.

### Walkthroughs

The purpose of a walkthrough is to instruct the user _how_ to do something. You do not need to convince the reader of something or explain a concept. Walkthroughs are a list of steps the reader must follow to achieve a process or function.

Most of the Bacalhau documentation project documentation falls under the _Walkthrough_ category. Walkthroughs are short, have a neutral tone, and instruct the reader on achieving a particular process or function. The instructions contain steps about where to go, what to type, and the actions to perform on the User Interface. There is little to no _conceptual_ information within walkthroughs.

#### Components

The scope for some of the components in a walkthrough are as follows:

| Component     | Keyword     | Scope                                                             |
| ------------- | ----------- | ----------------------------------------------------------------- |
| **Audience**  | _General_   | Easy for anyone to read with minimal effort.                      |
| **Formality** | _Neutral_   | Slang is restricted, but standard casual expressions are allowed. |
| **Domain**    | _Technical_ | Acronyms and tech-specific language are used and expected.        |
| **Tone**      | _Neutral_   | Writing contains little to no emotion.                            |
| **Intent**    | _Instruct_  | Instruct the reader _how_ to do something.                        |

#### Function or process

The end goal of a walkthrough is for the reader to achieve a very particular function. _Installing Bacalhau_ is an example. Following this walkthrough doesn’t teach the reader much about working with the decentralized web or what Bacalhau is. Still, the user would have the Bacalhau Desktop application installed on the computer by the end.

#### Short length

Walkthroughs tend to be short because they cover one particular function or process. They typically take between two and ten minutes to read. Most of the content in a walkthrough is a numbered list. Images and GIFs can help the reader understand what they should be doing.

When a walkthrough is converted into a video, that video should be at most five minutes.

#### Walkthrough structure

Walkthroughs are split into three major sections:

1. What you are about to do.
2. The steps you need to do.
3. Summary of what you just did and potential next steps.

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

> Bacalhau has attracted contributors from around the globe!

> The Bacalhau ecosystem is thriving! I love contributing to Bacalhau's documentation!

Consistency in the usage of these terms helps keep these various concepts distinct.

**Acronyms**

If you have to use an acronym, spell the full phrase first and include the acronym in parentheses `()` the first time it is used in each document.

> Virtual Machine (VM), Compute over Data (CoD).

#### Formatting <a href="#formatting" id="formatting"></a>

How the Markdown syntax looks, and code formatting rules to follow.

**Syntax**

The Bacalhau Docs project follows the _GitHub Flavoured Markdown_ syntax for markdown. This way, all articles display properly within GitHub itself.

**Rules**

We use the rules set out in the [VSCode Markdownlint](https://github.com/DavidAnson/vscode-markdownlint) extension. You can import these rules into any text editor like Vim or Sublime. All rules are listed [within the Markdownlint repository](https://github.com/DavidAnson/markdownlint/blob/master/doc/Rules.md).

We highly recommend installing [VSCode](https://code.visualstudio.com/) with the [Markdownlint](https://github.com/DavidAnson/vscode-markdownlint) extension to help with your writing. The extension shows warnings within your markdown whenever your copy doesn’t conform to a rule.
