# **App Name**: VoteWise

## Core Features:

- User Onboarding & Context Collection: Initial guided questionnaire to gather user location, age, and voter status to personalize the experience.
- Personalized Voting Roadmap: A generative AI tool that constructs a step-by-step, actionable voting roadmap tailored to the user's specific context.
- Real-time Election Information Display: Presents dynamic election timelines, critical deadlines, polling place details, and relevant local candidates.
- ELI15 Civic Explainer: A generative AI tool that simplifies complex civic concepts into easily understandable explanations, adapting to the user's comprehension level.
- Misinformation Detection Tool: Utilizes generative AI to verify information provided by the user against trusted sources and highlight potential misinformation.
- Document Readiness Checklist: Provides a personalized checklist and guidance on necessary documents for successful voter registration and voting.
- Manifesto Summary Tool: A generative AI tool that decodes political manifestos into neutral, concise summaries to aid user understanding.

## Style Guidelines:

- Primary color: A deep blue (#336699) used for navigation, headers, and key actions to communicate trust and structure.
- Background color: A very light, desaturated blue-gray (#EFF1F2) for the full app canvas, ensuring a breathable and distraction-free UI.
- Accent color: A vibrant violet (#4D33CC) used sparingly for CTA buttons, active steps, and progress highlights.
- Supporting soft blue tint: #E6EEF7 for cards and hover states.
- Success green: #2EAD7B for verified or completed states.
- Warning amber: #F4A261 for deadlines approaching or cautionary information.
- Error red: #E63946 for invalid information or critical alerts.
- Deadline Cards: Subtly use urgency colors (amber) without being aggressive.
- Verification Badges: Use green for 'Verified Info', amber for 'Needs Action', and red for 'Incomplete'.
- Headlines font: 'Space Grotesk', bold with slightly tight spacing, used for section titles and step headings.
- Body font: 'Inter', clean and highly readable, used for instructions and explanations.
- Typography hierarchy: H1 (28–32px) for main steps, H2 (22–24px) for sections, Body (16px), and Caption (13–14px) for helper text.
- Accessibility: High contrast text.
- Accessibility: Minimum 16px font size for readability.
- Icon style: Outline icons with a 2px stroke and rounded edges, maintaining a friendly but serious tone.
- Consistent icon sizing: Use a consistent size grid (24px / 32px).
- Key icons to include: Location, Documents, Timeline, Verification, and Voting symbols.
- Verification Badges: Icons for 'Verified Info', 'Needs Action', and 'Incomplete' will be used in conjunction with colors.
- Modular, card-based layout with generous whitespace to present information in easily digestible chunks.
- Layout principle: Each step equals one card and one action, ensuring no clutter and clear CTAs are always visible.
- Bottom Navigation (Mobile-first): Featuring Home, My Journey, Learn, and Profile icons for key navigation.
- Top Bar: Includes a prominent progress indicator and maintains a minimal, clutter-free design.
- Progress Timeline: A vertical stepper structure to visually guide users through their journey.
- Deadline Cards: Structured to clearly display critical dates and include actionable elements like 'Add to Calendar'.
- Mock Voting UI: Clean, realistic, and features large tap targets for ease of use.
- Accessibility: Large buttons for elderly users to improve interaction.
- Subtle, functional animations that enhance clarity and indicate progress without causing distraction.
- Step transitions: Implement smooth slide and fade animations between steps.
- Progress updates: Use smooth fill animations for progress indicators.
- Button clicks: Apply a soft scale (98%) animation for tactile feedback.
- Success indicators: Quick checkmark animations for completed actions.
- Progress Timeline: Animated transitions for steps, with the current step glowing with the accent violet.
- Explain Mode Toggle: Smooth transition animation between 'Simple' and 'Detailed' modes.
- Mock Voting UI: Confirmation animation, such as 'Vote Recorded ✔'.