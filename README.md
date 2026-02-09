# Uni-Bridge: Study Buddy Exchange 
## Project Overview
Uni-Bridge is a peer-to-peer knowledge exchange platform for university students. Our mission is to reduce academic isolation by enabling students to swap skills—for example, trading help with Database Design for support with Frontend Development.
## The Team "The Gurkhas" Members:
- Bhumika Pariyar: Repository Admin & Dev0ps
- Sujita Gurung: Facilitator & UX/Requirements
- Roman Rai: Backend & Docker lead
- Avinash Sah Kanu: Ethics & Safety Officer
- Smarika Singh Thakuri: Product Owner & Scrum Master

##  Quick Navigation
- [Project Overview](#project-overview)
- [The Team](#the-team-the-gurkhas-members)
- [User Personas](#user-personas)
- [Ethical & Safety Framework](#ethical--safety-considerations)
- [Technical Setup & Environment](#️technical-setup--environment)
- [Kanban Board](#kanban-board--project-tracking)

---

##  Project Documentation
*For a deep dive into our planning and research, please see the files in our `/docs` folder:*

- **[Meeting Minutes](./docs/meeting.md)**: Logs of our weekly stand-ups and sprint decisions.
- **[Full Ethical Framework](./docs/ETHICS.md)**: Detailed breakdown of safety and privacy.
- **[Code of Conduct](./docs/CONDUCT.md)**: Team rules and collaboration standards.

## Project Description:
Uni-Bridge is a peer-to-peer "Knowledge Exchange" platform designed specifically for university students. The project aims to bridge the gap between students who excel in certain technical areas and those who require additional support, fostering a collaborative campus community. Unlike traditional tutoring, Uni-Bridge operates on a "Skill-Swap" model, where students can trade their expertise. For example, a student proficient in Frontend design may offer help in exchange for support with Backend logic or Database management.

The application will allow users to create detailed profiles highlighting their "Strong Modules" and "Areas for Improvement" based on their current university course. Through a filtered search system, users can find "Study Buddies" based on specific module codes.

**Key Features include:**
- Module-Based Matching: Connecting students within the same or complementary courses.
- Skill-Swap Dashboard: A way for students to list what they can teach versus what they need to learn.
- Campus Safety Integration: To address ethical concerns, the platform will suggest verified, high-traffic meeting locations such as the University Library or Student Union.

By digitalising the process of finding study partners, Uni-Bridge reduces academic isolation and promotes a culture of shared learning and student wellbeing.

## User Personas

**Persona 1: The International Peer-Learner**
- Name: Lucky Gurung
- Background: 1st Year International Student (Software Engineering).
- Bio: Lucky is technically strong in logic and Java, but finds the fast-paced English lectures overwhelming. He is hesitant to ask questions in large groups.
- Goal: To find a "Study Buddy" to review lecture notes with once a week to ensure he hasn't missed key technical terms.
- Exchange Offering: High-level expertise in Java logic and Database design.

**Persona 2: The Final Stressed by Deadlines**
- Name: Siddhi Rai
- Background: 3rd Year Computer Science Student.
- Bio: Siddhi is a talented Frontend designer, but is currently struggling with the Backend requirements of her final project. She feels isolated working from home.
- Goal: To find a partner or small group to work with in the library for "Sprint" study sessions to stay motivated.
- Exchange Offering: Expertise in UI/UX Design and PUG templating.

## Ethical & Safety Considerations
To ensure Uni-Bridge remains a safe and fair environment for all students, "The Gurkhas" have implemented the following framework:

**1. Academic Integrity:**
Uni-Bridge is a platform for peer-support and concept clarification. We strictly prohibit the sharing of live exam answers or completed assignment files. All users must agree to our Academic Integrity Policy upon sign-up, which outlines the difference between collaboration and collusion.

**2. Physical Safety:**
To ensure student safety during in-person study sessions, the application will:

Recommend verified, high-traffic meeting locations on campus (e.g., University Library, Student Union).

Include a "Safe Meeting Guide" for first-time sessions.

**3. Data Privacy (GDPR):**
We follow "Privacy by Design" principles. Student data (Name, University ID, and Modules) is stored securely in our MySQL database. We only collect the minimum information required to facilitate successful study matches, and we ensure the database is protected within our Docker environment.

---

##  Technical Setup & Environment
> **Lead:** Roman Rai (Backend & Docker)

To ensure that every member of **The Gurkhas** can develop, test, and run Uni-Bridge without "version mismatch" errors, we have containerized our entire stack using Docker. This ensures environment parity between Windows, macOS, and Linux users on our team.

### Quick Start
1. **Environment Variables:** Copy the provided `env-sample` file to a new file named `.env` to store your local credentials.
2. **Build the Stack:** Open your terminal in the project root and run:
   ```bash
   docker-compose up --build
3. Local Access:

Web App: http://localhost:3000

Database Management (phpMyAdmin): http://localhost:8081/  
What's Under the Hood?
Our development scaffolding includes:

Node.js: Set up with supervisor for automatic hot-reloading (the app refreshes instantly when you save code).

MySQL 8.0: A persistent database container for storing user profiles and module data.

Service Connectivity: We use a pre-configured db.js utility that handles MySQL queries securely using the environment variables defined in your .env.

---

## Kanban Board & Project Tracking
Project planning and task tracking for Sprint 1 is managed using our GitHub Project Board. This allows us to maintain transparency and ensure all ethical and technical requirements are met before moving to development.

View our live progress here: The Gurkhas Kanban Board

