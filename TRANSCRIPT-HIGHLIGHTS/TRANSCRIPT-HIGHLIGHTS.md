### 1. Planning the project structure and scope (transcript lines 14 - 101)
Before building any UI, I asked Claude to help plan the architecture of the budgeting app, including pages, components, and where application state should live because it helped me ensure the project stayed within the expected scope for a midterm assignment.

### 2. Iteratively building the transaction form with controlled state (transcript lines 395 - 460)
Guiding Claude step-by-step to implement controlled inputs, validation, and transaction state management rather than asking it to generate the full feature at once. This shows intentional prompt design and helped me better understand how React state drives user interactions (unlike last time lol).

### 3. Implementing localStorage persistence safely in Next.js (transcript lines 758 - 830)
When adding persistence, I asked for a minor implementation that would load saved data on first render and sync automatically when transactions changed. This shows my understanding of client-side data storage and how to avoid server-side rendering issues.

### 4. Debugging and improving usability through styling adjustments (transcript lines 669 - 705)
After testing the transaction form, I noticed that typed input text was difficult to read and asked Claude to refine the styling without changing business logic. This highlights iterative development and attention to user experience, not just functional requirements.

### 5. Adding filtering and inline editing without duplicating state (transcript lines 1183 - 1261)
I worked with Claude to introduce category filtering and inline editing while maintaining a simple state structure. I could extend application functionality thoughtfully while keeping the data model clean and avoiding unnecessary complexity.