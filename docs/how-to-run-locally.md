
# How to Run NutriSnap Locally: A Beginner's Guide

This guide will walk you through the steps to get the NutriSnap application running on your own computer. We'll try to make it as simple as possible!

**Important Note:** Web applications like NutriSnap are built with several tools and technologies. While these steps are simplified, having some basic comfort with computers will be helpful. If you're brand new to programming, this might feel a bit challenging, but take it one step at a time!

## Step 1: Install Necessary Software (Prerequisites)

Before you can run the app, you need a couple of free tools installed on your computer.

**1. Node.js and npm (Node Package Manager):**
   *   **What it is:** Node.js is an environment that lets you run JavaScript code (which this app is built with) outside of a web browser. npm comes with Node.js and helps manage the project's building blocks (called "packages" or "dependencies").
   *   **How to get it:**
      1.  Go to the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
      2.  You'll usually see two download options: LTS (Long Term Support) and Current. **Download the LTS version.** It's generally more stable.
      3.  Once downloaded, run the installer and follow the on-screen instructions (usually, you can just click "Next" through the defaults).
      4.  To check if it installed correctly:
          *   Open your computer's **Terminal** (on Mac, you can find it in Applications > Utilities > Terminal. On Windows, search for "Command Prompt" or "PowerShell").
          *   Type `node -v` and press Enter. You should see a version number (e.g., `v18.17.0`).
          *   Type `npm -v` and press Enter. You should see another version number (e.g., `9.6.7`).
          *   If you see version numbers, you're good to go!

**2. A Code Editor (Optional, but Highly Recommended):**
   *   **What it is:** A program that helps you view and edit code files.
   *   **Recommendation:** **Visual Studio Code (VS Code)** is a very popular, free, and excellent choice.
   *   **How to get it:** Download it from [https://code.visualstudio.com/](https://code.visualstudio.com/) and install it.

**3. Git (Optional, for getting code updates easily):**
    *   **What it is:** A version control system. If you plan to get updates to the code easily, Git is useful. If you just have the project files (e.g., from a ZIP download), you can skip this for now.
    *   **How to get it:** [https://git-scm.com/downloads](https://git-scm.com/downloads)

## Step 2: Get the Project Code

You need the NutriSnap application's code files on your computer.

*   **If you downloaded a ZIP file:**
    1.  Find the ZIP file (e.g., `nutrisnap-project.zip`).
    2.  Extract it to a folder on your computer. You can usually right-click and choose "Extract All..." or similar. Remember where you extract it!
*   **If you're using Git (more advanced):**
    1.  You would have a command like `git clone <repository_url>` to copy the project into a new folder.

For this guide, let's assume you have the project files in a folder named `nutrisnap-app`.

## Step 3: Open the Project in Your Terminal

You need to tell your computer's terminal to "go into" the project folder.

1.  Open your **Terminal** (or Command Prompt/PowerShell).
2.  Use the `cd` (change directory) command. For example, if your `nutrisnap-app` folder is in your "Documents" folder, you might type:
    *   On Mac/Linux: `cd Documents/nutrisnap-app`
    *   On Windows: `cd Documents\nutrisnap-app`
    *   (The exact path depends on where you saved the folder).
3.  Press Enter. Your terminal prompt should change to show you're now "inside" the `nutrisnap-app` folder.

**Tip:** In VS Code, you can open the folder directly (File > Open Folder...), and then open a terminal within VS Code (Terminal > New Terminal). This is often easier!

## Step 4: Install Project Dependencies

Now that you're in the project folder in your terminal, you need to download all the specific "building blocks" (packages) the app needs.

1.  In your terminal (which should be in the `nutrisnap-app` folder), type:
    ```bash
    npm install
    ```
2.  Press Enter.
3.  You'll see a lot of text as npm downloads and installs everything. This might take a few minutes. Wait until it's finished and you see your normal terminal prompt again.

## Step 5: Set Up Environment (for AI Features)

NutriSnap uses AI for features like calorie estimation. These AI features connect to Google's services.
*   **Basic Run:** You can run the app without this for now, but the AI features won't work.
*   **To make AI features work (more advanced):**
    1.  You would need a Google Cloud Platform (GCP) account.
    2.  You would need to install the Google Cloud SDK (`gcloud` command-line tool).
    3.  You would run a command like `gcloud auth application-default login` in your terminal to allow your local computer to use Google's AI services.
    *This step is more involved and specific to Google Cloud. For just running the app's interface, you can proceed without it for now, but expect AI features to show errors or not function.*

The project has a `.env` file. For now, it's empty, but in more complex setups, it would hold secret keys for services.

**Authentication Note:** This version of the application does not have user login/authentication. It operates as if a single user is using it, and data (like settings and calorie logs) is stored in your web browser's local storage.

## Step 6: Run the Development Servers

NutriSnap needs **two** separate processes running at the same time in your terminal:
1.  **The Next.js App Server:** This runs the main website and user interface.
2.  **The Genkit AI Server:** This runs the AI logic that the Next.js app talks to.

You'll need **two separate terminal windows/tabs** for this.

**Terminal Window 1: Start the Next.js App**
1.  Make sure this terminal is in your `nutrisnap-app` folder.
2.  Type the following command:
    ```bash
    npm run dev
    ```
3.  Press Enter.
4.  You'll see some output, and eventually, it should say something like:
    ```
    - ready started server on 0.0.0.0:9002, url: http://localhost:9002
    ```
    This means the main app is running! The port number (e.g., `9002`) might sometimes vary if that port is already in use, so pay attention to the URL it gives you.

**Terminal Window 2: Start the Genkit AI Server**
1.  Open a **new** terminal window or tab.
2.  Again, make sure this new terminal is in your `nutrisnap-app` folder (use the `cd` command if needed).
3.  Type the following command:
    ```bash
    npm run genkit:dev
    ```
4.  Press Enter.
5.  You'll see output related to Genkit starting up. It might show a different port number (e.g., `Genkit  ✨ HTTP/S server listening on port 3400`). This server runs in the background for the AI tasks.

**Both terminals must remain open while you are using the app.**

## Step 7: View the App in Your Web Browser

Once both servers are running (from Step 6):
1.  Open your web browser (like Chrome, Firefox, Safari, or Edge).
2.  In the address bar, type the URL that the Next.js app server showed you. Usually, this will be:
    ```
    http://localhost:9002
    ```
3.  Press Enter.
4.  You should see the NutriSnap application load in your browser!

## Step 8: Stopping the Application

When you're done using the app:
1.  Go to **each** of the terminal windows you opened in Step 6.
2.  Click into the terminal window.
3.  Press `Ctrl` + `C` on your keyboard (hold the Ctrl key and press C).
4.  The terminal might ask if you want to terminate the batch job (Y/N?). Type `Y` and press Enter.
5.  Do this for both terminal windows to stop both the Next.js server and the Genkit server.

---

That's it! These are the basic steps to run NutriSnap locally. If you encounter errors, they often appear in the terminal windows, which can give clues about what went wrong. Good luck!
