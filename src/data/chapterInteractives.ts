import type { InteractiveElement } from "./mentalHealthBooks";

// Map of book-id → chapter-id → interactives
export const chapterInteractives: Record<string, Record<number, InteractiveElement[]>> = {
  // ─── Understanding & Overcoming Anxiety ───
  "understanding-anxiety": {
    1: [
      {
        type: "quiz",
        question: "Which part of the brain activates the 'fight-or-flight' response during anxiety?",
        options: [
          { text: "Prefrontal cortex" },
          { text: "Amygdala", correct: true },
          { text: "Hippocampus" },
          { text: "Cerebellum" },
        ],
        explanation: "The amygdala is the brain's alarm system that triggers the fight-or-flight response when it perceives a threat.",
      },
      {
        type: "reflection",
        prompt: "Think about the last time you felt anxious. What physical sensations did you notice in your body?",
        placeholder: "Describe the physical feelings — racing heart, tight chest, sweaty palms...",
      },
    ],
    2: [
      {
        type: "checkpoint",
        title: "Trigger Awareness Checkpoint",
        checklist: [
          "I can identify at least 3 external triggers",
          "I can identify at least 2 internal triggers (negative self-talk patterns)",
          "I have started or plan to start a trigger journal",
          "I can recognize time, people, or situation patterns in my anxiety",
        ],
      },
    ],
    3: [
      {
        type: "quiz",
        question: "In the 4-7-8 breathing technique, how long should you hold your breath?",
        options: [
          { text: "4 seconds" },
          { text: "5 seconds" },
          { text: "7 seconds", correct: true },
          { text: "8 seconds" },
        ],
        explanation: "In the 4-7-8 technique: breathe in for 4s, hold for 7s, exhale for 8s. The extended hold activates your parasympathetic nervous system.",
      },
      {
        type: "checkpoint",
        title: "Techniques Practice Checkpoint",
        checklist: [
          "I practiced the 4-7-8 breathing technique at least once",
          "I tried the 5-4-3-2-1 grounding method",
          "I attempted box breathing",
          "I tried progressive muscle relaxation",
        ],
      },
    ],
    4: [
      {
        type: "quiz",
        question: "What does 'catastrophizing' mean as a cognitive distortion?",
        options: [
          { text: "Assuming you know what others think" },
          { text: "Seeing things as all good or all bad" },
          { text: "Imagining the worst possible outcome", correct: true },
          { text: "Predicting the future negatively" },
        ],
        explanation: "Catastrophizing is assuming the worst-case scenario will happen. A balanced thought recognizes that mistakes are rarely as catastrophic as imagined.",
      },
      {
        type: "reflection",
        prompt: "Write down a recent anxious thought. Now challenge it: What evidence supports it? What evidence contradicts it? What's a more balanced perspective?",
        placeholder: "My anxious thought was... The evidence for it... Against it... A balanced view...",
      },
    ],
    5: [
      {
        type: "checkpoint",
        title: "Your Anxiety Action Plan",
        checklist: [
          "I have identified my top 3 anxiety triggers",
          "I have a go-to breathing technique I can use anytime",
          "I know how to challenge anxious thoughts using CBT",
          "I have at least one support person I can reach out to",
          "I have daily wellness habits in place (sleep, exercise, nutrition)",
          "I know when to seek professional help",
        ],
      },
      {
        type: "reflection",
        prompt: "What is the single most important insight you've gained about managing your anxiety from this book?",
      },
    ],
  },

  // ─── Depression ───
  "defeating-depression": {
    1: [
      {
        type: "quiz",
        question: "Which neurotransmitter primarily regulates mood, sleep, and appetite?",
        options: [
          { text: "Dopamine" },
          { text: "Serotonin", correct: true },
          { text: "Norepinephrine" },
          { text: "GABA" },
        ],
        explanation: "Serotonin is a key neurotransmitter that regulates mood, sleep, and appetite. Imbalances are strongly linked to depression.",
      },
      {
        type: "reflection",
        prompt: "How would you explain the difference between sadness and depression to someone who doesn't understand?",
      },
    ],
    2: [
      {
        type: "checkpoint",
        title: "Small Steps Challenge",
        checklist: [
          "I tried the 5-minute rule on a task I've been avoiding",
          "I planned at least one pleasant activity for today",
          "I rated an activity on the Mastery & Pleasure scales",
          "I replaced one self-critical thought with a compassionate one",
        ],
      },
    ],
    3: [
      {
        type: "reflection",
        prompt: "Who are the people in your life you could reach out to for support? Write down at least one name and how you might ask them for help.",
        placeholder: "I could reach out to... I might say something like...",
      },
    ],
    4: [
      {
        type: "checkpoint",
        title: "Recovery Plan Complete",
        checklist: [
          "I have a morning routine with at least 3 items",
          "I have a 'bad day' action plan written down",
          "I know my personal warning signs",
          "I have emergency contacts listed",
          "I've started tracking my daily progress",
        ],
      },
      {
        type: "quiz",
        question: "What is 'behavioral activation' in the context of depression?",
        options: [
          { text: "Taking medication to feel energized" },
          { text: "Forcing yourself to exercise intensely" },
          { text: "Scheduling small pleasant activities to break the inactivity cycle", correct: true },
          { text: "Activating emergency support systems" },
        ],
        explanation: "Behavioral activation breaks the depression cycle (feel bad → do less → feel worse) by scheduling small, manageable pleasant activities.",
      },
    ],
  },

  // ─── Self-Esteem ───
  "building-self-esteem": {
    1: [
      {
        type: "reflection",
        prompt: "Write down three things you genuinely appreciate about yourself. They can be qualities, skills, or things you've overcome.",
        placeholder: "1. I appreciate that I... 2. I'm good at... 3. I've overcome...",
      },
    ],
    2: [
      {
        type: "quiz",
        question: "What is the most effective way to silence your inner critic?",
        options: [
          { text: "Ignore all negative thoughts completely" },
          { text: "Challenge the thought with evidence and replace with balanced thinking", correct: true },
          { text: "Think only positive thoughts at all times" },
          { text: "Avoid situations that trigger self-doubt" },
        ],
        explanation: "Rather than ignoring or suppressing, the most effective approach is to notice the critical thought, challenge its accuracy, and replace it with a more balanced, compassionate perspective.",
      },
    ],
    3: [
      {
        type: "checkpoint",
        title: "Boundary Setting Skills",
        checklist: [
          "I can identify at least one area where I need better boundaries",
          "I have practiced saying 'no' to a small request",
          "I understand that boundaries protect relationships, not harm them",
          "I have a boundary script I feel comfortable using",
        ],
      },
    ],
    4: [
      {
        type: "reflection",
        prompt: "Imagine your best friend described you to someone else. What positive things would they say? Write it from their perspective.",
        placeholder: "My friend would probably say that I am...",
      },
      {
        type: "checkpoint",
        title: "Self-Esteem Growth Milestones",
        checklist: [
          "I can name my core values and strengths",
          "I catch my inner critic and can reframe the thought",
          "I have set at least one healthy boundary",
          "I celebrate small wins regularly",
          "I treat myself with the same kindness I'd give a friend",
        ],
      },
    ],
  },

  // ─── Mindfulness ───
  "mindfulness-meditation": {
    1: [
      {
        type: "quiz",
        question: "What is the core principle of mindfulness?",
        options: [
          { text: "Clearing your mind of all thoughts" },
          { text: "Paying attention to the present moment without judgment", correct: true },
          { text: "Achieving a state of deep relaxation" },
          { text: "Controlling your emotions completely" },
        ],
        explanation: "Mindfulness is about present-moment awareness without judgment — not about emptying your mind or controlling your experience.",
      },
    ],
    2: [
      {
        type: "checkpoint",
        title: "First Meditation Milestones",
        checklist: [
          "I completed at least one 5-minute breathing meditation",
          "I noticed when my mind wandered and gently brought it back",
          "I practiced without judging myself for getting distracted",
          "I tried meditating at the same time of day for consistency",
        ],
      },
    ],
    3: [
      {
        type: "reflection",
        prompt: "Choose one routine activity (eating, walking, brushing teeth) and do it mindfully today. What did you notice that you usually miss?",
        placeholder: "I chose to do... mindfully. I noticed that...",
      },
    ],
    4: [
      {
        type: "quiz",
        question: "What is a 'body scan' meditation?",
        options: [
          { text: "Scanning your body for medical issues" },
          { text: "Systematically bringing awareness to each part of your body", correct: true },
          { text: "A type of exercise routine" },
          { text: "Tensing all muscles at once" },
        ],
        explanation: "A body scan involves slowly moving your attention through each part of your body, noticing sensations without trying to change them.",
      },
      {
        type: "checkpoint",
        title: "Mindfulness Journey Progress",
        checklist: [
          "I meditated for at least 5 minutes on 3 different days",
          "I tried a body scan meditation",
          "I practiced mindful eating at least once",
          "I used mindfulness to manage a stressful moment",
          "I can describe what mindfulness means in my own words",
        ],
      },
    ],
  },

  // ─── PTSD & Trauma ───
  "healing-from-ptsd": {
    1: [
      {
        type: "quiz",
        question: "According to the chapter, what makes PTSD different from a normal stress response?",
        options: [
          { text: "PTSD only affects military veterans" },
          { text: "The brain's stress response gets 'stuck' in the on position", correct: true },
          { text: "PTSD means you are emotionally weak" },
          { text: "PTSD always appears immediately after the event" },
        ],
        explanation: "PTSD develops when the normal stress response gets stuck — your brain continues reacting as if danger is still present, even when you're safe.",
      },
      {
        type: "reflection",
        prompt: "Maya's story shows how PTSD can affect daily life. Without sharing anything you're not comfortable with, how has stress or difficult experiences changed your daily routines?",
      },
    ],
    2: [
      {
        type: "quiz",
        question: "Which brain area becomes hyperactive in PTSD, sounding false alarms even when you're safe?",
        options: [
          { text: "Hippocampus" },
          { text: "Prefrontal cortex" },
          { text: "Amygdala", correct: true },
          { text: "Cerebellum" },
        ],
        explanation: "The amygdala (the brain's alarm system) becomes hyperactive in PTSD, triggering fight/flight/freeze responses even in safe situations.",
      },
    ],
    3: [
      {
        type: "checkpoint",
        title: "Treatment Knowledge Check",
        checklist: [
          "I understand what CPT (Cognitive Processing Therapy) involves",
          "I can explain how EMDR works in simple terms",
          "I know the difference between talk therapy and somatic approaches",
          "I have thought about which treatment approach might suit me",
        ],
      },
    ],
    4: [
      {
        type: "checkpoint",
        title: "Coping Toolkit Ready",
        checklist: [
          "I have practiced the container exercise",
          "I know at least 2 grounding techniques for when I'm triggered",
          "I have created a personal trigger plan like Kenji's",
          "I have a safe place visualization I can access",
          "I have adjusted my sleep environment for safety",
        ],
      },
    ],
    5: [
      {
        type: "reflection",
        prompt: "Amara's story shows that growth can exist alongside pain. Without minimizing any difficult experience, what strengths have you discovered in yourself through adversity?",
        placeholder: "Through difficult times, I've discovered that I...",
      },
    ],
  },

  // ─── Addiction Recovery ───
  "addiction-recovery-guide": {
    1: [
      {
        type: "quiz",
        question: "Why does tolerance develop with addictive substances?",
        options: [
          { text: "Your body becomes immune to the substance" },
          { text: "Your brain reduces its own dopamine production in response to the flood", correct: true },
          { text: "The substance becomes less potent over time" },
          { text: "Your liver processes it faster" },
        ],
        explanation: "Addictive substances flood the brain with dopamine. In response, the brain reduces its own dopamine production, so you need more of the substance to feel the same effect.",
      },
      {
        type: "reflection",
        prompt: "Rahul said addiction 'lies to you in your own voice.' Have you noticed patterns where your mind rationalizes unhealthy behaviors?",
      },
    ],
    2: [
      {
        type: "quiz",
        question: "How many attempts does it typically take before sustained recovery from addiction?",
        options: [
          { text: "1-2 attempts" },
          { text: "3-4 attempts" },
          { text: "7-8 attempts", correct: true },
          { text: "It should only take one try" },
        ],
        explanation: "Research shows the average is 7-8 attempts before sustained recovery. Each attempt builds recovery muscles — relapse is data, not failure.",
      },
      {
        type: "reflection",
        prompt: "Which stage of change (pre-contemplation, contemplation, preparation, action, maintenance) do you think you or someone you care about is in? What would help move to the next stage?",
      },
    ],
    3: [
      {
        type: "checkpoint",
        title: "Recovery Toolkit Assembled",
        checklist: [
          "I understand the HALT method (Hungry, Angry, Lonely, Tired)",
          "I have tried urge surfing at least once",
          "I know the 5-minute delay technique",
          "I have identified my personal triggers",
          "I have at least one support network option (12-step, SMART, therapy)",
        ],
      },
    ],
    5: [
      {
        type: "checkpoint",
        title: "Sustained Recovery Foundations",
        checklist: [
          "I understand addiction as a brain condition, not a moral failing",
          "I can identify my personal triggers and have coping strategies",
          "I have a support network or know how to build one",
          "I have addressed or am addressing underlying mental health needs",
          "I celebrate my progress, no matter how small",
          "I know that setbacks are part of recovery, not the end of it",
        ],
      },
      {
        type: "reflection",
        prompt: "If you could write a letter to yourself on your hardest day, what words of encouragement would you give?",
        placeholder: "Dear me, on your hardest day remember that...",
      },
    ],
  },

  // ─── Sleep Recovery ───
  "sleep-recovery-guide": {
    1: [
      {
        type: "quiz",
        question: "How much sleep do most adults need for optimal health?",
        options: [
          { text: "4-5 hours" },
          { text: "6 hours" },
          { text: "7-9 hours", correct: true },
          { text: "10+ hours" },
        ],
        explanation: "Most adults need 7-9 hours of quality sleep. Consistently getting less is linked to increased health risks, impaired cognition, and mood disorders.",
      },
    ],
    2: [
      {
        type: "checkpoint",
        title: "Sleep Environment Audit",
        checklist: [
          "My bedroom is dark enough (or I have blackout curtains/eye mask)",
          "My bedroom temperature is cool (65-68°F / 18-20°C)",
          "I have removed or silenced electronics from my sleep area",
          "My mattress and pillows are comfortable",
          "I have a consistent bedtime within a 30-minute window",
        ],
      },
    ],
    3: [
      {
        type: "reflection",
        prompt: "Track your bedtime routine tonight. What did you do in the last hour before sleep? Which activities helped you wind down and which kept you alert?",
        placeholder: "Tonight before bed I... The helpful activities were... The unhelpful ones were...",
      },
    ],
    4: [
      {
        type: "quiz",
        question: "What is 'sleep restriction therapy'?",
        options: [
          { text: "Sleeping as little as possible" },
          { text: "Limiting time in bed to match actual sleep time to rebuild sleep drive", correct: true },
          { text: "Restricting naps only" },
          { text: "Taking sleep medication at restricted doses" },
        ],
        explanation: "Sleep restriction therapy temporarily limits time in bed to match actual sleep time. This builds sleep pressure and strengthens the association between bed and sleep.",
      },
    ],
    5: [
      {
        type: "checkpoint",
        title: "Sleep Recovery Milestones",
        checklist: [
          "I have a consistent wake-up time (even on weekends)",
          "I avoid screens for at least 30 minutes before bed",
          "I have a calming bedtime routine",
          "I use my bed only for sleep (not work or scrolling)",
          "I know at least 2 relaxation techniques for bedtime",
          "I've kept a sleep diary for at least 3 days",
        ],
      },
      {
        type: "reflection",
        prompt: "After reading this guide, what is the single biggest change you want to make to improve your sleep?",
      },
    ],
  },

  // ─── Relationships ───
  "healthy-relationships": {
    1: [
      {
        type: "reflection",
        prompt: "Think about a relationship (any kind) that you value deeply. What makes it healthy? What could be improved?",
      },
    ],
    2: [
      {
        type: "quiz",
        question: "Which communication approach is most effective during conflict?",
        options: [
          { text: "Using 'you' statements to point out the other person's flaws" },
          { text: "Avoiding the conflict entirely to keep the peace" },
          { text: "Using 'I' statements to express your feelings without blame", correct: true },
          { text: "Winning the argument to establish your position" },
        ],
        explanation: "'I' statements (e.g., 'I feel hurt when...') express your feelings without blaming the other person, making them less defensive and more open to understanding.",
      },
    ],
    3: [
      {
        type: "checkpoint",
        title: "Relationship Health Check",
        checklist: [
          "I can identify healthy vs unhealthy patterns in my relationships",
          "I practice active listening (reflecting, not interrupting)",
          "I use 'I' statements instead of 'you' statements in conflicts",
          "I have reflected on any relationship wounds that need healing",
        ],
      },
    ],
  },

  // ─── Resilience ───
  "resilience-guide": {
    1: [
      {
        type: "quiz",
        question: "What is resilience?",
        options: [
          { text: "Never experiencing hardship or failure" },
          { text: "The ability to bounce back and adapt from adversity", correct: true },
          { text: "Being emotionally numb to challenges" },
          { text: "Always staying positive regardless of circumstances" },
        ],
        explanation: "Resilience isn't about avoiding difficulty — it's the ability to adapt, recover, and even grow from challenges and setbacks.",
      },
    ],
    2: [
      {
        type: "checkpoint",
        title: "Resilience Toolkit Progress",
        checklist: [
          "I can name my top 3 character strengths",
          "I have at least one growth mindset strategy I use regularly",
          "I practice self-compassion when things go wrong",
          "I have a support network I can lean on",
        ],
      },
    ],
    3: [
      {
        type: "reflection",
        prompt: "Think of a setback you've experienced. What did it teach you? How did it shape who you are today?",
        placeholder: "A setback I experienced was... It taught me... It shaped me by...",
      },
      {
        type: "checkpoint",
        title: "Resilience Journey Complete",
        checklist: [
          "I understand that resilience is a skill, not a trait",
          "I have tools for coping with setbacks",
          "I can reframe challenges as growth opportunities",
          "I practice gratitude or positive reflection regularly",
          "I ask for help when I need it",
        ],
      },
    ],
  },
};
