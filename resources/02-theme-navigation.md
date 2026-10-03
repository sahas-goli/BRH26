# Theme: NAVIGATION

Sources: Theme doc (https://docs.google.com/document/d/1NHrE-zrTy1DDI-0d1FkQAStY7yizpfoao3BqESUHHM0/edit, verbatim below) + Opening Ceremony slides (extras at bottom). Captured 2026-10-02.

---

Welcome to a world where every path tells a story, every journey sparks discovery, and every destination is just the beginning.

This year's theme is **NAVIGATION**.

Before Google Maps, we had people navigating through understanding the stars. Now, we're still constantly finding our way through the world, the digital world, and everything in between. From the maps that guide our adventures and the interfaces that shape our digital experiences, to the systems that connect communities, **navigation** defines how we move, explore, and orient ourselves in an ever-changing world.

This weekend is your chance to reimagine how we navigate the physical or digital world. Think Wayfinding, Exploration and Discovery, or Accessibility! (These tracks are meant for you to ideate on. You will be judged on how well your project relates to the theme Navigation.)

**Wayfinding**: Projects that help people navigate physical or digital spaces with clarity, confidence, and creativity, from smarter maps to intuitive UI flows.

**Exploration and Discovery**: Projects that push the boundaries of how we discover new places, ideas, or experiences, turning the unknown into an adventure. Reimagine how we search, surface, and stumble upon information, communities, or opportunities in a noisy world.

**Accessibility**: Projects that break down barriers in navigating towards a target, regardless of ability, language, or background can find their way forward.

Some project ideas:
- Reimagine what the next era of self-driving car/bike/plane or other transportation interfaces might look like
- What types of audio or haptic navigation would blind or low-vision users benefit from?
- How can navigation technology foster connection between people and the communities around them?

Tips for brainstorming:
- Think about a specific problem you're trying to solve
- Think about a specific target audience or person who will benefit from using your solution

If you want any feedback on your idea before you start to build, feel free to come up to one of the organizers :)

---

## Extras from the opening ceremony slides
Wayfinding / Exploration / Accessibility are ideation prompts, NOT prize tracks.

Speaker: Jon Kleinberg. Framing question: "What do we build next to change how we navigate in the next 100 years?"

Additional idea prompts on the slides:
- What if you can drive a car with your phone?
- How do you train AI to better navigate the world?
- What new sensors, interfaces, and technology do we need to create first for better navigation?

## Spoken at opening ceremony (Otter transcript: Jon Kleinberg + organizers)
- Theme is Navigation "not just literal like maps but also metaphorical, like internet search".
- **Kleinberg's argument:** AI is like a super-intelligent alien looking down at Earth through data, never having lived here. Does it understand what it says, where did it learn it, can we trust it? Framed by Carl Sagan's "Is There Life on Earth?" Galileo thought experiment (O2 and methane coexisting = evidence of life). His own Flickr work: plot the lat/long of every photo, then label dense circles with their most distinguishing tag word, giving an instant "mini travel guide" with almost no ML. Watch for data artifacts (the bright 0,0 dot).
- **Live demo of the open problem:** asked a language model (Sonnet 5.5) for the walk from Collegetown Bagels to Gates Hall. It named places that no longer exist (e.g. The 9, closed in 2018, from stale web pages): walking is temporal as well as spatial. A Gemini + Google Maps mashup fixed that but still made token-level errors (said a building was on your right when it is on the left): the model gives under 100% probability to the right word each token.
- **What he wants hackers to chase:** two intelligences do not line up yet. Map/database tools are precise but cannot converse ("what's the scenic way?"); LLMs converse but make small grounding errors. New ideas needed to combine them for maps, navigation and world knowledge, including freshness (time) and correctness.
- Organizers also spoke the slide prompts above, adding "audio-adaptive navigation for accessibility" and "next era of self-driving transportation".
