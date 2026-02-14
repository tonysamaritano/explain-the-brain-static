---
title: How Latent Dynamics Work
date: 2026-02-14
description: What is the function of dynamics? How do you learn a dynamics model on a grounded manifold? And what does it even mean to have dynamics on an invariant manifold? This post answers all that and more.
slug: how-latent-dynamics-work
image: /dynamics_0.webp
color: #FF413A
---

Useful dynamics require grounding. You can't build a dynamics model on a shaky foundation. Before reading this post, make sure you ground yourself and at least get the intuition for [grounding in this post](https://explainthebrain.ai/blog/what-is-grounding).

So what are dynamics? Let's start with what it is not: dynamics are not a map. The map is the manifold learned via grounding. Dynamics are how you move on that map, conditioned by a control signal.

For example, you find yourself standing outside Penn Station in NYC and you know NYC very well. First, you need a control signal — where are you going? Let's say Central Park. Well, if you have a well-tuned dynamics model of NYC (because you’ve walked it a lot), you'll know that you need to head north. But what if you want to go to the Brooklyn Bridge? Then you head south. Your starting point was the same in both cases. Only the control signal changed — and the control signal determined the direction. That's a goal-conditioned vector field. It needs two things: where you are and where you’re going.

Let’s do two quick experiments so you can _feel_ the dynamics model in your own head.

Finish this sentence: "That's one small step for man, one giant leap for **BLANK**."

My guess is you thought "mankind." Why? That sentence anchored you on a learned manifold, and your dynamics model pushed you to what usually comes next. There was a vector from "one giant leap for" to "mankind." If I had ended it with "penguins," you'd instantly feel something was off and ask, "Wait… penguins never went to the moon, right?"

Now something physical — because dynamics aren't just for language. Reach out your arm. Did you do it? Now make a fist. That's it. Dynamics at work. You predicted a word and you moved your arm — same mechanism, same principle. A starting state, a control signal, and a dynamics model that knows what usually comes next.

## How the Dynamics Model Works

I've been trying to keep these experiments as simple as possible to uncover principles, not maximum performance, so these experiments were done using the simplest possible models I could.

What we start with is a pretrained encoder-decoder from the [grounding experiment](https://explainthebrain.ai/blog/what-is-grounding). The encoder gives us a locally smooth latent space that behaves like a manifold — it's like having a map of the MNIST dataset in latent space. The simplest possible dynamics model that I tried (and it works) is a multilayer perceptron that learns the vector field, conditioned on a control signal and our starting location.

It's like having a compass. We know where we are on the map and our dynamics model points the compass in the direction (and magnitude) we need to move to arrive at our destination.

In the most simple terms, here's the dynamics model:
```python
class DynamicsMLP(nn.Module):
    def __init__(self):
        super().__init__()
        latent_dim = 64
        hidden_dim = 256

        layers: list[nn.Module] = []
        layers.append(nn.Linear(latent_dim + 1, hidden_dim))  # scalar control is the + 1
        layers.append(nn.ReLU())
        layers.append(nn.Linear(hidden_dim, hidden_dim))
        layers.append(nn.ReLU())
        layers.append(nn.Linear(hidden_dim, latent_dim))

        self.net = nn.Sequential(*layers)
```

Just a plain simple MLP where we take in the latent dimension and the control signal (concatenated together) and output the latent dimension after passing through two hidden layers. Just Machine Learning 101, nothing special.

So what is it actually doing? In short, we are training it to generate an additive residual output that gets us from one latent state to the next latent state, within the regions of latent space we trained on. It's as simple as this pseudocode:
```python
# Models
encoder = PretrainedSSLEncoder()  # 28x28 -> 64 (latent dim)
dynamics = DynamicsMLP()

# For example, control_signal might be +1 to count forward (4 -> 5)
# or -1 to count backward (5 -> 4)
control_signal = sample_control()

mnist_start = sample_from_dataset()
# transform_via_control selects the target based on the control signal
# e.g., control=+1 means next digit (4 -> 5), control=-1 means previous (5 -> 4)
mnist_end = transform_via_control(mnist_start, control_signal)

with torch.no_grad():
    z_start = encoder(mnist_start)
    z_target = encoder(mnist_end)

z_with_control = torch.cat([z_start, control_signal], dim=1)
z_delta = dynamics(z_with_control)
z_predicted = z_start + z_delta

# Loss
loss = MSE(z_target, z_predicted)
```

There ya go! We are training the dynamics model to _move_ the latent from a start position to an end position. What's super critical to point out is that the dynamics model is producing "velocity" — relative movement in latent space, conditioned on both the start location _and_ the control signal.

Notice we never told the model anything about digits, loops, or sequences — it only learned local transition rules.

Once you have this, you can train the network to become a function that can take a position in latent space and push it toward the control-conditioned target. This is analogous to learning local transition rules on a cortical manifold — know where you are, receive a control signal, and move.

It's like plugging in your GPS position, telling it what you'd like to do, and getting a direction to start moving. That's the function of the dynamics model.

## The Rotation Experiment: What Invariance Costs You (And What It Buys)

Before we get to the main event, I want to show you something I found that reframes what dynamics even means on an invariant manifold.

I trained the same dynamics model on two different manifolds. The first was a naive autoencoder trained on 55,000 MNIST samples — no self-supervised learning, just reconstruct the input. The second was our SSL encoder trained on just 1000 samples. Note that dataset size differs here — but the behavior I'm about to describe strongly suggests it is driven by the invariance objective, not the sample count.

The task was simple: learn to rotate a digit. Given a digit and a rotation angle as the control signal, produce the rotated version.

On the naive autoencoder's manifold, this works great. The dynamics model learns smooth, controlled rotation. Why? Because that manifold preserved pixel-level variation. Every little spatial detail is encoded, so there's structure in latent space that corresponds to orientation. The dynamics model just has to find it and push along it.

On the SSL manifold? Rotation behaves *weird*. The outputs are stable and they stay the correct digit class, but instead of smoothly rotating while preserving the exact instance of the digit, the model resists rotation — and then, when it *does* change, it often snaps to a different example of the same digit. The decoder reconstructs the nearest prototype within that class cluster, which is why the digit "snaps" to a different instance. It's like the system is saying: "Nope, I'm not rotating this 3… but here's another 3 that better matches whatever you're asking for."

This is not a failure. This is a reveal.

SSL learned invariance. Because rotation was one of the augmentations during training, the encoder was explicitly trained to treat rotated versions of a digit as the same latent. That means rotation information in the manifold is compressed and tangled — not cleanly navigable — so smooth rotation dynamics are hard to learn. To check that this was really the cause, I retrained the SSL **without** rotation augmentation, and the control signal could once again rotate the digit smoothly while preserving its identity. The behavior followed the invariance objective, not the architecture.

So what _can_ you move along on an invariant manifold?

Identity.

If the manifold is organized so that all versions of "3" cluster together and all versions of "7" cluster together, then the easiest dynamics to learn are transitions between identity clusters, not transformations within them. The geometry of the manifold is practically begging you to move from one identity to another. That's the structure that survived the invariance bottleneck. The ordering between identities isn't innate to the manifold though — it comes from the transition pairs we train on. The manifold provides the clusters; the data provides the graph.

Your own sensory cortex does something similar. Early visual areas still track orientation, but progressively more invariant representations appear along the visual hierarchy until identity is stable regardless of viewpoint. At that level, the dynamics that matter aren't rotations — they're transitions between recognized states.

If invariance compresses rotation but preserves identity structure, then the right dynamics to learn on an SSL manifold are flows between identities — and the simplest version of that is counting.

## The Latent Flow Experiment: Learning to Count

Now we get to the real experiment. If the SSL manifold organizes around identity, can we learn dynamics that flow between identities using a minimal control signal?

The task is counting. Given a starting digit, move forward or backward to an adjacent digit. The control signal is a single scalar u in [-1, 1]. Positive means count forward (4→5), negative means count backward (5→4). The magnitude represents how far along the transition you are — u=0.5 means you're halfway from one digit to the next in latent space.

Here's how the training data works. We select a starting digit from the dataset, randomly sample a control signal u, and determine the end digit based on the sign of u. Then we interpolate between start and end **in latent space**, not pixel space, based on the magnitude of u. Because the SSL manifold is locally smooth around identity clusters, interpolation between two encoded digits often produces plausible intermediate states that decode to recognizable digits. From just 1,000 real MNIST samples, we generate over 100,000 grounded transition pairs by exploiting the manifold's geometry.

That's a big deal. The manifold acts as a data multiplier. Sparse experience in, dense training signal out. The structure learned during grounding is doing real work here — without a well-formed manifold, interpolation would produce nonsense or jump between identities.

The dynamics model itself is the same simple MLP from before. It takes a latent state concatenated with the scalar control signal, produces a residual velocity, and we add that to the current state to get the next state. Same architecture, same training procedure — just different data.

But the real test isn't whether the model can produce a single transition. It's whether it can sustain a trajectory on its own. That's where grounded rollout comes in.

## Results: Grounded Rollout

The dynamics model trains fast — but the real question is whether it can sustain its own trajectory. Grounded rollout means we take the model's predicted latent state, decode it back to an image, re-encode that image, and feed it back in as the next starting point. In pseudocode:

```python
z = encoder(start_image)
for step in range(num_steps):
    z_delta = dynamics(torch.cat([z, control_signal], dim=1))
    z = z + z_delta
    image = decoder(z)        # decode to pixel space
    z = encoder(image)        # re-ground on the manifold
```

That re-grounding step is critical. Without it, small errors accumulate and the trajectory drifts off the manifold into regions the decoder was never trained to interpret. By decoding and re-encoding at every step — E(D(z + z_delta)) — we project the state back onto the learned manifold. The encoder acts like an error-correction mechanism, keeping the dynamics honest.

With u near +1, the system counts forward. 1→2→3→4→5→6→7→8→9→0→1… Each output feeds back as the next input and the trajectory becomes self-sustaining. Set u near −1 and it counts backward. Same manifold, same model, direction flipped.

With u near 0, something different happens. The system drifts toward the deepest basins on the manifold — usually 8s and 2s — and just orbits there. Without a drive signal, the rollout exposes the manifold’s natural attractors. Some regions are deeper, more stable, more attractive than others.

Between those extremes, there’s a threshold. Between roughly u = −0.95 and 0.95, transitions get noisy — digits blur, the count stutters, the trajectory loses coherence. Above that threshold, transitions snap clean. It’s not a smooth gradient from bad to good. It looks more like a phase change: below threshold the manifold’s attractors dominate, above threshold the control signal steers the dynamics.

I’ll leave interpretation of the threshold and the drift behavior for the conclusion. For now, just look at the figures. The system counts — forward and backward — from a single scalar control signal on a manifold learned from about 1,000 samples.

## What This Means

**The manifold is a data multiplier.** 1,000 samples became 100,000+ valid transition pairs through interpolation. The grounding did the heavy lifting — once the manifold is locally smooth, experience is cheap to synthesize. You don't need to encounter every transition. You need a good map.

**The control signal is absurdly minimal.** A single scalar. That's it. All the richness lives in the manifold geometry, not the control. Remember the NYC analogy — you just need your position and a direction. The compass is simple. The city is complex.

**Grounding keeps the dynamics honest.** Without the re-encode step — snapping the predicted state back onto the manifold every iteration — the trajectory drifts into nonsense. Small errors compound and the system hallucinates states that don't correspond to anything real. My guess is that this is something the brain _must_ do — I just don't know what the mechanism is. But it becomes pretty apparent that when the brain fails in certain ways — schizophrenia, psychoactive drugs — something like this grounding mechanism is probably breaking down.

**The threshold is sharp.** At u≈0, the system drifts to local basins and orbits. Below about ±0.95, the manifold's attractors dominate. Above that, transitions snap clean. There's a regime change between the manifold's intrinsic dynamics and the driven dynamics. I'm not going to over-interpret this yet — but a system with distinct resting and driven modes feels worth sitting with.

## A Note on Scale

The grounding post used 100 samples. For dynamics, I needed about 1,000. The simple models just needed more coverage to support smooth interpolation between identities, not just invariance. It's possible the brain solves this through smaller receptive fields, compositional features, or hierarchical manifolds. I'm not sure yet. But 1,000 samples is still remarkably small, and I believe the principle still holds.

I also bumped the latent dimension from 32 to 64 and beefed up the encoder-decoder — purely for visualization. A smaller architecture produces the same behavior, just blurrier.

## What's Next

We've shown that a simple dynamics model can traverse an invariant manifold with a minimal control signal. The manifold provides the structure. The dynamics exploit it. The control signal gates it.

But counting is just one pattern. If the manifold really encodes identity loops, a tiny control signal should be enough to enter, hold, and compose those loops on demand.

That’s worth testing.