
# CivicPulse 🚀

> An AI-powered Progressive Web App (PWA) that transforms civic engagement by creating a transparent, efficient, and collaborative ecosystem for citizens, municipal officials, and field supervisors.

---

## The Problem: A Disconnected System

In many communities, a significant gap exists between citizens and the local authorities responsible for maintaining public infrastructure. 
- **Citizens** lack a simple and effective way to report issues like potholes, broken streetlights, or uncollected waste.
- **Municipalities** are often overwhelmed with disorganized reports from various channels, making it difficult to prioritize, assign, and track tasks.
- **Transparency** is minimal, leaving citizens feeling unheard and frustrated by the lack of progress on their reports.

This disconnect leads to delayed resolutions, increased costs, and a decline in community trust and satisfaction.

## Our Solution: The CivicPulse Ecosystem

CivicPulse is an intelligent, three-sided platform designed to bridge this gap. We provide a tailored, seamless experience for each key user, creating a closed-loop system where issues are reported, managed, and resolved with unprecedented efficiency.

1.  **For Citizens 🙋‍♀️:** An engaging, gamified mobile-first experience to report issues, track their resolution in real-time, and earn rewards for contributing to their community.

2.  **For Municipal Officials 🏛️:** A powerful administrative dashboard to triage incoming reports, assign tasks to field staff, and monitor overall performance with detailed analytics.

3.  **For Field Supervisors 👷‍♂️:** A streamlined work queue to receive assignments, submit completion reports with photo evidence, and compete on a performance-based leaderboard.

## Key Features

### The Power of AI 🤖

Our platform's efficiency is driven by a powerful AI engine, which automates and enhances every step of the workflow:
- **AI-Assisted Reporting:** Citizens submit reports effortlessly. Our AI analyzes images for severity, transcribes audio notes, determines an intelligent priority level, and generates a concise title.
- **AI-Guarded Submissions:** To prevent fraud, the system automatically detects and flags AI-generated images in completion reports, ensuring authenticity and penalizing misuse.
- **AI Completion Analysis:** When a supervisor submits a "resolved" ticket, our AI provides a side-by-side analysis, comparing the "before" and "after" photos to verify the work was completed correctly.

### The Gamification Engine 🏆

We turn civic duty into a rewarding experience to drive continuous engagement and high-quality participation.
- **Utility Points (for Citizens):** Earned for submitting valid reports, with more points awarded for higher-severity issues.
- **Efficiency Points (for Supervisors):** Awarded for resolving issues in a timely and effective manner.
- **Trust Score:** A universal reputation metric that penalizes misuse (e.g., false reports, fraudulent photos) and rewards quality, ensuring the integrity of the entire system.
- **Badges & Leaderboards:** Celebrate top-performing citizens and supervisors, fostering a sense of community and friendly competition.

### Total Transparency and Collaboration
- **Real-Time Tracking:** Citizens can monitor their tickets from 'Submitted' to 'Resolved' with a visual timeline.
- **Interactive Map View:** A live GIS map displays all reported issues, color-coded by priority, giving everyone a high-level overview of the community's status.
- **Collaborative Reporting:** Citizens can "join" existing reports, increasing their priority and signaling widespread community impact.

---

## 🛠️ Technical Stack

-   **Frontend:** Next.js (App Router), React, TypeScript
-   **UI/Styling:** ShadCN UI, Tailwind CSS, Recharts
-   **Generative AI:** Google Gemini 2.5 Flash via Genkit
-   **Backend & Database:** Firebase (Authentication, Firestore, Storage)
-   **Mapping:** Leaflet with OpenStreetMap
