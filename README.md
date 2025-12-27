
# CivicPulse 🚀

> An AI-powered Progressive Web App (PWA) designed to streamline civic issue reporting and resolution, fostering a transparent and collaborative ecosystem between citizens and their local government.

---

## ✨ Core Concept: A Unified Ecosystem

CivicPulse is built on a "three-sided" model, providing a tailored experience for each user role:

1.  **For Citizens:** An engaging, gamified mobile-first experience to report issues, track their resolution in real-time, and earn rewards for contributing to their community.
2.  **For Municipal Officials:** A powerful administrative dashboard to triage incoming reports, assign tasks to field staff, and monitor overall performance with detailed analytics.
3.  **For Field Supervisors:** A streamlined work queue to receive assignments, submit completion reports with photo evidence, and compete on a performance-based leaderboard.

## 🎯 Key Features

### For Citizens 🙋‍♀️

*   **AI-Assisted Reporting:** Effortless submission with automatic analysis of image severity, priority, and title generation.
*   **Gamification Engine:** Earn Utility Points & Badges for reporting, and climb the community leaderboard.
*   **Interactive Map View:** See all reported issues in the community on a live GIS map.
*   **Collaborative Reporting:** "Join" existing reports to increase their priority and show community impact.
*   **Real-Time Tracking:** Monitor your tickets from 'Submitted' to 'Resolved' with a visual timeline.
*   **Feedback System:** Rate the quality of completed work to directly influence supervisor Trust Scores.

### For Municipal Officials 🏛️

*   **Centralized Triage Dashboard:** One organized queue for all new reports, powered by AI-driven insights.
*   **Intelligent Assignment:** Assign tasks to the most relevant supervisors based on issue category and location.
*   **Comprehensive Analytics:** Visualize issue categories, resolution times, and supervisor performance with rich charts and graphs.
*   **Live GIS Map:** View all issues color-coded by priority for a high-level overview of the municipality's status.

### For Field Supervisors 👷‍♂️

*   **Personalized Work Queue:** A clear, organized dashboard of active and resolved tickets assigned to you.
*   **Performance Analytics:** Track your Efficiency Points, Trust Score, and resolution history with dedicated charts.
*   **AI-Guarded Submissions:** The system automatically detects and flags AI-generated images to prevent fraudulent completion reports.
*   **Streamlined Reporting:** Easily submit completion reports with photos and notes directly from the field.

---

## 🔄 The Workflow: From Report to Resolution

This diagram illustrates the complete lifecycle of an issue report, from submission by a citizen to resolution by a field supervisor.

```mermaid
graph TD
    subgraph Citizen
        A[Start: Report Issue] --> B{Snap Photo & Add Notes/Audio};
        B --> C[Submit for Analysis];
    end

    subgraph AI Processing
        C --> D{1. Analyze Image Relevancy & Severity};
        D -- Irrelevant --> D_Reject[Reject & Notify User];
        D -- Relevant --> E{2. Transcribe Audio (if any)};
        E --> F{3. Determine Priority};
        F --> G{4. Generate Title};
    end
    
    subgraph Citizen Review
        G --> H{Review AI Analysis};
        H -- Looks Good --> I[Confirm & Submit Report];
        H -- Needs Changes --> B;
    end

    subgraph Municipal Official
        I --> J[Ticket Created in Triage Queue];
        J --> K{Assign to Supervisor & Set Deadline};
    end

    subgraph Field Supervisor
        K --> L[Ticket in 'In Progress' Queue];
        L --> M{Perform Work};
        M --> N[Submit Completion Report];
    end

    subgraph Municipal Official Review
        N --> O{Review Supervisor's Report};
        O -- Approve --> P[Ticket 'Resolved'];
        O -- Reject w/ Reason --> L;
    end

    A --> Z([End]);
    D_Reject --> Z;
    P --> Z;

    style A fill:#22c55e,stroke:#fff,stroke-width:2px,color:#fff
    style Z fill:#ef4444,stroke:#fff,stroke-width:2px,color:#fff
```

---

## 🛠️ Technical Stack

*   **Frontend:** Next.js (App Router), React, TypeScript
*   **UI/Styling:** ShadCN UI, Tailwind CSS, Recharts
*   **Generative AI:** Google Gemini 2.5 Flash via Genkit
*   **Backend & Database:** Firebase (Authentication, Firestore, Storage)
*   **Mapping:** Leaflet with OpenStreetMap

---

## ⚙️ Getting Started

### 1. Environment Variables

Create a `.env` file in the root of the project and add your Firebase project configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### 4. Firebase Storage CORS Configuration

To allow the web app to upload images to Firebase Storage, you must configure Cross-Origin Resource Sharing (CORS) on your storage bucket.

#### Step 1: Install the Google Cloud CLI

Install the `gcloud` CLI, which includes the `gsutil` tool.
*   **Official Guide:** [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

#### Step 2: Authenticate & Set Project

Log in and set your project ID (replace `your-project-id` with your actual Firebase project ID).

```bash
gcloud auth login
gcloud config set project your-project-id
```

#### Step 3: Apply the CORS Configuration

Run the following command from the project root to apply the CORS settings from `cors.json`:

```bash
gsutil cors set cors.json gs://your-project-id.appspot.com
```

You should see a message confirming the update. Image uploads will now function correctly.
