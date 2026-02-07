# Uni-Bridge: Study Buddy Exchange 
## Project Overview
Uni-Bridge is a peer-to-peer knowledge exchange platform for university students. Our mission is to reduce academic isolation by enabling students to swap skills—for example, trading help with Database Design for support with Frontend Development.
## The Team "The Gurkhas" Members:
- Bhumika Pariyar: Repository Admin & Dev0ps
- Sujita Gurung: Facilitator & UX/Requirements
- Roman Rai: Backend & Docker lead
- Avinash Sah Kanu: Ethics & Safety Officer
- Smarika Singh Thakuri: Product Owner & Scrum Master

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

## Ethical

# MySQL, PHPMyAdmin and Node.js (ready for Express development)

This will install MySQL and phpmyadmin (including all dependencies to run PhpMyAdmin) AND node.js

This recipe is for development: Node.js is run using supervisor; changes to any file in the app will trigger an automatic rebuild.

For security reasons, this recipe uses a .env file to store credentials.  A sample is provided in the env-sample file. If using these files for a fresh project, copy the env-sample file to a file called .env.  Do NOT commit the .env file into your new project for security reasons (in the node package its included in .gitignore so you can't anyway)

In Node.js, we use the MySQL2 package (to avoid problems with MySQL8) and the dotenv package to read the environment variables.

Local files are mounted into the container using the 'volumes' directive in the docker-compose.yml for ease of development.

### Super-quickstart your new project:

* Make sure that you don't have any other containers running using docker ps
* run ```docker-compose up --build```

#### Visit phphmyadmin at:

http://localhost:8081/

#### Visit your express app at:

http://localhost:3000

For reference, see the video at: https://roehampton.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=6f290a6b-ba94-4729-9632-adcf00ac336e

NB if you are running this on your own computer rather than the Azure Labs that has been set up for you, you will need to install the following:

* node.js  (Windows: https://nodejs.org/en/download/)
* Docker Desktop (for Windows, this will also prompt you to install Linux Subsystem for Windows https://docs.docker.com/desktop/windows/install/ )

### Whats provided in these scaffolding files?


  * A Docker setup which will provide you with Node.js and phpmyadmin, including the configuration needed so that both Node.js and phpmyadmin can 'see' and connect to your mysql database.  If you don't use docker you'll have to set up and connect each of these components separately.
  * A basic starting file structure for a Node.js app.
  * A package.json file that will pull in the Node.js libraries required and start your app as needed.
  * A db.js file which provides all the code needed to connect to the MySQL database, using the credentials in the .env file, and which provides a query() function that can send queries to the database and receive a result.  To use this (ie, interact with the database, you simply need to include this file in any file you create that needs this database interaction, with the following code:

```const db = require('./services/db');
```

____

Useful commands:

Get a shell in any of the containers

```bash
docker exec -it <container name> bash -l
```

Once in the database container, you can get a MySQL CLI in the usual way

```bash
mysql -uroot -p<password> 
```
