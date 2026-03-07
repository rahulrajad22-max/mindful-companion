export interface QuizOption {
  text: string;
  correct?: boolean;
}

export interface QuizElement {
  type: "quiz";
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface ReflectionElement {
  type: "reflection";
  prompt: string;
  placeholder?: string;
}

export interface CheckpointElement {
  type: "checkpoint";
  title: string;
  checklist: string[];
}

export type InteractiveElement = QuizElement | ReflectionElement | CheckpointElement;

export interface BookChapter {
  id: number;
  title: string;
  content: string;
  readingTime: number; // minutes
  interactives?: InteractiveElement[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverEmoji: string;
  totalChapters: number;
  chapters: BookChapter[];
  tags: string[];
}

export const BOOK_CATEGORIES = [
  "All",
  "Anxiety & Stress",
  "Depression",
  "Self-Esteem",
  "Mindfulness",
  "Relationships",
  "Resilience",
  "PTSD & Trauma",
  "Addiction Recovery",
  "Sleep & Rest",
] as const;

export const mentalHealthBooks: Book[] = [
  {
    id: "understanding-anxiety",
    title: "Understanding & Overcoming Anxiety",
    author: "MindfulMe Wellness Team",
    description: "A comprehensive guide to understanding anxiety, its root causes, and practical techniques to manage and overcome it.",
    category: "Anxiety & Stress",
    coverEmoji: "🧠",
    totalChapters: 5,
    tags: ["anxiety", "coping", "CBT", "breathing"],
    chapters: [
      {
        id: 1,
        title: "What is Anxiety?",
        readingTime: 5,
        content: `# What is Anxiety?

Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While it's normal to feel anxious occasionally, persistent anxiety can interfere with daily life.

## The Science Behind Anxiety

When you perceive a threat, your brain's **amygdala** activates the "fight-or-flight" response. This triggers:

- **Increased heart rate** — pumping blood to muscles
- **Rapid breathing** — taking in more oxygen
- **Muscle tension** — preparing for action
- **Heightened alertness** — scanning for danger

In anxiety disorders, this system becomes overactive, triggering alarm responses even when there's no real danger.

## Types of Anxiety

1. **Generalized Anxiety Disorder (GAD)** — Persistent worry about everyday things
2. **Social Anxiety** — Intense fear of social situations
3. **Panic Disorder** — Sudden episodes of intense fear
4. **Specific Phobias** — Extreme fear of specific objects or situations

## Key Takeaway

Anxiety is not a character flaw — it's a medical condition that can be effectively managed with the right tools and support.

> "You don't have to control your thoughts. You just have to stop letting them control you." — Dan Millman`,
      },
      {
        id: 2,
        title: "Identifying Your Triggers",
        readingTime: 6,
        content: `# Identifying Your Triggers

Understanding what triggers your anxiety is the first step toward managing it effectively.

## Common Anxiety Triggers

### External Triggers
- **Work pressure** — Deadlines, presentations, evaluations
- **Social situations** — Parties, meetings, public speaking
- **Financial stress** — Bills, debt, job insecurity
- **Health concerns** — Medical appointments, symptoms
- **Relationships** — Conflicts, loneliness, breakups

### Internal Triggers
- **Negative self-talk** — "I'm not good enough"
- **Perfectionism** — Setting impossibly high standards
- **Catastrophizing** — Imagining the worst possible outcome
- **Rumination** — Replaying past events over and over

## The Trigger Journal Exercise

Start tracking your anxiety triggers using this format:

| When | Where | What happened | Anxiety level (1-10) | Physical symptoms |
|------|-------|---------------|---------------------|-------------------|
| Monday 9am | Office | Meeting announcement | 7 | Racing heart, sweaty palms |

## Patterns to Look For

After a week of journaling, look for:
- **Time patterns** — Do certain times of day trigger more anxiety?
- **People patterns** — Are specific people involved?
- **Situation patterns** — Do similar situations repeat?

> "Awareness is the greatest agent for change." — Eckhart Tolle`,
      },
      {
        id: 3,
        title: "Breathing & Grounding Techniques",
        readingTime: 7,
        content: `# Breathing & Grounding Techniques

When anxiety strikes, your body's stress response takes over. These techniques help you regain control.

## 4-7-8 Breathing Technique

This technique activates your parasympathetic nervous system:

1. **Breathe in** through your nose for **4 seconds**
2. **Hold** your breath for **7 seconds**
3. **Exhale** slowly through your mouth for **8 seconds**
4. Repeat **4 times**

## Box Breathing

Used by Navy SEALs for stress management:

1. Inhale for **4 seconds**
2. Hold for **4 seconds**
3. Exhale for **4 seconds**
4. Hold for **4 seconds**
5. Repeat **4-6 times**

## The 5-4-3-2-1 Grounding Method

Engage all five senses to anchor yourself in the present:

- **5 things** you can **see**
- **4 things** you can **touch**
- **3 things** you can **hear**
- **2 things** you can **smell**
- **1 thing** you can **taste**

## Progressive Muscle Relaxation

Systematically tense and release each muscle group:

1. Start with your **feet** — tense for 5 seconds, then release
2. Move to your **calves** — tense and release
3. Continue upward through **thighs, abdomen, hands, arms, shoulders, face**
4. Notice the contrast between tension and relaxation

## When to Use These Techniques

- Before a stressful event (presentation, meeting)
- During a panic episode
- At bedtime when thoughts race
- Anytime you notice physical anxiety symptoms

> "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor." — Thich Nhat Hanh`,
      },
      {
        id: 4,
        title: "Cognitive Behavioral Strategies",
        readingTime: 8,
        content: `# Cognitive Behavioral Strategies

Cognitive Behavioral Therapy (CBT) is one of the most effective approaches for managing anxiety. It works by changing the thought patterns that fuel anxiety.

## The CBT Triangle

Your **thoughts**, **feelings**, and **behaviors** are all interconnected:

- **Thought**: "I'll fail this exam" →
- **Feeling**: Anxiety, dread →
- **Behavior**: Avoidance, procrastination

Change any one corner, and the others shift too.

## Common Cognitive Distortions

Learn to spot these thinking traps:

### 1. Catastrophizing
**Distorted**: "If I make a mistake, everything will fall apart"
**Balanced**: "Mistakes are normal and rarely as catastrophic as I imagine"

### 2. Mind Reading
**Distorted**: "Everyone thinks I'm incompetent"
**Balanced**: "I don't know what others think unless they tell me"

### 3. All-or-Nothing Thinking
**Distorted**: "If it's not perfect, it's a failure"
**Balanced**: "Progress is more important than perfection"

### 4. Fortune Telling
**Distorted**: "I know this will go badly"
**Balanced**: "I can't predict the future; many outcomes are possible"

## The ABCDE Method

- **A** — Activating event (what happened)
- **B** — Belief (what you told yourself)
- **C** — Consequence (how you felt/acted)
- **D** — Dispute (challenge the belief)
- **E** — Effective new belief (balanced thought)

## Thought Record Exercise

When anxious, write down:
1. The situation
2. Your automatic thought
3. Evidence **for** the thought
4. Evidence **against** the thought
5. A more balanced perspective

> "The greatest weapon against stress is our ability to choose one thought over another." — William James`,
      },
      {
        id: 5,
        title: "Building Long-Term Resilience",
        readingTime: 6,
        content: `# Building Long-Term Resilience

Managing anxiety isn't just about coping in the moment — it's about building habits that reduce anxiety over time.

## The Four Pillars of Anxiety Resilience

### 1. Sleep Hygiene
- Maintain a consistent sleep schedule
- Avoid screens 1 hour before bed
- Keep your bedroom cool and dark
- Aim for 7-9 hours of sleep

### 2. Physical Activity
- Exercise reduces cortisol and increases endorphins
- Even 20 minutes of walking helps
- Yoga combines movement with mindfulness
- Aim for 150 minutes of moderate exercise per week

### 3. Nutrition
- Reduce caffeine (it mimics anxiety symptoms)
- Eat regular, balanced meals
- Omega-3 fatty acids support brain health
- Stay hydrated

### 4. Social Connection
- Share your feelings with trusted people
- Join support groups (online or in-person)
- Don't isolate — anxiety thrives in solitude
- Set healthy boundaries

## Creating Your Anxiety Action Plan

Write a personalized plan:

1. **My top 3 triggers**: ___
2. **My go-to breathing technique**: ___
3. **My challenge thoughts using**: ___
4. **My support person**: ___
5. **My daily wellness habits**: ___

## When to Seek Professional Help

Consider professional support if:
- Anxiety persists for more than 2 weeks
- It interferes with work, school, or relationships
- You experience panic attacks
- You use substances to cope
- You have thoughts of self-harm

**Remember**: Seeking help is a sign of strength, not weakness.

> "You are braver than you believe, stronger than you seem, and smarter than you think." — A.A. Milne`,
      },
    ],
  },
  {
    id: "defeating-depression",
    title: "Light Through the Darkness: Defeating Depression",
    author: "MindfulMe Wellness Team",
    description: "Understanding depression and finding pathways back to hope, purpose, and joy.",
    category: "Depression",
    coverEmoji: "🌅",
    totalChapters: 4,
    tags: ["depression", "hope", "therapy", "self-care"],
    chapters: [
      {
        id: 1,
        title: "Understanding Depression",
        readingTime: 6,
        content: `# Understanding Depression

Depression is more than just feeling sad. It's a complex mental health condition that affects how you think, feel, and function.

## Depression vs. Sadness

Everyone feels sad sometimes. Depression is different:

| Sadness | Depression |
|---------|-----------|
| Triggered by an event | May have no clear trigger |
| Temporary | Persists for 2+ weeks |
| Doesn't affect self-worth | Deep feelings of worthlessness |
| You can still enjoy things | Loss of interest in everything |

## Common Symptoms

- Persistent low mood or emptiness
- Loss of interest in activities you once enjoyed
- Changes in appetite and weight
- Sleep disturbances (too much or too little)
- Fatigue and low energy
- Difficulty concentrating
- Feelings of guilt or worthlessness
- Withdrawal from social activities

## The Brain Chemistry

Depression involves imbalances in neurotransmitters:
- **Serotonin** — Regulates mood, sleep, appetite
- **Dopamine** — Controls motivation and pleasure
- **Norepinephrine** — Affects energy and alertness

## Important Truth

Depression is **not your fault**. It's a medical condition influenced by genetics, brain chemistry, life events, and environment.

> "Even the darkest night will end, and the sun will rise." — Victor Hugo`,
      },
      {
        id: 2,
        title: "Small Steps Forward",
        readingTime: 5,
        content: `# Small Steps Forward

When depression weighs you down, even small actions can feel monumental. The key is starting incredibly small.

## The 5-Minute Rule

Tell yourself: "I'll do this for just 5 minutes." Often, starting is the hardest part.

- **Can't exercise?** Walk to your mailbox and back
- **Can't clean?** Wash one dish
- **Can't socialize?** Send one text message
- **Can't work?** Open one document

## Behavioral Activation

Depression creates a vicious cycle: you feel bad → you do less → you feel worse. Breaking this cycle:

### Activity Scheduling
Plan one small pleasant activity each day:
- Monday: Listen to a favorite song
- Tuesday: Step outside for 5 minutes
- Wednesday: Call a friend
- Thursday: Cook something simple
- Friday: Watch something funny

### Mastery & Pleasure
Rate activities on two scales:
- **Mastery** (0-10): How much accomplishment you felt
- **Pleasure** (0-10): How much enjoyment you felt

Track these to discover what helps most.

## Self-Compassion

Replace self-criticism with self-compassion:
- ❌ "I should be able to handle this"
- ✅ "I'm going through something difficult, and I'm doing my best"

> "The journey of a thousand miles begins with a single step." — Lao Tzu`,
      },
      {
        id: 3,
        title: "Building Your Support System",
        readingTime: 5,
        content: `# Building Your Support System

Depression makes you want to isolate, but connection is one of the most powerful antidotes.

## Types of Support

### Emotional Support
People who listen without judgment:
- Close friends or family members
- Therapists or counselors
- Support groups
- Online communities

### Practical Support
People who help with daily tasks:
- Someone to exercise with
- A study or accountability partner
- Help with errands when you're struggling

### Professional Support
- **Psychologists** — Talk therapy (CBT, DBT, etc.)
- **Psychiatrists** — Medication management
- **Counselors** — Guidance and coping strategies
- **Crisis hotlines** — Immediate support

## How to Ask for Help

It's okay to say:
- "I've been struggling lately and could use someone to talk to"
- "I don't need advice — I just need someone to listen"
- "Could you help me with [specific task]? I'm having a hard time"

## Crisis Resources

If you're in crisis:
- **988 Suicide & Crisis Lifeline**: Call or text 988
- **Crisis Text Line**: Text HOME to 741741
- **iCall (India)**: 9152987821
- **Vandrevala Foundation**: 1860-2662-345

> "You don't have to struggle in silence. You can be un-silent." — Demi Lovato`,
      },
      {
        id: 4,
        title: "Creating a Recovery Plan",
        readingTime: 6,
        content: `# Creating a Recovery Plan

Recovery from depression is not linear — there will be good days and bad days. A plan helps you navigate both.

## Your Personal Recovery Toolkit

### Morning Routine (choose 3)
- [ ] Get out of bed at a set time
- [ ] Open curtains for natural light
- [ ] Drink a glass of water
- [ ] Do 5 minutes of stretching
- [ ] Write 3 things you're grateful for

### When You're Having a Bad Day
1. Acknowledge it: "Today is hard, and that's okay"
2. Do ONE small thing from your activity list
3. Reach out to someone
4. Practice a grounding technique
5. Remind yourself: bad days are temporary

### Warning Signs to Watch
Know your personal red flags:
- Sleeping much more or less than usual
- Skipping meals regularly
- Withdrawing from everyone
- Increased substance use
- Negative thoughts becoming louder

### Emergency Contacts
Write down:
- My therapist: ___
- My trusted friend: ___
- Crisis hotline: 988
- My safe place: ___

## Celebrating Progress

Depression steals your ability to recognize progress. Track:
- Days you got out of bed ✓
- Activities you completed ✓
- Social interactions you had ✓
- Self-care actions you took ✓

Every checkmark is a victory.

> "There is hope, even when your brain tells you there isn't." — John Green`,
      },
    ],
  },
  {
    id: "building-self-esteem",
    title: "The Self-Esteem Blueprint",
    author: "MindfulMe Wellness Team",
    description: "Practical exercises and insights for building genuine self-worth and confidence.",
    category: "Self-Esteem",
    coverEmoji: "💪",
    totalChapters: 4,
    tags: ["self-esteem", "confidence", "self-worth", "growth"],
    chapters: [
      {
        id: 1,
        title: "Understanding Self-Esteem",
        readingTime: 5,
        content: `# Understanding Self-Esteem

Self-esteem is how you perceive your own worth. It affects every area of your life — relationships, career, mental health, and happiness.

## Healthy vs. Unhealthy Self-Esteem

### Signs of Low Self-Esteem
- Constant self-criticism
- Difficulty accepting compliments
- Fear of failure or trying new things
- People-pleasing behavior
- Comparing yourself unfavorably to others

### Signs of Healthy Self-Esteem
- Accepting both strengths and weaknesses
- Setting healthy boundaries
- Handling criticism constructively
- Taking pride in accomplishments
- Being kind to yourself during setbacks

## Where Does Self-Esteem Come From?

Your self-esteem was shaped by:
- **Childhood experiences** — How you were treated by caregivers
- **School experiences** — Academic and social feedback
- **Relationships** — How partners and friends treat you
- **Culture & media** — Unrealistic standards
- **Inner dialogue** — The voice in your head

## The Good News

Self-esteem is **not fixed**. It can be rebuilt at any age with consistent practice.

> "No one can make you feel inferior without your consent." — Eleanor Roosevelt`,
      },
      {
        id: 2,
        title: "Silencing the Inner Critic",
        readingTime: 6,
        content: `# Silencing the Inner Critic

That harsh voice in your head? It's your inner critic — and it can be tamed.

## Recognizing Your Inner Critic

Common inner critic statements:
- "You're not smart enough"
- "Everyone is better than you"
- "You don't deserve good things"
- "You'll just mess this up"

## The Name It to Tame It Technique

Give your inner critic a name (e.g., "The Judge"). When it speaks:
1. Recognize it: "Oh, that's The Judge talking again"
2. Thank it: "Thanks for trying to protect me"
3. Redirect: "But I choose to think differently now"

## Replacing Negative Self-Talk

| Inner Critic Says | You Can Say Instead |
|-------------------|---------------------|
| "I'm a failure" | "I'm learning and growing" |
| "I can't do anything right" | "I do many things well" |
| "Nobody likes me" | "The right people appreciate me" |
| "I'm not enough" | "I am enough as I am" |

## The Self-Compassion Break

When self-criticism hits:
1. **Mindfulness**: "This is a moment of suffering"
2. **Common humanity**: "Others feel this way too"
3. **Self-kindness**: "May I be kind to myself right now"

## Daily Practice: Mirror Affirmations

Each morning, look in the mirror and say:
- "I am worthy of love and respect"
- "I am capable and strong"
- "I choose to be kind to myself today"

> "Talk to yourself like someone you love." — Brené Brown`,
      },
      {
        id: 3,
        title: "Setting Boundaries",
        readingTime: 5,
        content: `# Setting Boundaries

Healthy boundaries are essential for self-esteem. They teach others — and yourself — that your needs matter.

## What Are Boundaries?

Boundaries are limits you set to protect your:
- **Time** — "I can't take on more right now"
- **Energy** — "I need to rest this weekend"
- **Emotions** — "I'm not comfortable discussing that"
- **Physical space** — "I need some alone time"

## Why Boundaries Are Hard

- Fear of rejection or conflict
- Guilt about saying no
- Belief that others' needs come first
- Not knowing what you need

## How to Set Boundaries

### The DEAR MAN Technique

- **D**escribe the situation factually
- **E**xpress your feelings using "I" statements
- **A**ssert what you need clearly
- **R**einforce the positive outcome

Example:
"When meetings run past 6pm (describe), I feel stressed because I can't maintain my evening routine (express). I need us to respect the scheduled end time (assert). This will help me be more productive during meetings (reinforce)."

## Boundary Scripts

- "I appreciate you thinking of me, but I can't commit to that right now."
- "I need some time to think about it before I give you an answer."
- "I love spending time with you, and I also need time for myself."

> "Daring to set boundaries is about having the courage to love ourselves." — Brené Brown`,
      },
      {
        id: 4,
        title: "Building Lasting Confidence",
        readingTime: 5,
        content: `# Building Lasting Confidence

True confidence isn't about being perfect — it's about trusting yourself to handle whatever comes.

## The Confidence Equation

**Confidence = Competence + Self-Acceptance**

You build it by:
1. Trying new things (building competence)
2. Being kind to yourself when you fail (self-acceptance)

## The Growth Challenge

Each week, do ONE thing outside your comfort zone:
- Week 1: Start a conversation with someone new
- Week 2: Share an opinion in a group setting
- Week 3: Try a new skill or hobby
- Week 4: Ask for what you need

## Confidence Journal

Each evening, write:
1. **One thing I did well today**: ___
2. **One challenge I faced**: ___
3. **How I handled it**: ___
4. **What I learned**: ___

## The Power Pose

Research shows that expansive body language affects your psychology:
- Stand tall with shoulders back
- Take up space
- Make eye contact
- Speak slowly and clearly

## Your Self-Esteem Action Plan

1. Practice one self-compassion exercise daily
2. Set one boundary this week
3. Complete one growth challenge this week
4. Write in your confidence journal each night
5. Replace three negative self-talk patterns

> "Believe you can and you're halfway there." — Theodore Roosevelt`,
      },
    ],
  },
  {
    id: "mindfulness-meditation",
    title: "The Mindfulness Handbook",
    author: "MindfulMe Wellness Team",
    description: "A beginner-friendly guide to mindfulness meditation and its mental health benefits.",
    category: "Mindfulness",
    coverEmoji: "🧘",
    totalChapters: 4,
    tags: ["mindfulness", "meditation", "present moment", "peace"],
    chapters: [
      {
        id: 1,
        title: "What is Mindfulness?",
        readingTime: 5,
        content: `# What is Mindfulness?

Mindfulness is the practice of paying attention to the present moment, without judgment. It's about observing your thoughts and feelings without getting caught up in them.

## The Mindfulness Definition

> "Mindfulness means paying attention in a particular way: on purpose, in the present moment, and non-judgmentally." — Jon Kabat-Zinn

## Why Mindfulness Matters

Research shows mindfulness can:
- **Reduce stress** by 30-40%
- **Decrease anxiety** and depression symptoms
- **Improve focus** and concentration
- **Enhance emotional regulation**
- **Boost immune function**
- **Improve sleep** quality

## Mindfulness vs. Meditation

- **Mindfulness** is a quality of awareness you can bring to any activity
- **Meditation** is a formal practice for developing mindfulness

You can be mindful while:
- Eating (tasting each bite)
- Walking (feeling each step)
- Listening (giving full attention)
- Breathing (noticing each breath)

## Common Misconceptions

❌ "I have to clear my mind" → ✅ You observe thoughts without engaging
❌ "I need to sit for hours" → ✅ Even 2 minutes helps
❌ "I'm bad at it if my mind wanders" → ✅ Noticing your mind wandered IS mindfulness
❌ "It's religious" → ✅ It's a science-backed mental skill

> "The present moment is the only moment available to us, and it is the door to all moments." — Thich Nhat Hanh`,
      },
      {
        id: 2,
        title: "Your First Meditation",
        readingTime: 6,
        content: `# Your First Meditation

Let's start with a simple, guided practice. No experience needed.

## Setting Up

1. Find a quiet spot where you won't be disturbed
2. Sit comfortably — chair, cushion, or bed
3. Set a timer for **5 minutes**
4. Close your eyes or soften your gaze

## The Basic Breath Meditation

Follow these steps:

### Minutes 1-2: Arriving
- Take three deep breaths
- Feel the surface supporting you
- Let your body settle

### Minutes 2-4: Observing
- Breathe naturally
- Focus on the sensation of breathing
- Notice where you feel the breath most (nose, chest, belly)
- When your mind wanders (it will!), gently return to the breath

### Minute 5: Closing
- Widen your awareness to the whole body
- Notice any sounds around you
- Slowly open your eyes
- Take a moment before moving

## The "Noting" Technique

When thoughts arise during meditation, simply label them:
- Planning → "thinking"
- Remembering → "thinking"
- Worrying → "thinking"
- Physical sensation → "feeling"
- Sound → "hearing"

Then gently return to the breath.

## Building Your Practice

| Week | Duration | Frequency |
|------|----------|-----------|
| 1 | 2 minutes | 3 times/week |
| 2 | 5 minutes | 4 times/week |
| 3 | 10 minutes | 5 times/week |
| 4+ | 10-20 minutes | Daily |

> "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts." — Arianna Huffington`,
      },
      {
        id: 3,
        title: "Mindfulness in Daily Life",
        readingTime: 5,
        content: `# Mindfulness in Daily Life

You don't need a meditation cushion to practice mindfulness. Here's how to bring it into everyday activities.

## Mindful Morning Routine

Instead of reaching for your phone:
1. **Notice** your first breath of the day
2. **Feel** the sensation of your feet on the floor
3. **Listen** to the sounds around you
4. **Taste** your morning drink fully
5. **See** the light and colors around you

## Mindful Eating

Turn one meal a day into a mindfulness practice:
- Look at your food — notice colors, textures
- Smell it before eating
- Take small bites
- Chew slowly (20-30 times)
- Put down your utensils between bites
- Notice flavors changing as you chew

## The STOP Technique

Use throughout the day:
- **S**top what you're doing
- **T**ake a breath
- **O**bserve your experience (thoughts, feelings, body)
- **P**roceed with awareness

## Mindful Walking

Turn any walk into meditation:
- Feel each foot making contact with the ground
- Notice the rhythm of your steps
- Feel the air on your skin
- Observe your surroundings without labeling

## Mindful Listening

In conversations:
- Give your full attention
- Notice when your mind starts preparing a response
- Listen to understand, not to reply
- Notice the other person's tone and body language

> "Wherever you are, be there totally." — Eckhart Tolle`,
      },
      {
        id: 4,
        title: "Advanced Practices",
        readingTime: 6,
        content: `# Advanced Practices

Once you're comfortable with basic mindfulness, explore these deeper practices.

## Body Scan Meditation (15-20 minutes)

1. Lie down comfortably
2. Starting at your toes, bring awareness to each body part
3. Notice sensations without changing them — tingling, warmth, tension, numbness
4. Spend about 1 minute on each area
5. Move slowly up: feet → legs → hips → abdomen → chest → hands → arms → shoulders → neck → face → top of head
6. End by feeling your whole body as one

## Loving-Kindness Meditation

Send compassion to yourself and others:

1. **To yourself**: "May I be happy. May I be healthy. May I be safe. May I live with ease."
2. **To a loved one**: "May you be happy. May you be healthy..."
3. **To a neutral person**: Same phrases
4. **To a difficult person**: Same phrases
5. **To all beings**: "May all beings be happy..."

## Mindful Journaling Prompts

- What am I feeling right now, without judgment?
- What am I grateful for in this moment?
- What would I say to a friend going through what I'm experiencing?
- What can I let go of today?

## Building a Sustainable Practice

- **Same time, same place** — Build a routine
- **Start small** — Consistency beats duration
- **Be gentle** — No "perfect" meditation exists
- **Track progress** — Use this app's journal feature!
- **Join a community** — Practice with others

> "In the end, just three things matter: How well we have lived. How well we have loved. How well we have learned to let go." — Jack Kornfield`,
      },
    ],
  },
  {
    id: "healthy-relationships",
    title: "Nurturing Healthy Relationships",
    author: "MindfulMe Wellness Team",
    description: "Learn to build, maintain, and heal relationships for better mental well-being.",
    category: "Relationships",
    coverEmoji: "💝",
    totalChapters: 3,
    tags: ["relationships", "communication", "boundaries", "healing"],
    chapters: [
      {
        id: 1,
        title: "The Foundation of Healthy Relationships",
        readingTime: 6,
        content: `# The Foundation of Healthy Relationships

Our relationships profoundly affect our mental health. Learning to nurture healthy connections is essential for well-being.

## The Five Pillars

### 1. Trust
- Keeping promises
- Being reliable and consistent
- Being honest, even when it's hard
- Giving the benefit of the doubt

### 2. Communication
- Expressing needs clearly
- Listening actively
- Addressing issues directly
- Using "I" statements instead of blame

### 3. Respect
- Valuing each other's opinions
- Supporting individual goals
- Accepting differences
- Never belittling or demeaning

### 4. Boundaries
- Knowing your limits
- Communicating them clearly
- Respecting others' boundaries
- Adjusting when needed

### 5. Reciprocity
- Equal give and take
- Both people investing effort
- Shared responsibility
- Mutual support

## Red Flags to Watch For

⚠️ Controlling behavior
⚠️ Constant criticism
⚠️ Dismissing your feelings
⚠️ Isolating you from others
⚠️ Gaslighting (making you doubt reality)
⚠️ Physical, emotional, or verbal abuse

> "The quality of your life is the quality of your relationships." — Tony Robbins`,
      },
      {
        id: 2,
        title: "Communication Skills",
        readingTime: 5,
        content: `# Communication Skills

Most relationship problems stem from poor communication. These skills can transform your connections.

## Active Listening

- Make eye contact
- Put away distractions
- Reflect back what you heard: "So what you're saying is..."
- Ask clarifying questions
- Validate emotions: "That makes sense that you'd feel that way"

## The "I" Statement Formula

Instead of: "You never listen to me!"
Try: "I feel unheard when I'm talking and you're on your phone. I need your full attention during our conversations."

Formula: **"I feel [emotion] when [behavior]. I need [request]."**

## Handling Conflict

### The Cool-Down Rule
If emotions are high, take a 20-minute break. Say: "I care about this conversation. Can we pause and come back to it in 20 minutes?"

### The Repair Attempt
After conflict, try:
- "I'm sorry I raised my voice"
- "Can we start over?"
- "I want to understand your perspective"
- "What do you need from me right now?"

## Non-Verbal Communication

Your body says more than words:
- Open posture (uncrossed arms)
- Appropriate eye contact
- Nodding to show understanding
- Matching their energy level
- Physical touch when appropriate

> "The single biggest problem in communication is the illusion that it has taken place." — George Bernard Shaw`,
      },
      {
        id: 3,
        title: "Healing from Relationship Pain",
        readingTime: 6,
        content: `# Healing from Relationship Pain

Whether it's a breakup, betrayal, or toxic relationship, healing is possible.

## The Stages of Relationship Grief

1. **Denial**: "This isn't really happening"
2. **Anger**: "How could they do this to me?"
3. **Bargaining**: "If only I had done things differently"
4. **Depression**: "I'll never be happy again"
5. **Acceptance**: "This happened, and I'm going to be okay"

These stages aren't linear — you may revisit them multiple times.

## Healing Practices

### Journaling Prompts
- What did this relationship teach me?
- What do I want in future relationships?
- What boundaries will I set going forward?
- What am I grateful for about myself?

### The Letter You Never Send
Write a letter to the person who hurt you. Express everything. Then, instead of sending it, burn it or tear it up as a symbolic release.

### Rebuilding Your Identity
After a significant relationship ends:
- Reconnect with hobbies you abandoned
- Spend time with friends and family
- Try something completely new
- Rediscover what makes YOU happy

## Setting Standards for Future Relationships

Write your non-negotiables:
- "I deserve someone who respects my boundaries"
- "I will not tolerate verbal abuse"
- "I need a partner who communicates openly"
- "I choose relationships that feel safe"

## When to Seek Help

Consider therapy if:
- You're stuck in a cycle of unhealthy relationships
- Past trauma affects current relationships
- You struggle with trust or attachment
- Grief from a loss feels overwhelming

> "The only person you are destined to become is the person you decide to be." — Ralph Waldo Emerson`,
      },
    ],
  },
  {
    id: "resilience-guide",
    title: "Bouncing Back: The Resilience Guide",
    author: "MindfulMe Wellness Team",
    description: "Develop mental toughness and the ability to recover from life's challenges.",
    category: "Resilience",
    coverEmoji: "🌱",
    totalChapters: 3,
    tags: ["resilience", "mental toughness", "adversity", "growth"],
    chapters: [
      {
        id: 1,
        title: "What Makes People Resilient?",
        readingTime: 5,
        content: `# What Makes People Resilient?

Resilience is not a trait you're born with — it's a skill you can develop.

## Defining Resilience

Resilience is the ability to **adapt and recover** from adversity, trauma, or significant stress. It doesn't mean you don't experience difficulty — it means you find ways to move forward.

## The Resilience Factors

Research identifies key characteristics of resilient people:

### 1. Optimistic Realism
- Acknowledging reality while maintaining hope
- "This is hard AND I can get through it"
- Finding meaning in difficult experiences

### 2. Emotional Awareness
- Recognizing and naming emotions
- Allowing yourself to feel without being overwhelmed
- Knowing when to seek support

### 3. Internal Locus of Control
- Believing you can influence outcomes
- Focusing on what you CAN control
- Taking action rather than feeling helpless

### 4. Strong Connections
- Having at least one trusted person
- Being willing to ask for help
- Maintaining relationships during hard times

### 5. Purpose and Meaning
- Having goals and values that guide you
- Connecting challenges to personal growth
- Finding purpose even in suffering

## The Post-Traumatic Growth Model

Some people don't just recover — they grow stronger:
- Greater appreciation for life
- Stronger relationships
- New possibilities and priorities
- Increased personal strength
- Spiritual or existential growth

> "The oak fought the wind and was broken, the willow bent when it must and survived." — Robert Jordan`,
      },
      {
        id: 2,
        title: "Building Your Resilience Toolkit",
        readingTime: 6,
        content: `# Building Your Resilience Toolkit

Practical strategies you can use when life gets tough.

## The RAIN Technique

When facing difficult emotions:
- **R**ecognize what's happening
- **A**llow it to be there
- **I**nvestigate with kindness
- **N**on-identification (this feeling is not all of me)

## Reframing Challenges

Transform how you see adversity:

| Challenge View | Growth View |
|---------------|-------------|
| "Why is this happening to me?" | "What can I learn from this?" |
| "I can't handle this" | "I've handled hard things before" |
| "This will never end" | "This is temporary" |
| "Everything is ruined" | "Some things are still good" |

## The Stress Inoculation Method

Build resilience gradually:
1. **Start small**: Handle minor stressors intentionally
2. **Reflect**: What coping strategies worked?
3. **Increase challenge**: Face slightly bigger stressors
4. **Build confidence**: Each success makes you stronger

## Creating a Resilience Routine

### Daily
- Gratitude practice (3 things)
- Physical movement (20+ minutes)
- Connection (one meaningful interaction)

### Weekly
- Reflect on challenges overcome
- Practice something outside your comfort zone
- Engage in a restorative activity

### Monthly
- Review your goals and progress
- Assess your support network
- Adjust your self-care plan

> "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change." — Charles Darwin`,
      },
      {
        id: 3,
        title: "Resilience in Action",
        readingTime: 5,
        content: `# Resilience in Action

Real-world applications of resilience principles.

## Academic Resilience

For students facing pressure:
- **Break large tasks** into small, manageable steps
- **Normalize struggle** — difficulty means you're learning
- **Seek help early** — don't wait until crisis
- **Balance** study with rest and social time
- **Celebrate progress**, not just results

## Workplace Resilience

For professional challenges:
- Focus on what you can control
- Build positive relationships with colleagues
- Take breaks to prevent burnout
- View setbacks as data, not failures
- Maintain boundaries between work and personal life

## Relationship Resilience

When relationships are tested:
- Communicate openly about needs
- Practice empathy during disagreements
- Repair after conflicts
- Maintain individual identities
- Seek couples counseling when needed

## Your Personal Resilience Plan

Write down:

### My Strengths
What has helped me get through hard times before?
1. ___
2. ___
3. ___

### My Support Network
Who can I turn to when things get tough?
1. ___
2. ___

### My Coping Strategies (Healthy Ones)
1. ___
2. ___
3. ___

### My Values (What Guides Me)
1. ___
2. ___

### My Commitment
"When I face adversity, I will ___"

## Remember

Resilience is not about being unbreakable. It's about being able to **bend without breaking** and **grow through what you go through**.

> "You may not control all the events that happen to you, but you can decide not to be reduced by them." — Maya Angelou`,
      },
    ],
  },
];

// Import and merge additional books
import { additionalBooks } from "./newBooks";
mentalHealthBooks.push(...additionalBooks);
