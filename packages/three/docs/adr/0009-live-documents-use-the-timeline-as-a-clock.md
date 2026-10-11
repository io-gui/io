---
status: accepted
---

# Live documents use the timeline as a clock, not as a sequence

A document's timeline serves two kinds of content. Sequence content derives its state from `time`, so scrubbing, looping and stepping back are exact; most examples work this way. Live content builds up state from what happens while it plays, like a game: the skinning blending demos crossfade between actions when buttons are pressed. Its state is not a function of `time`, so it treats the timeline as a clock. Positive `delta` (playback, a frame step forward, scrubbing forward) advances it. Zero or negative `delta` (a loop wrap, scrubbing or stepping back) is ignored, so its state never rewinds or resets. Pausing and stepping go through the editor's transport, not through per-document pause or step properties.

This is how game engines and DCC tools split the two. Unity's Animator and Unreal's Animation Blueprints run on the game clock, can be paused, slowed and stepped forward one frame in the editor, and never rewind. Unity Timeline, Unreal Sequencer and DCC timelines are sequences evaluated at a time. The pattern used here is Niagara's "Tick Delta Time" mode: content on the engine clock inside a sequencer that ignores the playhead's position.

## Considered Options

- **Record button presses as timeline data** and replay the pose from the start when time goes back (Unity's Control Track re-simulates particles from the start on a backward jump; Niagara's Desired Age mode resets and re-simulates). This makes scrubbing exact but turns an interactive demo into authored content. Rejected for game-like demos; it fits documents whose interactions are content.
- **Reset to the initial state when time goes back**, as DCC simulations reset at their start frame. Rejected: every loop wrap would reset the demo.
- **Integrate negative `delta`** (the previous behaviour). Each wrap jumped the mixer back a whole duration, the pose popped, and fades that spanned the wrap replayed.

## Consequences

- Scrubbing forward fast-forwards live content by the scrubbed distance. Nothing clamps it.
- A loop wrap drops one frame of live time, because the wrap's `delta` is negative although playback advanced by one frame.
- Live content infers what happened from the sign of `delta`. Unity (`FrameData.seekOccurred`, `timeLooped`) and Unreal (Playing, Scrubbing, Jumping, Stepping) pass the cause of each time change. Passing the playback delta and a seek flag to `onAnimate` would let live content keep the wrap frame and ignore forward seeks. This follow-up is `timeline-negative-delta` in `.cursor/plans/three_future_work.plan.md`.
- Whether a document is live shows only in its `onAnimate`. The timeline UI still shows a playhead and duration for it.
