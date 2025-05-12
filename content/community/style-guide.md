---
sidebar_position: 20
---

# Style Guide

:::info
This guide explains things to keep in mind when writing for Bacalhau’s documentation.
:::

The Bacalhau documentation aims to provide information on how to transform data processing for large-scale datasets to improve cost and efficiency. Our purpose is to open data processing to larger audiences, and our documentation set reflects this intention.

The primary objective of the Bacalhau documentation style guide is to help authors write clear and accurate information while facilitating consistency across all documentation. In this way, we can collectively create valuable learning materials that help developers learn and process data with Bacalhau.

## Style, Voice and Tone

Our goal is to use conversational tone that is natural, and friendly towards the reader and also ensure that the document's content is simple and easy to follow.

### Friendly and Open

As we write for a large global audience, we aim for a universally accessible voice.

1. Maintain a friendly, informal tone, but focus on being clear and concise in a knowledgeable manner.
2. Avoid the use of slangs and colloquial language.
3. Avoid offensive language in all forms, and toward all identities and cultures.
4. Write in the second person (e.g. **You can…**), present tense to guide the reader to their intended outcome.
5. When writing consider that many users are not native English speakers.
6. Use languages that encourages readers and walk them through the steps to achieve the outcome they’re looking for.

The goal is for readers to leave with a feeling of accomplishment and satisfaction while gaining information efficiently and solving their problems in a way that helps them thrive with Bacalhau.

### Comprehensive and Technically Correct

Our documentation should reflect our purpose, giving the appropriate amount of technical detail and clarity needed in a way that is palatable to all audiences. As best as we can, our documentation should reflect industry-standard practices and inspire trust in our voice and project. To do this,

1. Ensure that your word choice does not reflect an assumption of the reader’s knowledge level (e.g, using _easy_, _simple_, _quick_, etc) or exclude the detailed explanations or background needed to be successful.
2. Provide the commands needed to be successful with explanations of the ‘why’ behind the command is preferred when appropriate, with the goal of the reader both gaining their expected outcome and learning in the process.
3. To ensure clarity, start by briefly specifying the context of the current topic.
4. Share abbreviations and acronyms with at least one reference to its full name or title on the page to inspire deeper learning into Compute.
5. In non CLI-based references, capitalize **Bacalhau**, **Docker**, **Compute** and other program/project names.
6. Test each code snippet and example, walking through each step to ensure accuracy as it's written.

With these guidelines, we can provide a comprehensive set of documentation that is clear, actionable, and helpful.

## Structure

The Bacalhau documentation set should include articles and tutorials that have a consistent structure, which includes an introduction and the procedural steps necessary for a reader to get to their expected outcome.

### Structure Guidelines

The specific structure depends on the type of documentation you are writing. On general note, the documentation should include: an introduction, a conclusion, and any prerequisites necessary for a reader to get started.

Most of the tutorials and examples we publish are procedural, which walk the reader through accomplishing a task step-by-step. The structure for a procedural documentation should be:

```
Title (H1)
Introduction (paragraph)
Prerequisites (H2)
Doing the First Thing (H2)
Doing the Next Thing (H2)
…
Doing the Last Thing (H2)
Need Support? (H2)
Contributing (H2)
```

If the documentation is conceptual:

```
Title (H1)
Introduction (paragraph)
Prerequisites (optional) (H2)
Subtopic 1 (H2)
Subtopic 2 (H2)
…
Subtopic n (H2)
Need Support?  (H2)
Contributing (H2)
```

In this way, readers can learn and hop to pertinent information as they need efficiently, and find answers when they need.

## Formatting

Our documentation is written in [Markdown markup language](https://www.markdownguide.org/basic-syntax/). The following rules explain how we organize and structure our writing.

### Titles

All titles should follow [title case capitalization structure](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case).

```
❌ Get started with bacalhau
✅ Get Started with Bacalhau
```

### Headers

Titles should be an H1 header. Introduction, prerequisites, steps, and conclusion should all have H2 headers.

```
Title (H1)
Introduction (paragraph)
Prerequisites (H2)
Doing the First Thing (H2)
Doing the Next Thing (H2)
…
Doing the Last Thing (H2)
Need Support? (H2)
Contributing (H2)
```

### Meta Description

All pages in the document should have a **front-matter** description which briefly summarizes the contents of a webpage.

```markdown
---
description: This shows up in the search results, underneath the title tag.
---
```

### Code Blocks

Use Code Block formatting option for the code blocks. It should be used for:

1. Commands the reader needs to execute to complete the tutorial
2. Files and scripts
3. Terminal output
4. Interactive dialogues that are in text

```bash
bacalhau docker run ubuntu echo Hello World
```

Do not include the command prompt ($ or #) in the code block

### Inline Code Blocks

Use a Code formatting option for inline code examples. It should be used for:

1. Command names, like `bacalhau docker run`
2. File names and paths, like `/inputs`
3. Example URLs, like `http://your_domain`
4. Command flag like `--gpu`

### Hints

The hints include:

1. **info**: Use to add some supplementary information to a section or point that could benefit from some highlighting to draw the reader’s attention.
2. **success**: Use to add some guidance on how to carry out a step and show achievements.
3. **warning**: Use to make the reader aware they need to be careful when acting on some advice.
4. **danger**: Use to indicate that there are dangers or consequences associated with some information or steps.

Here’s an example of an Info hint:

:::info
**Info hints** are great for showing general information, or providing tips and tricks.
:::

### Bold and Italics

Bold text should be used for:

1. list item
2. Emphasis on words, project names etc

Italics should be used in inline list. For example (e.g, _easy_, _simple_, _quick_, etc)

## Need Support?

If have questions or need support or guidance, please reach out to the [Bacalhau team via Slack (#bacalhau channel)](https://bit.ly/bacalhau-project-slack)

## Contributing

If you have any hints, tips or suggestions to add, check out the different [ways to contribute to Bacalhau](./ways-to-contribute.md).
