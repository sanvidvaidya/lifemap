LIFEMAP — MASTER BUILD SPECIFICATION
====================================

You are the lead product engineer, software architect, frontend engineer,
data visualization engineer, UX/UI designer, interaction designer,
accessibility engineer, QA engineer, security reviewer, performance
engineer, technical writer, and release engineer for this project.

Your job is to take the LifeMap concept below from zero to a complete,
polished, functioning, tested, documented, GitHub-ready, publicly
deployable web application.

This is NOT a toy coding exercise.

This is NOT merely a landing page.

This is NOT a dashboard mockup.

This is NOT a prototype that stops after the first screen.

You must build the actual application, test it, debug it, polish it,
document it, prepare it for GitHub Pages, and leave the repository in a
state where the owner can push it to GitHub and deploy it.

You are authorized to make reasonable implementation decisions where
this specification does not prescribe an exact technical solution.

When there are multiple reasonable options, prefer:

1. correctness
2. privacy
3. reliability
4. simplicity
5. performance
6. accessibility
7. visual quality
8. maintainability

Do not introduce unnecessary complexity.

Do not ask the owner to manually perform ordinary coding tasks that you
can perform yourself.

Do not stop merely because the application compiles.

Do not claim a feature exists unless it actually works.

Do not leave fake buttons, fake navigation, placeholder functionality,
dead links, TODOs, or knowingly broken features in the final release.

============================================================
0. PRODUCT IDENTITY
============================================================

PRODUCT NAME:

LifeMap

WORKING TAGLINE:

See the shape of your life.

ALTERNATIVE TAGLINE:

Turn your data into a world.

CORE PRODUCT IDEA:

LifeMap is a privacy-first personal analytics application that allows a
person to provide their own personal activity data and transform it into
an interactive, visual, longitudinal representation of how they spend
their time and how their behavior changes over time.

The fundamental product question is:

"Where is my time actually going, when do I tend to spend it, how
consistent am I, what has changed, and what observable patterns exist
within the data I have chosen to provide?"

LifeMap should allow users to understand their own behavior without
requiring them to surrender their personal data to a remote service.

The application should combine:

PERSONAL DATA
+
ANALYTICS
+
VISUALIZATION
+
EXPLORATION
+
PROGRESSION
+
PRIVACY

The result should feel like a personal world generated from the user's
own data.

============================================================
1. PRODUCT PHILOSOPHY
============================================================

The application must embody these principles:

PRIVACY

The user's data belongs to the user.

Process personal data locally in the browser.

Do not upload it.

TRANSPARENCY

Every important metric must be explainable.

HONESTY

Never fabricate insights.

Never imply causation when only correlation/association exists.

USER OWNERSHIP

Users bring their own data.

LifeMap does not secretly collect personal information.

BEAUTY

The visual world is a primary product feature.

USEFULNESS

The product should help the user discover something meaningful.

ORIGINALITY

Do not copy existing games, applications, brands, or copyrighted
interfaces.

SIMPLICITY

The application should remain understandable to a normal user.

============================================================
2. WHAT LIFEMAP IS NOT
============================================================

Do NOT build:

- a generic analytics dashboard
- a generic CSV viewer
- a generic AI chatbot
- an AI life coach
- a personality detector
- a psychological diagnosis tool
- a fake productivity score
- a generic SaaS admin interface
- a Pokémon clone
- a GTA clone
- a Zelda clone
- a Nintendo clone
- a Disney clone
- a game using ripped assets
- an application requiring a backend
- an application requiring API keys

The game-inspired aesthetic is a visual language, not an attempt to
reproduce another company's intellectual property.

============================================================
3. CORE USER QUESTIONS
============================================================

LifeMap should answer five fundamental questions.

WHERE?

Where does my tracked time go?

WHEN?

When do I tend to perform different activities?

HOW?

How consistent are my activities?

WHAT CHANGED?

How has my behavior changed over time?

WHAT'S ASSOCIATED?

When sufficient optional data exists, what observable relationships
appear within the data?

The final question must always be framed as association/correlation,
never causation.

Example:

GOOD:

"Recorded energy was higher on days containing Fitness activities."

BAD:

"Fitness caused your energy to increase."

============================================================
4. PRIVACY ARCHITECTURE — NON-NEGOTIABLE
============================================================

LifeMap must be local-first.

There must be NO backend.

There must be NO database server.

There must be NO user account system.

There must be NO authentication system.

There must be NO cloud storage.

There must be NO OpenAI API.

There must be NO Gemini API.

There must be NO Anthropic API.

There must be NO external AI API.

There must be NO telemetry.

There must be NO advertising tracker.

There must be NO analytics tracker.

There must be NO requirement for user data to leave the browser.

Do not send uploaded files to any server.

Do not transmit personal activity records.

Do not require external APIs for core functionality.

The application should remain functional after initial application loading
without requiring continued network communication wherever technically
practical.

The privacy claim must be true at the implementation level.

The README must document the architecture.

The UI must visibly communicate:

"Your data stays on this device."

Also explain what this means technically.

============================================================
5. DATA OWNERSHIP
============================================================

Imported personal data must remain in browser memory wherever practical.

Do not persist personal data automatically.

Do not silently write personal information to browser storage.

If local persistence is ever required, it must be explicit, documented,
and user-controlled.

Provide:

IMPORT

ANALYZE

EXPORT

RESET

The user must always be able to remove the current dataset.

============================================================
6. DEPLOYMENT
============================================================

The final application must be deployable as a static website.

PRIMARY DEPLOYMENT TARGET:

GitHub Pages.

Preferred architecture:

TypeScript
React
Vite

Use lightweight CSS/styling.

Use SVG/canvas where appropriate.

Use visualization libraries only when justified.

Do not introduce unnecessary frameworks.

The application must build into static assets.

Create a GitHub Pages-compatible deployment workflow if appropriate.

Make sure project-relative paths work correctly when deployed under a
GitHub Pages project URL.

Do not require a Node server at runtime.

Do not require Python at runtime.

Do not require Docker.

============================================================
7. STORAGE / MACHINE CONSTRAINT
============================================================

The development machine has approximately 256 GB of storage.

Keep the project lightweight.

Do not download:

- large language models
- machine learning models
- GPU packages
- massive datasets
- Docker images
- unnecessary browser binaries
- unnecessary SDKs
- large media libraries

Do not create unnecessarily large generated assets.

Keep the repository reasonably small.

Do not commit:

node_modules
build caches
temporary files
OS files
logs
large binaries
personal datasets
API keys
secrets

Create an appropriate .gitignore.

============================================================
8. CORE USER FLOW
============================================================

The primary flow should be:

LANDING PAGE

↓

CREATE MY LIFEMAP

↓

CHOOSE:

IMPORT DATA
ENTER DATA
EXPLORE DEMO

↓

DATA VALIDATION

↓

FIELD MAPPING

↓

DATA NORMALIZATION

↓

ANALYSIS

↓

WORLD GENERATION

↓

EXPLORE WORLD

↓

VIEW CHARACTER

↓

VIEW TIMELINE

↓

VIEW INSIGHTS

↓

COMPARE PERIODS

↓

EXPORT

The user should always understand where they are.

============================================================
9. INPUT METHODS
============================================================

MVP must support:

1. CSV upload
2. JSON upload
3. manual activity entry
4. synthetic demo data

Support drag-and-drop.

Support normal file selection.

Do not require technical knowledge.

============================================================
10. CANONICAL DATA MODEL
============================================================

The internal activity model should support:

id
date
startTime
endTime
activity
category
subcategory
duration
energy
mood
planned
completed
location
notes

Mandatory:

date
activity
category

Duration may be derived from start/end.

If a direct duration field exists, support it.

Optional fields must never prevent analysis.

============================================================
11. IMPORT FLEXIBILITY
============================================================

The normalization system should recognize common aliases.

Examples:

DATE:

Date
date
day
timestamp

ACTIVITY:

Activity
activity
task
event
description

CATEGORY:

Category
category
type
group

DURATION:

Duration
duration
minutes
duration_minutes

START:

Start
start
start_time
startTime

END:

End
end
end_time
endTime

Do not silently make dangerous assumptions.

Show detected mappings.

Allow the user to correct mappings.

============================================================
12. DATA VALIDATION
============================================================

Handle:

- missing columns
- invalid dates
- malformed CSV
- malformed JSON
- duplicate rows
- empty rows
- invalid times
- negative duration
- impossible duration
- invalid numeric values
- unexpected data types

Never crash.

Give useful human-readable messages.

============================================================
13. DEMO DATA
============================================================

Create a deterministic fictional dataset.

It must contain:

multiple categories
multiple weeks
multiple months
different activity durations
recurring activities
gaps
planned activities
completed activities
incomplete activities
energy
mood
interesting trends

Clearly label it:

DEMO DATA

Never imply it belongs to a real person.

Use seeded/deterministic generation if randomness is used.

============================================================
14. ANALYTICS ENGINE
============================================================

Implement a deterministic analytics engine.

Calculate:

TOTAL TRACKED TIME

TIME BY CATEGORY

TIME BY SUBCATEGORY

ACTIVITY FREQUENCY

AVERAGE ACTIVITY DURATION

DAILY TIME

WEEKLY TIME

MONTHLY TIME

CATEGORY TRENDS

ACTIVITY TRENDS

CONSISTENCY

STREAKS

GAPS

PLANNED VS COMPLETED

TIME FRAGMENTATION

TIME-OF-DAY DISTRIBUTION

DAY-OF-WEEK DISTRIBUTION

ENERGY PATTERNS

MOOD PATTERNS

ASSOCIATIONS

PERIOD-OVER-PERIOD CHANGE

PERSONAL RECORDS

============================================================
15. TIME ALLOCATION
============================================================

Calculate how tracked time is distributed.

Example:

Career 31%
Learning 24%
Fitness 12%
Recreation 18%

Allow arbitrary user categories.

Do not hard-code categories.

============================================================
16. TIME FRAGMENTATION
============================================================

If start/end data exists, calculate:

number of sessions
average session length
longest session
short sessions
session distribution
context switching
fragmentation indicators

Do not call this "productivity" unless the user explicitly provides a
productivity measure.

Use neutral language.

============================================================
17. CONSISTENCY
============================================================

Create a transparent consistency metric.

Possible components:

frequency
regularity
streaks
gaps

Document the exact formula.

The user must be able to see:

"How is this calculated?"

Do not create arbitrary scores merely because they look good.

============================================================
18. XP SYSTEM
============================================================

Create a progression system.

XP must be derived from actual data.

Example:

Learning XP can incorporate:

tracked hours
consistency
completed planned sessions
longitudinal improvement

Fitness XP can incorporate:

sessions
duration
consistency

Career XP can incorporate:

tracked activity
consistency
completed planned activity

Do not imply that one category is morally superior to another.

XP is a visualization of recorded engagement.

============================================================
19. LEVEL SYSTEM
============================================================

Implement:

CURRENT LEVEL
CURRENT XP
XP TO NEXT LEVEL
CATEGORY LEVELS
PROGRESSION
RECENT CHANGE

Make formulas transparent.

Do not make progression impossible for small datasets.

============================================================
20. ASSOCIATION ENGINE
============================================================

When optional data exists, calculate simple associations.

Examples:

category vs energy
category vs mood
time-of-day vs energy
day-of-week vs energy
exercise vs energy
activity vs mood

Use appropriate minimum sample thresholds.

If there is insufficient data:

"Not enough data."

Do not manufacture conclusions.

============================================================
21. STATISTICAL HONESTY
============================================================

Every analytical claim must be traceable to a calculation.

Show sample size where useful.

Do not present tiny datasets as statistically authoritative.

Do not make psychological claims.

Do not make medical claims.

Do not make financial advice claims.

Do not make causal claims without appropriate evidence.

============================================================
22. CORE VISUAL CONCEPT
============================================================

THIS IS A PRIMARY REQUIREMENT.

LifeMap must not look like a normal analytics dashboard.

The main experience should feel like entering an original,
premium, game-inspired world representing the user's life.

The desired emotional reaction is:

"I am looking at a playable visualization of my own life."

NOT:

"I am looking at charts with game colors."

The visual hierarchy must be:

1. CHARACTER
2. WORLD
3. EXPLORATION
4. PROGRESSION
5. DATA
6. CONVENTIONAL UI

The world is the primary interface.

============================================================
23. VISUAL QUALITY BAR
============================================================

Aim for the visual sophistication and emotional impact of a modern
commercial video game interface.

Do not literally reproduce any existing game.

The design should feel:

premium
immersive
original
cinematic
playful
intelligent
data-driven
coherent

The user should feel that the world belongs to them.

============================================================
24. VISUAL REFERENCE LANGUAGE
============================================================

Use the following conceptual influences:

modern RPG character progression

open-world exploration

isometric/pseudo-isometric game worlds

personal avatars

world maps

environmental storytelling

character progression screens

achievement systems

modern data visualization

premium editorial web design

Do NOT copy:

GTA
Pokémon
Nintendo
Disney
Zelda
Animal Crossing
Minecraft
or other proprietary visual identities.

Do not use copyrighted characters.

Do not use copyrighted sprites.

Do not use ripped assets.

Do not imitate logos.

Create an original visual language.

============================================================
25. CHARACTER — PRIMARY VISUAL ELEMENT
============================================================

Create an original user avatar.

The avatar must feel like a protagonist.

It must NOT be:

- an emoji
- a generic circle
- a profile icon
- a static generic SVG person
- a stock illustration

The avatar should have:

head
body
clothing
silhouette
face treatment
hair treatment
accessories where appropriate
idle state
contextual states

Where technically practical, provide customization for:

display name
avatar style
appearance parameters
accent selection

Do not require a user photo.

The character should stand naturally within the world.

============================================================
26. CHARACTER PROGRESSION
============================================================

The character should visually represent progression.

Progression may influence:

- clothing accents
- accessories
- badges
- environment
- aura/glow
- level marker
- achievement markers

Do not make the character progressively "better" in a moral sense.

It represents recorded activity.

============================================================
27. WORLD — PRIMARY INTERFACE
============================================================

The world should be an original personal environment.

Possible structures:

islands
districts
neighborhoods
regions
roads
rivers
parks
buildings
landmarks
bridges
trails
plazas

The actual structure should be driven by user data.

Avoid simply rendering rectangles labelled:

"Career 30%"
"Learning 20%"

The data must be translated into spatial visual language.

============================================================
28. ISOMETRIC / 2.5D STYLE
============================================================

Prefer:

isometric
pseudo-isometric
layered 2.5D

where practical.

The world should communicate:

depth
scale
distance
hierarchy

Use lightweight technologies:

SVG
Canvas
CSS transforms
layered vector graphics

Use WebGL only if clearly justified.

Do not introduce a heavyweight 3D engine merely for visual novelty.

============================================================
29. DATA → WORLD MAPPING
============================================================

Every major visual encoding must correspond to a real metric.

Example mappings:

TIME ALLOCATION
→ district size

ACTIVITY FREQUENCY
→ environmental activity

CONSISTENCY
→ district development

RECENT ACTIVITY
→ visual intensity

LONG-TERM GROWTH
→ environmental progression

MILESTONES
→ landmarks

GAPS
→ quieter/less-developed areas

UNKNOWN DATA
→ unexplored areas

Document these mappings.

============================================================
30. DYNAMIC WORLD
============================================================

The world should not be static.

It should change based on the selected period.

For example:

June

↓

July

↓

August

The world changes according to the data.

A category that becomes more active can become more developed.

A category with little activity can remain smaller or quieter.

Never imply that more activity is objectively better.

============================================================
31. FOG OF WAR
============================================================

Create an optional fog-of-war concept.

If the user has insufficient data about an area:

show an unexplored region.

As the user provides more information:

the region becomes visible.

The concept should communicate:

"You only reveal what you choose to track."

Never fabricate unknown information.

============================================================
32. WORLD LANDMARKS
============================================================

Create meaningful landmarks.

Examples:

Learning milestone
→ observatory / library / academy

Career milestone
→ tower / headquarters / civic building

Fitness milestone
→ stadium / summit / training grounds

Creative milestone
→ studio / gallery

Travel milestone
→ harbor / gateway

These are examples.

The actual mapping should remain extensible.

Landmarks must be tied to actual metrics.

============================================================
33. CAMERA
============================================================

The world should have a deliberate camera experience.

Support:

zoom
pan
focus
selected-region transition
character focus

When a user selects a region:

smoothly transition toward it.

Do not make the experience feel like clicking between unrelated
dashboard cards.

============================================================
34. ENVIRONMENTAL STORYTELLING
============================================================

Each category should have a visually distinct environment.

Example:

Learning:

library
academy
observatory
research environment

Career:

professional district
office
city environment

Fitness:

park
training area
stadium

Creative:

studio
gallery
workshop

Social:

plaza
café
community area

Travel:

harbor
gateway
exploration area

These must remain original.

The world should feel coherent rather than like a collection of random
illustrations.

============================================================
35. WORLD DEPTH
============================================================

Use layered composition.

Possible layers:

background atmosphere
far terrain
midground
district
landmarks
character
foreground
interface

Use depth carefully.

Do not overwhelm the user.

============================================================
36. LIGHTING / ATMOSPHERE
============================================================

Create a restrained environmental lighting system.

Possible states:

morning
day
evening
night

Where useful, the selected period/time may influence atmosphere.

Lighting should support immersion.

Do not use random gradients merely for decoration.

============================================================
37. MOTION
============================================================

Animation should communicate:

navigation
progression
state
interaction

Examples:

character idle
character movement
region highlight
district development
landmark reveal
XP animation
level-up
timeline transition
camera movement

Do not make everything move continuously.

Respect:

prefers-reduced-motion

============================================================
38. CHARACTER + WORLD INTERACTION
============================================================

The character should feel connected to the world.

When a user selects:

Learning

the character can visually transition toward the Learning district.

When the user selects:

Fitness

the character can transition toward Fitness.

The exact implementation may be 2D/2.5D animation rather than true
gameplay.

The goal is the feeling of exploration.

============================================================
39. LEVEL-UP EXPERIENCE
============================================================

When a meaningful threshold is reached:

show a polished level-up interaction.

Potential elements:

XP progression
character emphasis
environmental illumination
new landmark
subtle particle effect
camera focus
achievement notification

Do not make this childish or visually noisy.

============================================================
40. TIMELINE
============================================================

Create a major timeline view.

It should show:

activity clusters
category changes
streaks
gaps
milestones
records
period transitions

Selecting a period should update the world.

The user should feel as though they are travelling through their own
history.

============================================================
41. PERIOD COMPARISON
============================================================

Allow users to compare periods.

Example:

June vs August

Show:

tracked time
category distribution
frequency
consistency
planned completion
energy
mood
major changes

The comparison should be visual.

Avoid a spreadsheet-like experience.

============================================================
42. INSIGHTS
============================================================

Create a deterministic insights engine.

Do not use an LLM.

Only show insights supported by the data.

Examples:

"Learning accounted for 27% of tracked time."

"Learning increased 18% compared with the previous period."

"Your longest learning streak occurred this month."

"Your tracked activity is concentrated between 9 AM and noon."

"Your longest uninterrupted session was 2 hours 14 minutes."

Never fill empty space with generic motivational statements.

============================================================
43. CHARACTER SCREEN
============================================================

Create a dedicated character/profile screen.

Display:

avatar
level
total XP
category progression
recent achievements
personal records
recent changes

Use the same visual language as the world.

Do not turn it into a conventional dashboard.

============================================================
44. DATA SCREEN
============================================================

Provide a transparent data view.

Users can:

search
filter
sort

Show normalized records.

This screen exists for transparency and verification.

It should be visually clean but subordinate to the world.

============================================================
45. METHODOLOGY
============================================================

Create a methodology section.

Explain:

time calculations
category calculations
consistency
XP
levels
trends
associations
thresholds

The user should be able to understand why the application produced a
particular result.

============================================================
46. EXPORT
============================================================

Provide:

Download normalized CSV.

Also provide:

LIFEMAP CAPSULE

This should produce a standalone HTML document containing:

selected data
key metrics
visualizations where practical
date range
category summary
methodology

The capsule must work without a server.

Do not include hidden tracking.

============================================================
47. RESET
============================================================

Provide:

Reset LifeMap

This must actually clear the current dataset.

Require confirmation.

Return to initial state.

============================================================
48. LANDING PAGE
============================================================

The landing page must be visually spectacular but lightweight.

Hero:

LIFEMAP

See the shape of your life.

Supporting text:

"Turn your own activity data into a private, interactive world that
shows how your time and behavior evolve."

Primary CTA:

CREATE MY LIFEMAP

Secondary CTA:

EXPLORE DEMO

Privacy statement:

YOUR DATA STAYS ON THIS DEVICE.

Show an animated preview of the world.

Do not let the landing page become more visually important than the
actual product.

============================================================
49. ONBOARDING
============================================================

Keep onboarding concise.

Step 1:

Welcome.

Step 2:

Choose:

Import data
Enter data
Explore demo

Step 3:

Import.

Step 4:

Map fields.

Step 5:

Review.

Step 6:

Generate world.

Avoid unnecessary registration.

============================================================
50. EMPTY STATES
============================================================

Design polished empty states.

Examples:

No data yet.

No historical data.

No energy information.

Insufficient sample size.

No trend detected.

Explain what the user can do next.

============================================================
51. RESPONSIVE DESIGN
============================================================

Support:

desktop
tablet
mobile

At approximately 320px width:

No page-level horizontal overflow.

No unusable controls.

No broken world.

No microscopic text.

The mobile version may reorganize the world and controls.

Do not merely scale down desktop.

============================================================
52. ACCESSIBILITY
============================================================

Use:

semantic HTML
keyboard navigation
focus states
ARIA where appropriate
sufficient contrast
touch-friendly controls
screen-reader descriptions
non-hover alternatives

The world must have an accessible alternative representation.

Do not rely only on color.

Respect reduced motion.

============================================================
53. SECURITY
============================================================

Treat all imported content as untrusted.

Prevent:

HTML injection
script injection
unsafe rendering
malicious imported strings

Avoid dangerouslySetInnerHTML unless absolutely necessary.

Do not execute imported files.

Do not interpret user data as code.

============================================================
54. PERFORMANCE
============================================================

The application must remain responsive.

Use:

memoization
efficient state management
appropriate component boundaries
lazy loading where justified
efficient calculations

For large but realistic datasets, consider Web Workers if necessary.

Do not optimize prematurely.

============================================================
55. NO AI REQUIREMENT
============================================================

The core product must not require AI.

Do not download local AI models.

Do not use LLM APIs.

Do not describe deterministic analytics as AI.

The absence of AI is intentional.

LifeMap demonstrates that useful personal intelligence can be generated
from transparent local computation.

============================================================
56. ENGINEERING STACK
============================================================

Preferred:

TypeScript
React
Vite

Use a lightweight styling architecture.

Use SVG/Canvas for the world.

Use a charting library only where necessary.

Use a testing framework appropriate to the stack.

Use browser automation if available.

Avoid unnecessary dependencies.

============================================================
57. TESTING
============================================================

Create automated tests for:

CSV parsing
JSON parsing
field normalization
date handling
duration
category aggregation
time allocation
trend calculation
consistency
XP
levels
associations
malformed input
empty data
duplicates

Create integration tests for:

landing
demo
CSV import
JSON import
manual entry
world generation
region selection
timeline
comparison
export
reset

============================================================
58. BROWSER TESTING
============================================================

If browser automation is available:

open the actual application

test desktop

test mobile

test:

landing
demo
import
analysis
world
character
timeline
insights
comparison
export
reset

Check:

console errors
broken assets
broken routes
overflow
unresponsive controls
visual defects

Fix issues found.

============================================================
59. VISUAL QA — CRITICAL
============================================================

Do NOT consider the visual implementation complete merely because the
application compiles.

After the first working world exists:

RUN THE APPLICATION.

INSPECT THE ACTUAL RENDERED WORLD.

Evaluate:

Does it feel like a world?

Does the character feel like a protagonist?

Does the map have depth?

Does the environment feel coherent?

Does the world communicate data?

Does it feel original?

Does it look like a generic dashboard?

Does the interface overpower the world?

Does the character feel pasted on?

Are the regions visually meaningful?

Are transitions smooth?

Does mobile remain usable?

Are there empty or awkward areas?

Are visual elements aligned?

Does typography feel intentional?

Does the color system feel coherent?

Does the product feel premium?

If the answer is no:

ITERATE.

Do not simply report the problem.

Fix it.

Then inspect again.

============================================================
60. VISUAL QUALITY GATE
============================================================

PHASE 5 — WORLD VISUALIZATION — MUST NOT BE MARKED COMPLETE UNTIL:

1. The world renders.
2. The character renders.
3. Data changes the world.
4. Regions are spatially understandable.
5. The world is interactive.
6. Camera interactions work.
7. Character/world interaction works where implemented.
8. The visual hierarchy is correct.
9. The world does not look like a dashboard.
10. The world uses original assets.
11. Mobile behavior works.
12. Reduced-motion behavior works.
13. Accessibility alternatives exist.
14. The rendered result has been visually inspected.
15. Weak visual elements have been iterated.

============================================================
61. VISUAL DESIGN SYSTEM
============================================================

Define a coherent design system.

Document:

typography
spacing
radius
surface hierarchy
category colors
interaction states
map language
icon language
motion language

Do not use random values.

Create reusable design tokens.

============================================================
62. COLOR SYSTEM
============================================================

Use a restrained palette.

Each category may receive a distinct accent.

Ensure:

contrast
consistency
accessibility

Do not use:

random neon
excessive gradients
rainbow overload
glowing borders everywhere

Color must communicate meaning.

============================================================
63. TYPOGRAPHY
============================================================

Use an appropriate modern font system.

Use display typography for major world/product moments.

Use highly readable typography for metrics.

Do not use decorative fonts that damage usability.

============================================================
64. UI CHROME
============================================================

Keep conventional UI minimal.

The interface should frame the world rather than replace it.

Avoid:

card grids everywhere
sidebar overload
giant navigation bars
dashboard clutter

The world is the hero.

============================================================
65. VISUAL NO-CHEAP-SHORTCUT RULE
============================================================

Do not satisfy the game aesthetic by adding:

- emoji
- random particles
- neon gradients
- generic cartoon people
- stock illustrations
- excessive glassmorphism
- random game icons
- arbitrary glow
- meaningless badges

Visual complexity should come from:

composition
environment
illustration
spatial hierarchy
interaction
animation
data-driven state

============================================================
66. PRODUCT INTERACTION
============================================================

Transitions between:

World
Character
Timeline
Insights
Compare
Data

must feel like different views of the same product.

Maintain:

same world language
same character
same visual identity
same category language

Do not make every page look unrelated.

============================================================
67. DATA-DRIVEN WORLD EXAMPLE
============================================================

If the user has:

Career 35%
Learning 25%
Fitness 15%
Social 10%
Recreation 15%

the world should visually communicate this distribution.

Career should have significant visual presence.

Learning should have significant visual presence.

Fitness should be smaller.

Social and recreation should be represented accordingly.

The exact rendering technique is your engineering decision.

============================================================
68. PERSONALIZATION
============================================================

The user should be able to define categories.

Do not assume everyone's life is:

work
gym
study
sleep

Allow:

custom categories
custom names
custom data

The world should adapt.

============================================================
69. USER DATA SHOULD DRIVE THE PRODUCT
============================================================

There must be a meaningful distinction between:

DEMO MODE

and

USER MODE.

Demo mode uses fictional seeded data.

User mode uses actual imported user data.

Do not mix the two.

============================================================
70. NO FABRICATED INSIGHTS
============================================================

If the user provides insufficient data:

say so.

Examples:

"Not enough historical data for comparison."

"Not enough observations to estimate an association."

"Add more records to reveal this area."

Never fabricate.

============================================================
71. DOCUMENTATION
============================================================

Create:

README.md

AGENTS.md

PROJECT_SPEC.md

docs/ARCHITECTURE.md

docs/DATA_MODEL.md

docs/ANALYTICS.md

docs/PRIVACY.md

docs/DESIGN.md

docs/TESTING.md

Documentation must describe actual implementation.

============================================================
72. README
============================================================

README should contain:

project overview
why it exists
features
privacy model
architecture
data model
analytics
visual system
technology stack
local development
testing
production build
GitHub Pages deployment
limitations
future roadmap

Explain that:

No backend is required.

No personal data upload occurs.

No AI API is required.

============================================================
73. AGENTS.MD
============================================================

Create an AGENTS.md containing project-specific engineering rules.

Include:

1. Never upload user data.
2. Never introduce an AI API.
3. Never introduce unnecessary infrastructure.
4. Never commit secrets.
5. Never commit personal data.
6. Never use copyrighted game assets.
7. Never make unsupported analytical claims.
8. Never turn the world into a generic dashboard.
9. Keep the character and world visually central.
10. Every visual encoding must have a documented meaning.
11. Every metric must be reproducible.
12. Every imported value is untrusted input.
13. Keep dependencies lightweight.
14. Preserve GitHub Pages compatibility.
15. Test before declaring phases complete.
16. Preserve accessibility.
17. Preserve responsive design.
18. Fix broken functionality instead of documenting it as a limitation.
19. Do not optimize for screenshots alone.
20. The final product should feel like real software.

============================================================
74. PROJECT SPEC
============================================================

Save this entire product specification into:

PROJECT_SPEC.md

Keep it synchronized with implementation if requirements materially
change.

============================================================
75. ENGINEERING PHASES
============================================================

PHASE 0 — ENVIRONMENT

Inspect:

OS
Node
package manager
Git
repository
browser/testing tools

Do not install unnecessary software.

PHASE 1 — ARCHITECTURE

Create:

folder structure
component architecture
data model
analytics architecture
visualization architecture

PHASE 2 — FOUNDATION

Create:

project scaffold
routing
design tokens
basic application shell

PHASE 3 — DATA

Implement:

CSV
JSON
manual entry
validation
normalization

PHASE 4 — ANALYTICS

Implement:

time
categories
trends
consistency
fragmentation
XP
associations
comparison

PHASE 5 — WORLD

Implement:

world
regions
character
camera
environment
landmarks
data-driven mapping
fog of war

Then perform mandatory visual review.

PHASE 6 — CHARACTER

Implement:

profile
progression
levels
achievements

PHASE 7 — TIMELINE / COMPARISON

Implement:

timeline
historical navigation
period comparison

PHASE 8 — INSIGHTS

Implement deterministic insight engine.

PHASE 9 — EXPORT

Implement:

normalized CSV
LifeMap Capsule

PHASE 10 — RESPONSIVE / ACCESSIBILITY

Complete:

mobile
tablet
desktop
keyboard
screen reader
reduced motion

PHASE 11 — SECURITY / PRIVACY AUDIT

Verify:

no uploads
no external APIs
no trackers
safe imports
no injection vulnerabilities

PHASE 12 — TESTING

Run all tests.

PHASE 13 — PERFORMANCE

Profile and optimize meaningful issues.

PHASE 14 — PRODUCTION

Build production version.

PHASE 15 — GITHUB

Prepare:

GitHub Pages workflow
README
.gitignore
repository structure

PHASE 16 — FINAL AUDIT

Review entire product.

============================================================
76. PHASE GATES
============================================================

At the end of every phase:

1. Run relevant tests.
2. Inspect output.
3. Fix failures.
4. Update documentation.
5. Check requirements.
6. Continue only when stable.

============================================================
77. FAILURE RECOVERY
============================================================

If a dependency fails:

replace it with a simpler dependency where possible.

If a visual technique is too expensive:

replace it with a lightweight SVG/Canvas/CSS approach.

If a feature threatens privacy:

remove or redesign it.

If a feature cannot be implemented reliably:

do not fake it.

If a feature is unnecessary:

remove it.

If the world looks generic:

iterate the visual design.

============================================================
78. GITHUB PREPARATION
============================================================

Before release:

Check Git status.

Ensure:

no secrets
no API keys
no private datasets
no node_modules
no temporary files
no caches
no large unnecessary binaries

README must be complete.

Production build must succeed.

Deployment configuration must be correct.

============================================================
79. PRODUCTION VALIDATION
============================================================

Run:

type checking

lint

unit tests

integration tests

production build

where available:

browser tests

visual inspection

mobile inspection

Fix all reasonable issues.

============================================================
80. FINAL SECURITY CHECK
============================================================

Search repository for:

API keys
tokens
passwords
credentials
private datasets
personal exports

Remove anything inappropriate.

============================================================
81. FINAL USER EXPERIENCE AUDIT
============================================================

Pretend you are a first-time user.

Can you understand LifeMap in 10 seconds?

Can you create a map without reading documentation?

Can you import a CSV?

Can you understand the detected fields?

Can you see what the application calculated?

Can you understand why the world looks the way it does?

Can you navigate the world?

Can you understand your progression?

Can you compare time periods?

Can you export your result?

Can you delete your data?

Does the privacy model make sense?

============================================================
82. FINAL VISUAL AUDIT
============================================================

Pretend you are a professional game UI/UX designer.

Evaluate:

CHARACTER

Does it feel like a protagonist?

WORLD

Does it feel like a real place?

COMPOSITION

Is the visual hierarchy strong?

DEPTH

Does the world feel spatial?

ENVIRONMENT

Do districts feel distinct?

MOTION

Does animation communicate meaning?

PROGRESSION

Does the level system feel satisfying?

DATA

Can the user understand what the world represents?

ORIGINALITY

Does it feel like LifeMap rather than another product?

POLISH

Would a user remember the experience?

If not:

iterate.

============================================================
83. FINAL PORTFOLIO QUALITY
============================================================

The completed project should be credible as a real software project.

A technical reviewer should be able to inspect:

architecture
data model
analytics
privacy
testing
deployment

A product reviewer should be able to understand:

problem
user
solution
UX
value

A design reviewer should see:

coherent visual identity
world building
character
interaction
motion
data visualization

============================================================
84. FINAL REPORT
============================================================

After completing the project, provide:

PROJECT STATUS

WHAT WAS BUILT

TECHNOLOGY STACK

ARCHITECTURE

DATA MODEL

ANALYTICS

WORLD SYSTEM

CHARACTER SYSTEM

PRIVACY ARCHITECTURE

EXPORT SYSTEM

TESTS

TEST RESULTS

BUILD RESULT

BROWSER TEST RESULTS

KNOWN LIMITATIONS

FILES CREATED

GITHUB DEPLOYMENT INSTRUCTIONS

NEXT IMPROVEMENTS

Do not claim tests were run if they were not run.

Do not claim deployment was verified if it was not verified.

============================================================
85. FINAL EXECUTION INSTRUCTION
============================================================

START NOW.

Begin with PHASE 0.

Inspect the existing environment.

Then proceed through every phase.

Do not stop after scaffolding.

Do not stop after creating a mockup.

Do not stop after the first screen.

Do not stop after implementing the analytics.

Do not stop after implementing the world.

Continue through:

testing
debugging
visual refinement
accessibility
security
documentation
production build
GitHub Pages preparation

The final objective is:

A COMPLETE, FUNCTIONAL, BEAUTIFUL, ORIGINAL,
PRIVACY-FIRST LIFEMAP APPLICATION.

The finished experience should feel like:

"I entered a visual world generated from my own life."

The technical architecture should feel like:

"A serious local-first information system."

The analytics should feel like:

"Transparent personal data intelligence."

The design should feel like:

"A premium original game-inspired experience."

The software should be:

reliable
responsive
accessible
testable
documented
deployable
maintainable

Do not sacrifice the visual ambition merely because the application is
technically functional.

Do not sacrifice technical correctness merely because the application
looks beautiful.

Build both.

BEGIN PHASE 0.