## Project Development Plan for AnoChat

### Phase 1: Initial Setup and Basic Backend Development (Weeks 1-3)

**Week 1: Environment Setup and Basic Structure**

-   Day 1-2: Set up version control with Git and GitHub.
-   Day 3-5: Create and configure virtual environments for Python backend.
-   Day 6-7: Initialize the FastAPI application and configure the basic folder structure.

**Week 2: Database and Models**

-   Day 1-3: Set up PostgreSQL database.
-   Day 4-7: Define and implement database models for users and messages using SQLAlchemy.

**Week 3: Basic API Endpoints**

-   Day 1-2: Implement user registration and login endpoints with JWT authentication.
-   Day 3-5: Implement endpoints for sending and retrieving messages.
-   Day 6-7: Set up Alembic for database migrations and create initial migration.

### Phase 2: Frontend Development - Web Client (Weeks 4-6)

**Week 4: Initial Setup and Authentication**

-   Day 1-2: Initialize React project for the web client.
-   Day 3-5: Set up basic routing and project structure.
-   Day 6-7: Implement login and registration pages.

**Week 5: Chat Functionality**

-   Day 1-3: Implement the chat interface, including message list and message input components.
-   Day 4-5: Integrate WebSocket for real-time messaging.
-   Day 6-7: Test and debug chat functionality.

**Week 6: Additional Features and Styling**

-   Day 1-2: Implement file upload functionality (images, videos, etc.).
-   Day 3-4: Add styling and make the interface responsive.
-   Day 5-7: Conduct thorough testing and fix any issues.

### Phase 3: C++ Service and Integration (Weeks 7-8)

**Week 7: C++ Service Development**

-   Day 1-3: Set up C++ development environment.
-   Day 4-7: Implement message processing and encryption/decryption using Boost.Asio.

**Week 8: Integration with Python Backend**

-   Day 1-3: Implement gRPC communication between FastAPI and C++ service.
-   Day 4-7: Test and ensure smooth integration of C++ service with the backend.

### Phase 4: Mobile Client Development (Weeks 9-11)

**Week 9: Initial Setup and Basic Functionality**

-   Day 1-2: Initialize React Native project for the mobile client.
-   Day 3-5: Set up basic routing and project structure.
-   Day 6-7: Implement login and registration screens.

**Week 10: Chat Functionality**

-   Day 1-3: Implement the chat interface, including message list and message input components.
-   Day 4-5: Integrate WebSocket for real-time messaging.
-   Day 6-7: Test and debug chat functionality.

**Week 11: Additional Features and Testing**

-   Day 1-2: Implement file upload functionality (images, videos, etc.).
-   Day 3-4: Add styling and make the interface responsive.
-   Day 5-7: Conduct thorough testing and fix any issues.

### Phase 5: Desktop Client Development (Weeks 12-14)

**Week 12: Initial Setup and Basic Functionality**

-   Day 1-2: Initialize Electron project for the desktop client.
-   Day 3-5: Set up basic routing and project structure.
-   Day 6-7: Implement login and registration screens.

**Week 13: Chat Functionality**

-   Day 1-3: Implement the chat interface, including message list and message input components.
-   Day 4-5: Integrate WebSocket for real-time messaging.
-   Day 6-7: Test and debug chat functionality.

**Week 14: Additional Features and Testing**

-   Day 1-2: Implement file upload functionality (images, videos, etc.).
-   Day 3-4: Add styling and make the interface responsive.
-   Day 5-7: Conduct thorough testing and fix any issues.

### Phase 6: Extended Features and Optimization (Weeks 15-17)

**Week 15: Group Chat Functionality**

-   Day 1-3: Design and implement group chat functionality in both backend and frontend.
-   Day 4-7: Test group chat functionality and ensure it works seamlessly.

**Week 16: End-to-End Encryption**

-   Day 1-3: Implement end-to-end encryption using NaCl or OpenSSL.
-   Day 4-7: Test encryption and ensure data security during transmission.

**Week 17: Performance Optimization**

-   Day 1-3: Optimize backend for performance and scalability.
-   Day 4-7: Conduct load testing and fix any performance issues.

### Phase 7: Deployment and Documentation (Weeks 18-20)

**Week 18: Containerization**

-   Day 1-3: Write Dockerfiles for all components.
-   Day 4-7: Set up Docker Compose for local development.

**Week 19: Kubernetes Deployment**

-   Day 1-3: Write Kubernetes configuration files.
-   Day 4-7: Deploy the application to a Kubernetes cluster.

**Week 20: Documentation and Final Testing**

-   Day 1-2: Write comprehensive documentation for the project.
-   Day 3-7: Conduct final testing, fix any remaining issues, and prepare for production deployment.

### Timeline Summary

-   **Weeks 1-3:** Backend development
-   **Weeks 4-6:** Web client development
-   **Weeks 7-8:** C++ service and integration
-   **Weeks 9-11:** Mobile client development
-   **Weeks 12-14:** Desktop client development
-   **Weeks 15-17:** Extended features and optimization
-   **Weeks 18-20:** Deployment and documentation

## Timeline
### 2024-07-24
#### Initial Setup

1.  **Environment Setup**:
    
    -   Created a Python virtual environment in the `backend` directory.
    -   Activated the virtual environment and ensured it was correctly set up.
2.  **Project Structure**:
    
    -   Initialized the project structure for a FastAPI application.
    -   Included directories and files for `api`, `core`, `crud`, `models`, `schemas`, `services`, and `tests`.
3.  **Configured FastAPI Application**:
    
    -   Created initial FastAPI application files.
    -   Configured basic routing and dependencies.

#### Database Configuration

4.  **PostgreSQL Setup**:
    
    -   Ensured PostgreSQL server was running.
    -   Resolved initial connection issues.
    -   Created a user and database for the project.
5.  **SQLAlchemy Models**:
    
    -   Defined SQLAlchemy models for `User` and `TextMessage`.
    -   Configured SQLAlchemy settings in `database.py`.

#### Handling Configuration

6.  **Environment Variables**:
    -   Used `python-dotenv` to manage environment variables.
    -   Extracted sensitive information into a `.env` file.

#### Pydantic Models and Schemas

7.  **Pydantic Models**:
    -   Updated Pydantic models to use `from_attributes` instead of `orm_mode` to be compatible with Pydantic v2.

#### Testing

8.  **Test Setup**:
    
    -   Wrote unit tests for creating and reading text messages.
    -   Ensured proper setup and teardown of the test database.
9.  **Resolved Freezing Issue**:
    
    -   Added detailed debugging logs to identify where tests might be freezing.
    -   Ensured all async resources were properly awaited and closed.

#### Configuration for Testing

10.  **Pytest Configuration**:
    -   Updated `pytest.ini` to display warnings and run tests in verbose mode.
    -   Ensured the test path and Python path were correctly set in `pytest.ini`.

#### Final Testing and Cleanup

11.  **Run Tests**:
    -   Ran tests successfully, ensuring all resources were properly managed and closed to prevent hanging.

### Next Steps

1.  **Expand Test Coverage**:
    
    -   Add more tests to cover additional functionality and edge cases.
2.  **API Endpoints**:
    
    -   Implement additional API endpoints as needed.
    -   Ensure proper error handling and validation.
3.  **Frontend Development**:
    
    -   Begin developing the frontend to interact with the FastAPI backend.
    -   Ensure seamless integration between frontend and backend.
4.  **Deployment Configuration**:
    
    -   Prepare deployment configurations for different environments (development, staging, production).