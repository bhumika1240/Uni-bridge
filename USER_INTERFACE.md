5.1 Wireframes
Image1: Login page
 

Image 2: Register page
 

Description: The Login and Register pages handle user authentication for Uni Bridge. The Login screen allows existing users to access their accounts using their email and password, while the Register screen enables new users to create an account using university verified email addresses to maintain a secure, student only environment. These screens form the entry point to the platform and ensure that only authenticated users can access Uni Bridge’s learning and teaching features.

Image 3: Ethical page
 
Description:
 Since the full agreement text is extensive, the interface presents a summary of the Uni-Bridge Code of Honor. Users are required to scroll through and check the "I accept & agree" box to proceed. This screen enforces the following core strategies:
•	Academic Integrity: Explicitly prohibits the swapping of finished assignments or exam solutions to prevent collusion.
•	Student Safety: Users agree to meet only in university-verified "Safe Zones" (e.g., Library, Student Union).
•	Data Minimalism: Users acknowledge that only essential data (Name, ID, Modules) is collected and stored securely.
•	Verification: Reconfirms that the user is a verified student of the university community.







Image 4: Profile/Module Management

 

 
Description: The Profile Page allows users to manage their teachable modules, learning interests, and weekly availability. The “Add Module” and “Set Availability” pop ups enable users to update their skills and schedule without leaving the page, ensuring a smooth editing experience. All updates link directly to the ERD’s junction tables, supporting accurate expert learner matching during search and meeting requests.

Image 5: Search Page:

 
Description: The Search Page allows users to find experts based on specific academic modules using the search bar and optional filters such as “Show Teacher Only.” Search results display expert cards with their teachable modules, availability, and quick actions like “View Profile” or “Request Meeting,” helping users identify the right expert efficiently.















Image 6: Home page / Dashboard 

 
Description: The Home Dashboard provides a personalised overview of the user’s activity, including their teachable and learning modules, weekly availability, request counts, and unread notifications. It also includes a quick search bar for finding experts and shortcuts to manage skills, availability, requests, and notifications. This page acts as the central hub, giving users a clear snapshot of their academic interactions and next steps.








Image 7: Request Page:

 
Description: The Requests Page displays all incoming and sent meeting requests, allowing users to accept or decline new requests and track the status of their outgoing ones. Incoming requests include module details, messages, and requested times with action buttons for Accept (green) and Decline (red). Sent requests show real time statuses such as Accepted, Declined, or Pending, helping users manage their academic interactions efficiently.








Image 8: Notification Page
 
Description: The Notification Page displays all updates related to meeting requests, including new requests, accepted or declined responses, and past activity. Notifications are grouped by date (Today, Yesterday) and provide quick actions such as “View Request” or “Open Request,” helping users stay informed about their academic interactions.

5.2 Visual Design & Brand Identity
Design Philosophy: Uni-Bridge utilizes a Minimalist Blue theme. This choice was made to provide a clean, academic, and professional environment that reduces "visual noise" for students during their search.
Colour Scheme:
•	Primary Navigation Blue (#007BFF): Used for the top navigation bar, Login/Logout buttons, and primary actions to signify "Movement" and "Connectivity."
•	Functional Success Green: Used in the Request Dashboard for the "Accept" button to provide positive visual feedback.
•	Functional Warning Red: Used for "Decline" and "Logout" to alert the user of a permanent action.
•	Neutral Workspace: High use of white space and light grey borders to ensure text readability across all student profiles.
•	Typography: We have selected standard Sans-Serif fonts to ensure the platform is accessible and readable on both mobile and desktop views, matching the clean aesthetic of our wireframes.

5.3 WIREFLOW DIAGRAM
 
The wireflow shows how users navigate through Uni Bridge and how the system processes meeting requests. From the Home Page, users can search for teachers, manage skills and availability, view notifications, or open the Requests Dashboard. When a user sends a meeting request, the system validates it and either shows an error or saves the request and notifies the receiver. The receiver views the request in the Requests Dashboard and accepts or declines it. The system updates the request status and notifies the sender, who can view the updated status in the Sent Requests section. The Requests Dashboard only handles Accept/Decline and status viewing—it does not interact with the Save Request step, which happens earlier in the system flow.
