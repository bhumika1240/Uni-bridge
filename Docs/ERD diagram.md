## ERD Diagram
![WhatsApp Image 2026-02-27 at 09 50 10](https://github.com/user-attachments/assets/4e62ea8b-b054-4664-aee8-44d91c01b872)
This ERD models a peer to peer learning platform where every user can both teach and learn. 
The USER_MODULE table resolves the many to many relationships between users and modules while also
storing the user’s role (‘teach’ or ‘learn’). AVAILABILITY stores weekly teaching availability. 
MEETING_REQUEST connects two users (sender and receiver) and links the request to a specific module. NOTIFICATION ensures users are informed about request updates. This structure supports flexible roles and dynamic interactions without separating
users into fixed categories like “student” or “expert.”
