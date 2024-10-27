<h1 align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
  <br>discord-member-status-tracker
</h1>
<h4 align="center">Real-time Discord Member Status Tracking and Visualization Dashboard</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<p align="center">
  <img src="https://img.shields.io/badge/Framework-React-blue" alt="Framework: React">
  <img src="https://img.shields.io/badge/Frontend-Javascript,_Html,_Css-red" alt="Frontend: Javascript, Html, Css">
  <img src="https://img.shields.io/badge/Backend-Node.js-blue" alt="Backend: Node.js">
  <img src="https://img.shields.io/badge/Database-MongoDB-green" alt="Database: MongoDB">
</p>
<p align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/discord-member-status-tracker?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/discord-member-status-tracker?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/discord-member-status-tracker?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</p>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
The repository contains a project called "discord-member-status-tracker" that provides a comprehensive solution for real-time Discord member status tracking and visualization. It leverages a robust tech stack: React, JavaScript, HTML, CSS, Node.js, MongoDB, and TypeScript. This project allows server administrators to gain valuable insights into member activity, manage their community effectively, and enhance the overall Discord server experience.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | Architecture   | The codebase follows a modular architectural pattern with separate directories for different functionalities, ensuring easier maintenance and scalability.             |
| 📄 | Documentation  | The repository includes a README file that provides a detailed overview of the project, its dependencies, and usage instructions.|
| 🔗 | Dependencies   | The codebase relies on various external libraries and packages such as React, Next.js, Mongoose, Express.js, and Tailwind CSS, which are essential for building and styling the UI components, handling API interactions, and managing data. |
| 🧩 | Modularity     | The modular structure allows for easier maintenance and reusability of the code, with separate directories and files for different functionalities such as commands, services, events, and database models.|
| 🧪 | Testing        | Implement unit tests using frameworks like Jest or React Testing Library to ensure the reliability and robustness of the codebase.       |
| ⚡️  | Performance    | The performance of the system can be optimized based on factors such as the browser and hardware being used. Consider implementing performance optimizations for better efficiency.|
| 🔐 | Security       | Enhance security by implementing measures such as input validation, data encryption, and secure communication protocols.|
| 🔀 | Version Control| Utilizes Git for version control with GitHub Actions workflow files for automated build and release processes.|
| 🔌 | Integrations   | Integrates with the Discord API for real-time status updates, member information, and event handling.  Potentially integrates with third-party APIs like Twitch, Spotify, or others for richer insights into member activities.|
| 📶 | Scalability    | Design the system to handle increased user load and data volume, utilizing caching strategies and cloud-based solutions for better scalability.           |

## 📂 Structure

```
discord-member-status-tracker/
├── discord-bot/
│   ├── src/
│   │   ├── commands/
│   │   │   ├── setup.ts
│   │   │   └── status.ts
│   │   ├── services/
│   │   │   ├── memberService.ts
│   │   │   └── statusService.ts
│   │   ├── events/
│   │   │   ├── ready.ts
│   │   │   ├── guildMemberAdd.ts
│   │   │   ├── guildMemberRemove.ts
│   │   │   ├── guildMemberUpdate.ts
│   │   │   ├── voiceStateUpdate.ts
│   │   │   └── interactionCreate.ts
│   │   ├── utils/
│   │   │   ├── embedGenerator.ts
│   │   │   ├── statusFormatter.ts
│   │   │   └── logger.ts
│   │   ├── database/
│   │   │   └── models/
│   │   │       ├── guild.ts
│   │   │       └── member.ts
│   │   └── index.ts
│   ├── .env
│   └── package.json
└── discord-dashboard/
    ├── src/
    │   ├── components/
    │   │   ├── MemberList.tsx
    │   │   ├── MemberDetails.tsx
    │   │   ├── ServerStats.tsx
    │   │   ├── MemberActivity.tsx
    │   │   ├── RoleManagement.tsx
    │   │   └── Navigation.tsx
    │   ├── pages/
    │   │   ├── index.tsx
    │   │   └── server/
    │   │       └── [serverId].tsx
    │   ├── services/
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   ├── hooks/
    │   │   ├── useMemberStatus.ts
    │   │   ├── useServerData.ts
    │   │   └── useMemberDetails.ts
    │   ├── utils/
    │   │   ├── formatStatus.ts
    │   │   └── formatDate.ts
    │   └── app.tsx
    ├── tailwind.config.js
    ├── vite.config.js
    ├── .env
    └── package.json
```

  ## 💻 Installation
  ### 🔧 Prerequisites
  - Node.js (LTS version recommended)
  - npm or yarn
  - Docker (for containerization)
  - MongoDB (for data storage)

  ### 🚀 Setup Instructions
  1. Clone the repository:
     ```bash
     git clone https://github.com/coslynx/discord-member-status-tracker.git
     ```
  2. Navigate to the project directory:
     ```bash
     cd discord-member-status-tracker
     ```
  3. Install dependencies:
     ```bash
     npm install 
     ```
  4. Set up environment variables:
     - Create a `.env` file in both the `discord-bot` and `discord-dashboard` folders.
     - Add the following environment variables:
       - `DISCORD_BOT_TOKEN`: Your Discord bot token.
       - `MONGODB_URI`: Your MongoDB connection string. 
     - Refer to the project's documentation for detailed instructions on obtaining and configuring these variables.
  5. Start the MongoDB database:
     - Ensure MongoDB is installed and running.
     - If not, download and install it from [https://www.mongodb.com/](https://www.mongodb.com/).
  6. Start the Discord bot:
     - In the `discord-bot` folder, run:
       ```bash
       npm run start:dev 
       ```
  7. Start the React dashboard:
     - In the `discord-dashboard` folder, run:
       ```bash
       npm run dev
       ```
  
  ## 🏗️ Usage
  ### 🏃‍♂️ Running the Project
  - The development server for the React dashboard will be running at [http://localhost:5173](http://localhost:5173).
  - The Discord bot will automatically connect to your server after you've added it to your Discord server and granted it the necessary permissions.
  - Refer to the project's documentation for detailed usage instructions and a guide to configuring the bot for your specific Discord server.
  
  ## 🌐 Hosting
  ### 🚀 Deployment Instructions
  - Containerization with Docker:
    - Build a Docker image for the bot:
      ```bash
      docker build -t discord-member-status-bot .
      ```
    - Run the Docker image:
      ```bash
      docker run -d -p 8080:8080 discord-member-status-bot
      ```
    - This will host the bot on port 8080 of your local machine.
  - Cloud Hosting (e.g., AWS, Google Cloud):
    - Follow the cloud provider's specific instructions for deploying Docker containers or Node.js applications.
    - Ensure you configure the environment variables and database connections correctly.
  - Serverless Hosting (e.g., Netlify, Vercel):
    - Build the React dashboard and deploy it to a serverless platform.
    - Configure API routes and integration with the Discord bot.
  - Heroku:
    - Follow the [Heroku Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs) for deploying your bot to Heroku.
    - Configure environment variables and database connections as needed.

  ## 📜 API Documentation
  ### 🔍 Endpoints
  - POST `/setup`: Sets up the bot on a Discord server.
  - GET `/members`: Retrieves a list of all members on the server.
  - GET `/members/:memberId`: Retrieves the details of a specific member.
  - POST `/status`: Updates a member's status (online, offline, DND, etc.)
  - GET `/stats`: Gets server statistics (member count, online count, etc.)
  
  ### 🔒 Authentication
  The bot uses a Discord API token for authentication. 

  ### 📝 Examples
  ```bash
  # Example: Get server member list
  curl -X GET http://localhost:3000/members

  # Example: Get a specific member's details
  curl -X GET http://localhost:3000/members/123456789012345678
  ```

  ## 📜 License
  This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

  ## 👥 Authors
  - Author Name - [Spectra.codes](https://spectra.codes)
  - Creator Name - [DRIX10](https://github.com/Drix10)

  <p align="center">
    <h1 align="center">🌐 Spectra.Codes</h1>
  </p>
  <p align="center">
    <em>Why only generate Code? When you can generate the whole Repository!</em>
  </p>
  <p align="center">
	<img src="https://img.shields.io/badge/Developer-Drix10-red" alt="">
	<img src="https://img.shields.io/badge/Website-Spectra.codes-blue" alt="">
	<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
	<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4-black" alt="">
  <p>