# SITE Hack-IT-On 2026 | Official Submission Repository

Welcome to the official code repository for **SITE Hack-IT-On 2026**! This is the central hub where all participating teams will submit their final source code or project files for archiving and judging reference.

> **Hosted by:** Society of Information Technology Enthusiasts - USTP CDO  
> **Status:** 🟢 *Accepting Submissions*

---

## Important: Development & Demo Policy

1.  **Your Own Repo:** Teams are encouraged to use their own personal repositories (GitHub/GitLab) for active development during the event. You only need to push your final code here for submission.
2.  **Demo on Your Device:** You **do not** need to deploy your app for the judges to access remotely. During the pitch, you will use **your own laptops or mobile devices** to demonstrate the working prototype to the judges.
3.  **Idea First, Code Second:** The most important part of this event is your **Innovation**.
    * **Is coding required?** It is **highly recommended** that you build a working application because "Technical Implementation" is part of the grading criteria.
    * **Can I submit just a prototype?** Yes! If you run out of time or focus on design, you may submit a non-functional prototype (e.g., Figma click-through or frontend-only). However, please note that this may affect your score in the *Technical Implementation* category.

---

## How to Submit (Step-by-Step)

Follow these steps carefully to ensure your entry is valid.

### Step 1: Fork the Repository
1. Click the **"Fork"** button at the top right of this page to copy this repository to your personal/team GitHub account.
2. Clone your forked repository to your local machine:

### Step 2: Create Your Team Folder
1. Inside the root directory, create a **SINGLE** new folder.
2. **Naming Convention:** You must name the folder exactly as: `TeamName_ProjectTitle`
   - *Example:* `TeamAlpha_CampusConnect`
3. Place all your project files (source code, assets, documentation) inside this specific folder.

### Step 3: Add Documentation
Inside your folder (`TeamName_ProjectTitle`), you **must** include a `README.md` file containing:
- **Project Title**
- **Team Members** (Full Names)
- **Tech Stack Used**
- **Setup & Run Instructions** (How to run the code locally if needed)
- **Screenshots / Demo Link**

### Step 4: Submit via Pull Request
1. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Submission: TeamName - ProjectTitle"
   ```
2. Push the changes to your forked repository:
   ```bash
   git push origin main
   ```
3. Go back to the **Official SITE Repository** (this page).
4. Go to the **Pull Requests** tab and click **New Pull Request**.
5. Select your fork and submit!

---

## ⚠️ Submission Rules

1. **One Folder Per Team:** Do not modify any files outside of your specific `TeamName_ProjectTitle` folder.
2. **Clean Repository:** Please use a `.gitignore` file to exclude `node_modules`, `venv`, or large build artifacts before pushing.
3. **AI Policy:** Generative AI tools (ChatGPT, Copilot, etc.) are allowed. However, ensure you understand the logic behind your solution. If a judge asks about a specific implementation detail, you should be comfortable explaining your approach.

---

## 🏆 Judging Criteria

Your projects will be evaluated based on the following categories (Weights will be revealed during the event):

1. **Innovation & Relevance** *Is the idea unique and relevant to the theme? (Primary Focus)*

2. **Pitch & Q&A** *Can the team clearly communicate and defend their solution?*

3. **Technical Implementation** *Does the prototype actually work?*
   * *Note: While a fully working app is recommended to maximize your score here, partial builds or prototypes are accepted.*

4. **Feasibility & Viability** *Is this realistic to build and scale in the real world?*

5. **User Value** *Does it solve a genuine problem for the target users?*

6. **UI/UX Design** *Is the application intuitive and professionally designed?*

---

### ❓ Need Help?
If you encounter merge conflicts or permission issues, please message the **Technical Committee** in the official group chat.

**Happy Hacking!**
