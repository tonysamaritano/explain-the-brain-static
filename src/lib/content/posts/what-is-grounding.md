---
title: What is Grounding?
date: 2026-02-10
description: Grounding is how the brain builds a stable model of reality from sensory experience. Let's build one.
slug: what-is-grounding
image: /grounding_0.webp
color: #00A9FF
---

Let's ground ourselves for a moment.

Evolution appears to have uncovered at least four principles that make biological intelligence possible: reflexes → grounding → dynamics → planning.

In this experiment, we're going to focus on **grounding**. Here's the intuition.

Close your eyes and imagine a cup. _Really_ imagine it. What does it look like? What does it feel like? For me, it's a glass cup about six inches tall, covered in condensation because it's holding cold, delicious bubbly water.

Now imagine a sofa. Really imagine it. For me, it's big, oversized, and covered in soft tan fabric — the kind you could sink into and take a wonderful nap.

Now two questions:

- Would you group a plate with the cup or the sofa?
- Would you group a throw pillow with the cup or the sofa?

The answers _feel_ obvious:

- Plates and cups both live in the kitchen — they're tools for food and drink.
- Throw pillows and sofas both live in the living room — they're soft, comfortable and belong on furniture.

But here's a deeper question: where would you group a kitchen table?

It's furniture, like the sofa. But it lives in the kitchen, surrounded by cups and plates. In your mind, it sits _between_ the two clusters — and you know that instantly, without effort.

What you just did — in milliseconds — was navigate a **manifold**: a structured, low-dimensional space where similar things live near each other, embedded inside a much higher-dimensional sensory world. You built that manifold entirely from experience. Grounding is how the brain builds it.

## How Grounding Works

Grounding is almost certainly accomplished by the cortex. So what is the cortex actually doing? At its core: predicting its own inputs.

Think about it. All the brain has is a constant stream of sensory data hitting it. That's it. Nothing else to work with. So the cortex learns to predict what it's going to sense next — and in doing so, it builds an internal model of reality. Sensory streams are evidence of how the world actually is. The model your brain builds is its belief of how the world is. When those two things align, you have a manifold grounded in reality.

That might sound abstract, so here's what it feels like in practice. You'd find it pretty weird if you went to a friend's house and they had throw pillows stacked all over their kitchen countertop — because that violates your model. Your brain predicted "kitchen stuff" and got "living room stuff." That's a prediction error.

Or imagine opening your bathroom door and there's a gorilla sitting on your toilet. First of all, RUN. Second — that makes no sense. Your brain had an extremely confident prediction about what was behind that door, and a gorilla wasn't in the space of possibilities. Your model of reality just shattered. That visceral shock? That's what a massive prediction error feels like.

Prediction error is the name of the game for the cortex, and grounding a world model is one of the ways it uses prediction error.

## Can We Build a Manifold

Absolutely. In machine learning, the space that a manifold lives in is called **latent space**. I'm not going to waste time cataloging every model that can learn a latent representation — the one we're going to use for this set of experiments is an **autoencoder**.

This beautifully simple network is what's called an **unsupervised** model. In a nutshell, that just means the training data don't require labels — just like the brain. It's made up of three parts: an encoder, a bottleneck, and a decoder. The objective is to reconstruct its own inputs. But the magic isn't the reconstruction — it's the **compression**. The autoencoder is forced to squeeze high-dimensional data (like an image) into a much lower-dimensional **latent representation**. That compression is what builds the manifold.

First, we're going to build one and train it on the classic MNIST handwritten digits dataset — it conveniently produces a very clean manifold in latent space when trained correctly. After that, we're going to watch it fail miserably when we give it almost no data. Then we're going to experiment with how the brain _probably_ overcomes this data limitation. We'll show where the gains actually come from and tie it all back to how evolution gave the brain the ability to build rich models of the world.

## Step 1 - Naive, Fully Connected Autoencoder

```python
# 1) Architecture (the core idea)
class NaiveAutoencoder(nn.Module):
    def __init__(self):
        self.encoder = nn.Sequential(
            nn.Flatten(),              # 28x28 -> 784
            nn.Linear(784, 256),
            nn.ReLU(),
			nn.Linear(256, 128),
            nn.ReLU(),
            nn.Linear(128, 32),        # bottleneck = latent space
        )

        self.decoder = nn.Sequential(
            nn.Linear(32, 128),
            nn.ReLU(),
            nn.Linear(128, 256),
            nn.ReLU(),
            nn.Linear(256, 784),
            nn.Sigmoid(),              # [0,1] pixels
            nn.Unflatten(1, (1,28,28))
        )

    def forward(self, x):
        z = self.encoder(x)           # <-- the manifold lives here
        x_hat = self.decoder(z)
        return x_hat, z
        
...

loss = MSE(x_hat, x)
```

Even this naive, fully connected autoencoder (476k parameters) — trained with nothing but a reconstruction objective — learns a latent manifold where simple nearest-neighbor search recovers digit identity with ~97% accuracy.

The important thing about this training run is that I used 55,000 MNIST images for training. Just to put that into prospective, if you had 55,000 flash cards, assuming you need to look at each for just 2 seconds, it would take you ~30 hours to flip through every example. That's what I had to do to get the autoencoder to build a latent representation of MNIST.

Next, we're going to be way more parameter efficient using an amazing technique called convolution.

## Step 2 - Naive, Covnet Autoencoder

I'm not going to explain what a convolutional neural network (CNN) is for your or how it works. There's 1000 great explainers for the CNN out there, just Google it. All you need to know is that when you have spatially structured data (like an image), CNN is your go-to.

Here's the model:

```python
# Encoder: 1 → 8 → 16 channels, then a 32-dim bottleneck
class NaiveConvAutoencoder(nn.Module):
    def __init__(self):
        self.encoder = nn.Sequential(
            nn.Conv2d(1, 8, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.Conv2d(8, 16, kernel_size=3, stride=2, padding=1),
            nn.ReLU(),
            nn.Flatten(),
            nn.Linear(16 * 7 * 7, 32)   # bottleneck = latent space
        )

        # Decoder mirrors the encoder (16 → 8 → 1)
        self.decoder = nn.Sequential(
            nn.Linear(32, 16 * 7 * 7),
            nn.Unflatten(1, (16, 7, 7)),
            nn.ConvTranspose2d(16, 8, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.ReLU(),
            nn.ConvTranspose2d(8, 1, kernel_size=3, stride=2, padding=1, output_padding=1),
            nn.Sigmoid()
        )

    def forward(self, x):
        z = self.encoder(x)
        x_hat = self.decoder(z)
        return x_hat, z
```

This model uses ~8× fewer parameters than the fully connected version, yet achieves almost identical performance on reconstruction and latent-space structure.

Why? Because convolutions bake in the right inductive bias for images: locality and translation invariance. Instead of treating every pixel as independent, the model assumes that nearby pixels are related — the same assumption your visual cortex makes.

Two things to notice:

1. Better efficiency, same objective.

We didn’t change the learning signal at all — it’s still just MSE(x_hat, x). The gains come purely from a smarter architecture.

2. A cleaner manifold for free.

With far fewer parameters, the latent space remains well-organized: digits cluster cleanly, and kNN in latent space still recovers labels at very high accuracy.

This tells us something important about grounding:

You don’t need brute-force capacity — you need the right structure.

However, there’s a catch. It **needs** data.

### Step 3 - Naive, Covnet Autoencoder with 100 Samples

All I'm going to do is reduce the number of training examples from 55,000 to 100. I feel like 100 samples is pretty manageable for a human - that would take just over 3 minutes to read 100 flashcards with the MNIST data at our 2 second per flashcard. So, what are the results? Absolute garbage.

| Setting                       | Train samples | Parameters | kNN latent accuracy | What happened                                                       |
| ----------------------------- | ------------: | ---------: | ------------------: | ------------------------------------------------------------------- |
| **Naive Conv AE (full data)** |        55,000 |     53,473 |           **97.3%** | Clean digit manifold; classes well separated in latent space.       |
| **Naive Conv AE (low data)**  |       **100** |     53,473 |           **28.5%** | Manifold collapses; heavy class overlap, especially for 3, 4, 5, 9. |

Same architecture, same objective, same latent dimension — radically different manifolds. The only thing that changed was **data.**
### Classic overfitting (why this happens)

53k parameters are plenty to memorize 100 images — but memorization isn't grounding. The encoder latches onto incidental pixel patterns instead of digit identity, and the manifold collapses.

If architecture alone were enough, this would have worked. It didn't. The brain must use something beyond data quantity — which motivates the next experiments.
## Step 4 — Self-Supervised Autoencoder

This step changes only **one thing: the data.** We keep the **same 100 training samples from Step 3**, but we use a brain-like trick called **self-supervision**.

In its simplest form, self-supervision is just **data augmentation**. For each of the 100 images, we generate 100 different distorted views using random translation, rotation, noise, pixel-intensity changes, and masking (dropping pixels). Instead of 100 raw samples, the model now sees **10,000 distinct views of the same 100 digits**. The task remains the same: reconstruct the original image from each augmented version.

Intuitively, this is like not just glancing at a single MNIST “flashcard,” but picking it up, rotating it, moving it closer and farther away, partially covering it, bending it, and viewing it under different lighting conditions. You learn far more about the _same object_ by seeing it in many contexts — and, critically, this lets you build a stable manifold **without representational collapse.**

The result is dramatic: latent kNN accuracy jumps from **28.5% to 75.1%**. Nothing changed about the model — only how we presented the data. This mirrors how the brain uses time and multiple sensory views to build a stable, grounded representation from very few examples.

## Step 5 - More Capacity

Now we're going to modify one part of the model and one part only: the encoder. Same 32 dimensional bottleneck and same decoder. We're going to replace the CNN encoder with what is called a Residual Network or ResNet, specifically ResNet-8.

The ResNet is a staple in deep learning and was a simple and straightforward swap to add more capacity to the model. I'm not going to explain what a ResNet is (Google it) or write the code down here (look at the repository). All you need to know is that I swapped out simple CNN encoder with a ResNet-8 increasing our model capacity from ~53k parameters to ~130k parameters - more than double the capacity.

The result is clear: **more encoder capacity improves the manifold.**

With the **same 100 samples, same SSL, same 32-dimensional bottleneck, and same decoder**, latent kNN accuracy rises to **78.1%**. The manifold is cleaner and more structured, not just more accurate.


## What Did We Learn?

| Step                     | Change                   | kNN Accuracy | Manifold Score | Lesson                                                 |
| ------------------------ | ------------------------ | ------------ | -------------- | ------------------------------------------------------ |
| 1. Naive FC AE           | Baseline (55k samples)   | **97.29%**   | 67.24          | Brute force works if you have enough data              |
| 2. Conv AE               | Better architecture      | 97.21%       | 67.80          | Right structure = same result with 8× fewer parameters |
| 3. Conv AE (100 samples) | Starve it of data        | 28.5%        | 46.40          | Architecture alone isn't enough                        |
| 4. SSL Conv AE           | Augmentation + denoising | 75.1%        | 66.67          | Invariance rescues the manifold                        |
| 5. ResNet encoder        | More encoder capacity    | 78.1%        | **69.11**      | Encoding is the bottleneck, not decoding               |

The progression matters more than any single number. Each step isolated exactly one variable and asked: does this help build a grounded manifold? Here are the three takeaways.

### 1. Reconstruction ≈ Sensory Prediction

The brain doesn't do autoencoding. There's no decoder sitting in your cortex reconstructing pixels. But the brain _does_ predict its own sensory inputs — constantly, relentlessly, at every level of the cortical hierarchy. That's what predictive coding is.

A denoising autoencoder is a reasonable computational proxy for this process. It forces the network to build a stable internal representation that can explain what it senses _despite_ noise and variation. It can't memorize — it has to understand. That's the same pressure the brain is under every waking second.

Is this exactly how grounding works biologically? No. Is it close enough to produce the right computational behavior? The results say yes.

### 2. Augmentation ≈ Time

This one is genuinely important. Instead of needing 55,000 distinct digit images, we gave the model 100 digits and let it see each one 100 different ways — rotated, shifted, noisy, masked, stretched. And the manifold came back to life.

Think about what your brain does. You don't see a cup once and know what cups are. You see _your_ cup hundreds of times — in morning light, in dim evening light, from above when you're reaching for it, from the side when it's sitting on your desk, partially occluded by your hand when you're holding it. Every saccade, every head movement, every lighting change gives you a slightly different view of the same object.

Augmentation is a computational stand-in for temporal experience. The brain doesn't need millions of unique objects. It needs time with the objects it has.

### 3. Asymmetry Matters

When we swapped the simple CNN encoder for a ResNet — leaving the decoder, bottleneck, and training procedure completely unchanged — the manifold got better. Not because reconstruction improved. Because _encoding_ improved.

This tells us something that I think is under appreciated: the manifold lives in the encoder, not reconstruction capacity. The decoder is just a training signal.

This is at least consistent with what we see in biology. Early sensory cortex is _massive_ — the visual cortex alone takes up a huge chunk of the brain's real estate. Evolution invested heavily in the front end of the processing pipeline. It contains powerful encoders building rich representations, and everything downstream works in that representation space.

I'm not claiming this proves the brain uses asymmetric encoding for exactly this reason. I'm saying the computational evidence is consistent with it — and that's enough to keep building on.

## What This Doesn't Do

I want to be honest about the boundaries of this experiment.

This only addresses grounding of **static perception**. We took images, compressed them, and showed that a stable manifold can emerge from very few samples with the right inductive biases. That's a real, informative result.

But it says nothing — _nothing_ — about how that manifold gets used. It doesn't address action. It doesn't address prediction over time. It doesn't address planning. Those are layers 3 and 4 of the stack, and they're where the real magic of intelligence lives.

The manifold is the foundation. Without it, dynamics and planning have nowhere to operate. But a foundation isn't a house. Moreover, the brain is more like a **city than a single house** — many specialized districts (sensory, motor, memory, planning) all interacting in real time.

That's the next experiment: **action-conditioned dynamics** — can we learn a world model that predicts how to **move** on the manifold conditioned on action? Stay tuned.

## The Thesis

_With very few samples, a brain-like grounding manifold emerges not from more data, but from invariance, prediction, and sufficient encoder capacity._

If that claim is wrong, the experiments in this post should have failed. They didn't. So we keep building.