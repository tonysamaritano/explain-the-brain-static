---
title: What is the Brain?
date: 2026-02-08
description: How does the brain work as a system of components?
slug: what-is-the-brain
image: /brain_0.png
---

**What is the brain?**

I believe the most important unsolved problem in science and engineering is this: **how do vertebrates learn a model of the world and act on that model?**

The brain, specifically the vertebrate brain, is a collection of components that work together to maximize an organism's ability to survive in its environment. Which naturally raises a question: why did the most successful species on the planet evolve such a large brain relative to its size? And what is it actually made up of?

The most differentiated component of human intelligence is the neocortex — the big wrinkly thing that wraps around the rest of the brain. But other mammals also have a neocortex, and more primitive vertebrates have a cortex or cortex-like analog. What's more interesting is what we have _in common_ with our ancient vertebrate ancestors.

Across all vertebrates — from fish to humans — there is a shared brain template:

- Cortex
- Basal Ganglia
- Medial Temporal Lobe (hippocampus, entorhinal cortex, etc.)
- Thalamus
- Hypothalamus & Amygdala
- Cerebellum
- Midbrain
- Brainstem

They differ in size and sophistication, but the same core parts are there. Birds solved the "cortex problem" differently — they have what's called a pallium, which is functionally equivalent. The octopus/cuttlefish lineage achieved intelligence through a completely separate evolutionary path. But the more we study these very different architectures, the more it looks like there's a common underlying algorithm that reliably produces intelligent behavior.

So why not just use LLMs? They're incredibly powerful — way more powerful than I would have ever predicted. But they exhibit a different kind of intelligence than animals. LLMs discover patterns from pre-recorded, offline datasets. What they lack is continual, in-the-loop learning through acting in an environment. A baby animal doesn't get trained on the combined experience of its ancestors — it has to bootstrap its own model of the world and act in it, quickly, or it dies.

The brain implements mechanisms that allow extremely fast, data-efficient learning from limited experience. At best, understanding those mechanisms will let us build intelligent systems that far outperform the latest models at a fraction of the cost. At a minimum, it's infinitely interesting.

I'm going to be deliberately reductive throughout this series. Almost everything is an oversimplification. But precision without intuition is useless, and I'd rather you walk away understanding the architecture than drowning in caveats.

This is the first post in a series: **Explain the Brain. Build a Brain.** By the end, I'm going to argue that a single algorithm runs across all of cortex — and I'm going to try my best to falsify that hypothesis. But first, we need to understand what we're building on.

Where to start? I've struggled with this question for 15 years. Naively, you'd think "intelligence must be in X structure" but I don't believe that bear out in the data. Intelligence is _likely_ emergent from the interactions between these structures, not isolated to one of the structures. I find it useful to look at the brain as a system where each structure has a responsibility in the system. You remove one of the components, and intelligent behavior falls apart.

Let's talk about neuroscience's favorite case study, patient H.M. (Henry Molaison), just so you can get a taste of what happens when you remove a component of the intelligent system.

In short, poor Henry suffered from an extreme case of chronic and debilitating epilepsy from a childhood bicycle accident. Back in the 1950's there was evidence that the hippocampus was the source of the seizures so he decided to try an experimental procedure: bilateral medial temporal lobectomy. The good news - after removing most of Henry's hippocampi and neighboring structures, like his entorhinal cortex, of the medial temporal structures, Henry ended up living until 82 and no longer suffered from debilitating epileptic seizures! Great! Problem solved - but not really. Henry ended up suffering from the most famous case of severe anterograde amnesia (he could remember past events, but could not store new memories).

What does this real world, human lesion study tell us? At a minimum, Medial Temporal Lobe (MTL) is critical for episodic memory consolidation (along with probably a dozen other things including navigation). What I get from the Henry's unfortunate story is that the brain is a system of components where all of the components must work in concert to produce intelligent behavior.

So, again, where to start? I believe the best way of approaching this is to define what the different component _probably_ do. I'm an engineer by training, so it's not much different than looking at how a car engine works - e.g. camshaft drives the valves for intake and exhaust, without the camshaft, the combustion (power) will not work.

I'm going to ignore a couple components as well (I know, goes against the whole "intelligent behavior requires all components to be working in concert" thing) because I believe it simplifies the problem. We'll focus on the engine of the brain, not the transmission, drive shaft, differential or wheels of the brain, for the moment.

## Thalamus

Without the thalamus, you become a vegetable. That's not hyperbole — it's clinical fact.
So what is this thing? The thalamus is the router of the brain. Almost all external and internal signals touch this component before reaching their destination (notable exception: olfactory signals, which bypass it for evolutionary reasons we'll ignore for now).

You might ask, "where is the thalamus?" Good question — it's in the dead center of the brain. Exactly where you'd put a router if you were designing a system that needed to coordinate signals across both hemispheres and in and out of the brainstem.

You might then ask, "if it routes signals, is the thalamus a gatekeeper of information?" The answer is an emphatic yes. It amplifies or attenuates signals based on context, it coordinates how different cortical regions talk to each other, and — here's the part that should surprise you — it effectively shuts down external I/O during sleep so the brain can shift into a completely different operating mode.

That last point matters. The thalamus isn't just routing information — it's deciding when information gets routed and what mode the entire system is in. Wake vs. sleep. External processing vs. internal consolidation. It's the difference between a network switch that blindly forwards packets and one that understands the state of the entire network and reconfigures traffic accordingly.

We'll come back to that mode-switching when we talk about how memories get consolidated. For now, just remember: the thalamus is the gatekeeper, and nothing gets in or out without its say-so.

## Hypothalamus & Amygdala

When people casually say “reptilian brain,” they are mostly talking about the hypothalamus and amygdala. I probably should separate them, but I’m grouping them because together they play an insanely important role in intelligent behavior. These components are the brain’s internal controllers. Without them, you couldn’t function. They set homeostasis, drive motivation, assign valence (reward vs. punishment), detect threat, and tag what is salient or important.

In car-engine terms, they make sure the engine runs at the right temperature with the right air–fuel mixture, respond appropriately to throttle input, and trigger the check-engine light when something is off.

There are a bunch of other things these components do — like interfacing with the hormonal system — but I think it’s most useful to frame them as the internal controllers of the intelligent system. Without them, the engine literally couldn’t start, let alone run.

## Basal Ganglia

Honestly, this is my favorite component. What’s important about this structure is that it does not contain an explicit model of the world. Instead, it learns to receive patterns and transform them into new signals that maximize reward via feedback from the world. It’s made up of several subcomponents — most notably the striatum — and sits in a central position, logically, between the MTL and the thalamus.

What’s so exciting about the basal ganglia is that this is the first component where we really start to see intelligent behavior emerge. It’s also where our car engine analogy begins to break down, because we’re now inserting an agent into the loop. If the hypothalamus and amygdala are internally controlling the engine, the basal ganglia is using those internal signals to produce useful outputs — like “drive forward, turn, or brake.”

Another exciting thing is how beautifully, evolutionarily conserved this component is. Effectively, it looks very similar, from early fish to humans. When something is that conserved across evolution, it’s a strong signal that it's fundamentally important to how brains — and intelligent systems in general — actually work.

## Medial Temporal Lobe (MTL)

Neurobiologists put **a lot** of research effort into the MTL, specifically the Trisynaptic Circuit (made up of the Entorhinal Cortex, Dentate Gyrus, Hippocampus, and Schaffer Collaterals). There's many other structures in the MTL, like the subiculum and the perirhinal cortex, but I'm going to focus on the Trisynaptic Circuit like everyone else because this seems to be where the magic really happens.

So, let’s ask the important question, ‘What does the MTL do?’ In short, a lot. It’s responsible for episodic memory consolidation, navigation, pattern separation, and stitching together the ‘what, where, and when’ of experience into a unified memory — just to name a few. Okay, great, so it’s responsible for pretty much everything we need to learn from the world… which is kind of wild when you think about it.

With that said, I actually think it’s more revealing to flip the question around and ask: ‘What does the MTL not do?’

**What the MTL does NOT do:**

- It does not directly control muscles or movements.
- It does not select or initiate actions (that’s mainly basal ganglia/cortex).
- It does not store long-term memories permanently (it helps consolidate them; storage becomes distributed in cortex).
- It does not implement low-level sensory processing (that’s primarily sensory cortices).
- It does not run fine-grained motor timing or prediction (that’s cerebellum).
- It does not maintain basic arousal, homeostasis, or motivation (thalamus/hypothalamus/brainstem).
- It does not represent simple stimulus–response habits (that’s largely basal ganglia).
- It does not provide moment-to-moment working memory for most tasks (prefrontal/parietal networks do that).
- It does not act as a single “memory vault.” (Memory is a system, not a location.)

Okay, that’s a lot to work with. As Patient H.M. demonstrated after bilateral medial temporal lobectomy, he was, in many respects, relatively normal. He could recall many memories from his distant past, communicate normally, and maintain his motor skills. He could even learn new motor tasks, like mirror tracing, despite having no conscious memory of practicing them.

What he could not do was form new episodic memories or plan based on recent experiences — which is exactly what you’d expect if the MTL is critical for learning from the world, but not for basic perception, action, or intelligence.

Great, we now understand, functionally what the MTL is _probably_ doing: creating a mental map of the world in the form of episodic memories for later consolidation. From a functional component perspective, it is a really helpful guide for this critical component of the intelligent system.

I could go on and on about all the things that it is able to accomplish and how it accomplishes its function with such a relatively straightforward circuit, but there is one real piece of magic that it does that we are only today starting to understand. The **Sharp Wave Ripple** (SWR).

So, I think the best way to really understand what it’s doing is by activating your own memories that your trisynaptic circuit has already consolidated for you, so you can feel what it allowed you to learn and recall.

I want you to close your eyes and imagine your childhood home. Walk in the front door and “move” room by room. Try to recall as much as you possibly can — the layout of the house, the furniture and where it was placed, what you see when you look out the windows, what’s in the kitchen, even what’s in your refrigerator and cupboards. Take a minute and really walk through it in your mind.

Did you do it? Close your eyes and do it if you didn’t.

Okay, great — my bet is that you can probably recall almost all of the major features of your childhood house, including some remarkable details. Maybe you just remembered the exact plates you had in your kitchen or the color, material, and placement of your favorite couch. Let’s linger on this for a second — all of that was accessible because your **trisynaptic circuit was doing its job**.

Okay, keep your childhood home in memory, and let’s tell the story of how a new memory might get formed (spoiler: it has something to do with the aforementioned SWRs).

Imagine you’re a kid again, and you don’t quite understand how to cook. You’re hungry, and you walk into the kitchen to find a parent cooking a meal on the stove. It smells great — imagine a grilled cheese sandwich, a delicacy as a child. You’re so excited that you naively reach up to try to get that savory, yummy, buttery, cheesy goodness. But — oh no! — you accidentally touch the hot pan your parent was just using to cook the sandwich.

At this point, everything in your child brain goes into overdrive. Your pain receptors fire, your fingers feel different in a very bad way, and you’re flooded with hormones like adrenaline.

This is a significant moment. Your MTL is integrating all of this sensory evidence and internal emergency signals and firing sharp wave ripples like crazy — which we think helps **tag** the moment as something important that is worth consolidating later.

Now you’re done crying, your parent has tended to your minor wound, and you’ve calmed down. You’ve begrudgingly eaten that delicious sandwich, and now you’re tired. Time to nap.

This is when a lot of the magic happens. Your thalamus shifts into a sleep mode, and your MTL and cortex move into a different operating mode — consolidation. Here’s the magic of the sharp wave ripples (SWRs): the MTL **replays** the **tagged** key aspects of the episode that led to the burn back to the cortical regions that were active at the time. In effect, **your MTL is training your cortex**. SWRs are one of the key mechanisms for memory consolidation.

This is how — and why — the next time you see your parent cooking on the stove, you’ll be able to simulate, i.e. remember, what happens if you reach up to a hot pan. I bet you won’t do that again.

In the next post, we’ll move from memory to prediction — and into the neocortex, the part of the brain that actually runs the world model. I’ll argue that a single, repeating algorithm underlies all of cortex, and that understanding it is the key to building truly intelligent machines.