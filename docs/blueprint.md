# **App Name**: CivicPulse PWA

## Core Features:

- Report Issue: Allow citizens to report issues by taking a photo, adding voice or text notes, and selecting a category. Automatically capture GPS coordinates and address.
- View Tickets: Allow citizens to view the status of their submitted tickets with a clear, visual timeline and estimated resolution time.
- Image Analysis: Use Gemini Pro Vision tool to assess the severity of the issue from the submitted image and return a severity score.
- Hybrid Priority Engine: Analyze user input (category and notes) using NLP to identify keywords that influence priority, combining AI image analysis score with NLP results to determine a final priority level (Low, Medium, High).
- Issue Submission: Generate a unique Ticket ID (e.g., #CP-12345) upon successful issue submission and show the ID to the user, along with a thank you message.
- Map Integration: For map use leaflet.js
- Geolocation: Take location access from user using geolocation

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to evoke trust and civic responsibility.
- Background color: Light gray (#F0F0F0) to provide a clean and neutral backdrop.
- accent color: A contrasting green (#5CE65C) to highlight important actions and notifications.
- Body and headline font: 'PT Sans', a modern, humanist sans-serif suitable for headlines or body text, to maintain readability and a contemporary feel.
- Make the ui modern with sections for for attractiveness