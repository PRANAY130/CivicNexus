# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Firebase Storage CORS Configuration

To allow your web application to upload images to Firebase Storage, you need to configure Cross-Origin Resource Sharing (CORS) on your storage bucket. The `cors.json` file in this project is already configured for you.

Follow these steps to apply the configuration:

### Step 1: Install the Google Cloud CLI

If you don't already have it, install the Google Cloud CLI, which includes the `gsutil` tool.

- **Follow the official installation guide:** [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

### Step 2: Authenticate with Google Cloud

Open your terminal or command prompt and run the following command. This will open a browser window for you to log in with your Google account.

```bash
gcloud auth login
```

### Step 3: Set Your Project

Tell `gcloud` which Google Cloud project you want to work with. Your Project ID is `civicpulse-9fe2f`.

```bash
gcloud config set project civicpulse-9fe2f
```

### Step 4: Apply the CORS Configuration

Navigate to the root directory of this project in your terminal (the same directory where `package.json` and `cors.json` are located). Then, run the following command to apply the CORS settings to your bucket:

```bash
gsutil cors set cors.json gs://civicpulse-9fe2f.appspot.com
```

You should see a message confirming that the CORS policy has been updated. Once you've completed these steps, the image upload functionality in your app will work correctly.

## Application Workflow

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

### Key Stages:

1.  **Citizen Reporting**: A citizen finds an issue, takes a photo, provides details (text or audio), and submits it.
2.  **AI Analysis**: The system's AI automatically:
    *   Checks if the image is relevant.
    *   Transcribes any audio notes.
    *   Determines the issue's priority (`Low`, `Medium`, `High`).
    *   Generates a concise title.
3.  **Citizen Confirmation**: The citizen reviews the AI's analysis and confirms the report.
4.  **Triage (Municipal Official)**: The new ticket appears in a queue for a municipal official, who assigns it to a relevant field supervisor and sets a deadline.
5.  **Resolution (Supervisor)**: The assigned supervisor views the ticket, performs the necessary work, and submits a completion report.
6.  **Final Approval (Municipal Official)**: The official reviews the supervisor's report. If the work is satisfactory, the ticket is marked as `Resolved`. If not, it's rejected with feedback and sent back to the supervisor.
