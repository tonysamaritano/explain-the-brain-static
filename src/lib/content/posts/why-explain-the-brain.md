---
title: Why Explain the Brain?
date: 2026-02-09
description: The brain is the only system we know of that is truly intelligent. Let's build it.
slug: why-explain-the-brain
image: /brain_0.png
color: #FA5C5C
---

## Something's Missing in AI

I love AI. The latest models are astonishing feats of engineering — I use them every day and am constantly impressed by what they can do. But there’s a catch: these systems are not _truly_ intelligent. The only system we know that actually is intelligent sits between your ears. Evolution already solved the intelligence problem; today’s AI merely approximates it.

## The Cost of Approximation

Today's frontier models work by predicting the next token. The scale required is insane, but surprisingly, it works amazingly well. The issue is that all it’s doing is approximating patterns in the sum of human knowledge — and that approximation requires an almost incomprehensible amount of data.

How much, you ask? Great question. A trillion-parameter model trains on roughly one billion hours of text. At a realistic pace of reading eight hours a day, that's about 340,000 years of reading — roughly 3,000 to 4,000 human lifetimes. Even crazier is the energy required. In terms of turkey sandwich (~300 kcal/sandwich), that's like eating the equivalent of 287 billion turkey sandwiches. Not only would you need to start reading back in the stone age, but you'd need to also eat enough sandwiches that, if they were stacked on top of each other, the tower would stretch about **17 million kilometers — roughly 45 trips to the Moon.**

I don't know about you, but it _feels_ like there must be a better way — and there is. **It's called the brain**.

So why haven’t we reverse-engineered it? Well, neuroscience has spent decades cataloging the brain's structures without producing anything an engineer can build. We have mountains of neuroscience data, detailed neuronal simulations, and beautiful descriptions — but no blueprints an engineer can build from.

The people who understand the brain don't build AI, and the people who build AI don't study the brain. That gap is the problem.

## I'm Not Alone

**The convergence:** The most respected minds in AI and neuroscience are independently arriving at the same verdict: current AI is missing something fundamental, and the brain holds the answer. They each see a piece of it. Each of them has a necessary piece; none of them has a complete, buildable stack. No one has yet closed the loop from brain principle → runnable agent → measurable capability. This project is about assembling the pieces.

**Yann LeCun** (Turing Award, former Chief AI Scientist at Meta, founder of AMI Labs) has publicly called LLMs "useful but fundamentally limited." He left Meta to build "world models" — AI that learns from sensory and spatial data to understand physical reality, not just predict text. His JEPA architecture predicts in latent representation space, not pixel space. _LeCun's position: AI needs internal models of how the world works._

**Karl Friston** (most cited neuroscientist alive, UCL) formalized the Free Energy Principle — the brain is fundamentally a prediction engine that minimizes surprise through both perception and action. His framework of active inference says organisms act on the world to confirm their predictions. _Friston's position: Intelligence is prediction-driven action, not passive pattern recognition._

**Richard Sutton** (Turing Award, father of reinforcement learning) wrote "The Bitter Lesson" — general methods leveraging computation always win. But he now argues LLMs are incapable of continual learning because they lack ground truth, goals, and real world models. He defines intelligence as the computational ability to achieve goals through a stream of experience: actions, sensations, and rewards. _Sutton's position: Intelligence is learned from experience and interaction, not imitation._

**Jeff Hawkins** (founder of Numenta, author of _A Thousand Brains_) proposed that the neocortex is ~150,000 cortical columns, each independently building world models using sensorimotor reference frames. His Gates-funded Thousand Brains Project builds AI that mimics this modular, movement-based learning. _Hawkins's position: Intelligence emerges from many small, sensorimotor world models rather than one monolithic network._

**The synthesis — and where I come in:**

LeCun says build world models. Friston says the brain already does this through predictive action loops. Sutton says learning must come from experience and goals, not imitation. Hawkins says the architecture is modular, columnar, sensorimotor, and reference frame driven. They're all saying the same thing from different angles. Yet, none of them have built the unified system. That's the gap this project exists to close — not by outthinking them, but by translating their convergent insights into buildable, falsifiable architecture.

## My Guiding Force

> **“What I cannot create, I do not understand.”**
>  - Richard Feynman

Understanding isn't knowing the brain structures. It's being able to assemble the irreducible principles that evolution discovered into a system that works. This blog is the public record of that assembly — and all of my inevitable failures along the way.

_If understanding requires building, what must we actually build?_

## What Evolution Solved

**The claim:** Intelligence requires **at least** four things, in this order.

1. **Prewired reflexes** — Evolution gifts every organism a low-dimensional motor system where a small number of signals produce useful movement. No learning required. Without this, you're dead before the first trial.

2. **Sensory grounding** — The organism must be able to predict its own sensory inputs. Without grounding, there is no stable manifold for anything else to work within.

3. **Action-conditioned dynamics** — If you move, you can predict where you'll land in the world model. If the world changes without your action, something external happened. This separation is the core computational insight.

4. **Goal-directed planning** — Once you can predict how actions change the world model, you can search for action sequences that move the world into states that maximize survival.

This is a working hypothesis, not a finished map. This is what I'll be trying to falsify - by **_building_**.

**We'll be able to form hypotheses that are falsifiable from these principles. Each test will have published code. Each test will have a falsification criterion — fewer samples, better generalization, continual learning, or more robust control in embodied agents.**

## Why Do This?

I can't stop thinking about this problem. Something in my wiring won't let it go. Ever since I read Jeff Hawkins' _On Intelligence_ more than 15 years ago, this question has lived in my head: **can we actually build a brain?**

I wrote a Master's thesis on it. Looking back, it was garbage. But the thread kept pulling. Over the next 12 years I built Verge Aero, deployed over 14,000 drones globally, and honed my skills as an engineer and entrepreneur. In parallel, I read every paper and book I could find on computational neuroscience and biologically-inspired AI. I studied how the brain's structures actually work — not just what they're called, but what they compute. And in that time, the field caught up: we now have a much deeper collective understanding of the brain, and insanely powerful tools — PyTorch, frontier models, cheap compute — that didn't exist when I started.

Twelve years of preparation is enough. I'm going to build this in public. Every principle I claim will have code you can run. If a reader builds it and it doesn’t produce a step-change, the principle was wrong — and I’ll say so.

_Build it. Break it. Publish what happened. That's how we'll know._

I'm going to do this whether or not anyone is watching. But I'd rather you come along.