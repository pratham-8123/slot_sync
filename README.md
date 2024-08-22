# Slot Sync Application for Art Workshops' Studio
  Studio can organise workshops and can invite interested individuals to book a slot for any workshop.
  
**Backend:**
  - **Java:** The programming language for the backend.
  - **Maven:** The build automation tool.
  - **Spring Framework:** For building the Java application.
  - **Spring Boot:** Simplifies the setup and development of new Spring applications.
  - **JPA and Hibernate:** For database operations and integration with PostgreSQL.
  - **JWT Security** For user's authentication.
  - **PostgreSQL:** The relational database management system.
  - **Amazon S3:** For storing slot related images.

**Frontend:**
  - **HTML and CSS:** For structuring and styling the website.
  - **JavaScript:** The programming language for the frontend.
  - **React:** JavaScript library for building user interfaces.

**Commands (To be run after startup)**
  - docker exec -it slot_sync-db-1 bash
  - psql -U postgres -d slotsyncDB
  - INSERT INTO roles(name) VALUES('ROLE_USER');
  - INSERT INTO roles(name) VALUES('ROLE_ADMIN');
  - Create an admin and a user from postman or any other API client
