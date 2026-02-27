## System aechitecture diagram
<img width="1404" height="1770" alt="Picture2" src="https://github.com/user-attachments/assets/11a0746e-7bc0-4d9b-83c2-3cde2e676aa1" />

The system follows a three-tier architecture consisting of the frontend, backend, and database layers. Users interact with the platform
through mobile or web devices, where the frontend UI handles all user-facing screens such as login, search, profile management, module selection, 
availability setup, and meeting request actions. The backend application layer processes all business logic, including authentication, user management, 
module role assignment, search and matching, meeting request validation, and notification generation. The backend communicates with the database,
which stores all persistent data such as users, modules, roles, availability, meeting requests, and notifications. This architecture ensures scalability,
security, and clear separation of concerns, making the system maintainable and efficient for peer-to-peer learning interactions. 
