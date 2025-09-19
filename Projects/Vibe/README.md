<br/>
<p align="center">
  <a href="https://github.com/itsskofficial/Agentic-AI">
    <!-- You can replace this with a link to your project logo or a screenshot -->
    <img src="./src/public/logo.svg" alt="Logo" width="120">
  </a>

  <h3 align="center">Vibe</h3>

  <p align="center">
    A full-stack AI application builder that generates complete, deployable Next.js projects from a single prompt.
    <br/>
    <br/>
    <a href="https://github.com/itsskofficial/Agentic-AI/issues">Report Bug</a>
    ·
    <a href="https://github.com/itsskofficial/Agentic-AI/issues">Request Feature</a>
  </p>
</p>

![License](https://img.shields.io/github/license/itsskofficial/Agentic-AI)

## Table Of Contents

-   [About the Project](#about-the-project)
-   [Built With](#built-with)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [Usage](#usage)
-   [Future Improvements](#future-improvements)
-   [Contributing](#contributing)
-   [License](#license)
-   [Authors](#authors)

## About The Project

![Vibe Application Screenshot](./screenshot.png)

Vibe is an AI-powered application builder that transforms a single sentence into a fully functional, production-ready Next.js application. It leverages a sophisticated AI agent that operates within a secure cloud sandbox to write code, install dependencies, and spin up a live development server.

Users can describe an application, such as a "Netflix-style homepage" or a "Kanban board," and Vibe generates the complete codebase. The final result includes a live preview URL, a full code explorer to inspect every generated file, and a credit-based system with integrated billing powered by Clerk.

## Built With

This project was built with a modern, AI-centric tech stack.

-   [Next.js](https://nextjs.org/) (React 19 & TypeScript)
-   [tRPC](https://trpc.io/) for end-to-end typesafe APIs
-   [PostgreSQL](https://www.postgresql.org/) (with [Neon](https://neon.tech/))
-   [Prisma](https://www.prisma.io/)
-   [Docker](https://www.docker.com/)
-   [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   [Clerk](https://clerk.com/) for Authentication & Billing
-   [Ingest](https://www.injest.com/) for Background Jobs & AI Agents
-   [E2B](https://e2b.dev/) for Secure AI Code Execution Sandboxes
-   [OpenAI](https://openai.com/) (GPT-4)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need the following software installed on your machine:

-   [Docker](https://www.docker.com/get-started/) and Docker Desktop (must be running)
-   [Node.js](https://nodejs.org/) (v18.18+)
-   API Keys for various services (Neon, OpenAI, E2B, Clerk)

### Installation

1.  **Clone the repo**

    ```sh
    git clone https://github.com/itsskofficial/vibe.git
    cd vibe
    ```

2.  **Install NPM packages**

    ```sh
    npm install
    ```

3.  **Set up Environment Variables**

    -   Create a `.env` file in the root directory.
    -   Fill in all the required API keys and configuration values.

    ```env
    # .env
    DATABASE_URL="your_neon_database_url"
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    OPENAI_API_KEY="your_openai_api_key"
    E2B_API_KEY="your_e2b_api_key"

    # Clerk Environment Variables
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
    CLERK_SECRET_KEY="your_clerk_secret_key"
    NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
    NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
    ```

4.  **Set Up the Database**

    ```sh
    npx prisma migrate dev --name init
    ```

5.  **Build the E2B Sandbox Template**

    -   Navigate to the sandbox template directory. **Make sure Docker Desktop is running.**

    ```sh
    cd sandbox-templates/nextjs
    ```

    -   Build the template. You can replace `"vibe-nextjs-template"` with your own name.

    ```sh
    npx e2b template build --name "vibe-nextjs-template" --cmd "/home/user/compile_page.sh"
    ```

    -   **Important:** Update the template name in `src/injest/functions.ts` to match the name you used above.

6.  **Run the Development Servers**

    -   You need to run two processes concurrently in separate terminals.

    -   **Terminal 1: Start the Next.js App**

        ```sh
        npm run dev
        ```

        The application will be available at **[http://localhost:3000](http://localhost:3000)**.

    -   **Terminal 2: Start the Ingest Dev Server**
        ```sh
        npx ingest-cli@latest dev
        ```
        The background job server will be available at **[http://localhost:8288](http://localhost:8288)**.

## Usage

Once the application is running, you can:

-   Create an account or log in using the Clerk interface.
-   Use the main input on the homepage to enter a prompt for an application you want to build.
-   Submit the prompt to trigger the AI agent, which will generate the app in the background.
-   Once generated, you will be redirected to a project page where you can interact with a live preview of your new app.
-   Switch to the "Code" tab to explore the complete file structure and source code generated by the AI.
-   Manage your generation credits and upgrade your plan through the integrated billing portal.

## Future Improvements

-   **Support for More AI Models:** Integrate and allow switching between other powerful coding models like Anthropic's Claude or Google's Gemini.
-   **Interactive Code Editing:** Allow users to directly edit the generated code within the browser and have the AI agent understand and apply further changes based on the edits.
-   **More Sandbox Templates:** Extend the architecture to support generating applications for other frameworks like Vue, Svelte, or even basic HTML/CSS/JS.
-   **AI-Powered Debugging:** If a generated application fails to build, implement a feature where the AI agent attempts to read the error logs and fix the code automatically.
-   **Team Collaboration:** Allow multiple users to view and collaborate on generated projects.
-   **Persistent Agent Memory:** Implement a more robust memory solution (e.g., a vector database) to give the agent long-term context across multiple projects.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the repository a star! Thanks again!

### Creating A Pull Request

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

## Acknowledgements

* [Code With Antonio](https://www.codewithantonio.com/)