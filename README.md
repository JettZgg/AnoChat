# AnoChat

A real-time chat application

### Technical Architecture

#### Backend

1.  **Python (Backend)**
    
    -   **Framework**: FastAPI
    -   **Purpose**: Handle API requests, user authentication, message routing, file uploads, etc.
    -   **Database**: PostgreSQL (relational database for user data, message data, etc.)
    -   **Real-time Messaging**: WebSocket (supported natively by FastAPI)
    -   **Storage**: Amazon S3 or MinIO (for storing large objects like images, videos, files, etc.)
2.  **C++ (Backend)**
    
    -   **Purpose**: Handle high-performance tasks such as real-time message processing and encryption/decryption.
    -   **Library**: Boost.Asio (for asynchronous I/O operations)
    -   **Integration**: Communicate with Python services via gRPC

#### Frontend

1.  **Electron (Desktop Client)**
    
    -   **Purpose**: Provide a user interface for the desktop application
    -   **Features**: Support message display, file transfer, real-time chat, etc.
2.  **React Native (Mobile Client)**
    
    -   **Purpose**: Provide a user interface for the mobile application
    -   **Features**: Support message display, file transfer, real-time chat, etc.
3.  **React (Web Client)**
    
    -   **Purpose**: Provide a user interface for the web application
    -   **Features**: Support message display, file transfer, real-time chat, etc.

#### Other Components

1.  **Message Queue**
    
    -   **RabbitMQ or Kafka**: Used for handling message queues, enabling asynchronous processing and high concurrency support
2.  **End-to-End Encryption**
    
    -   **Library**: OpenSSL or NaCl (libsodium)
    -   **Purpose**: Implement end-to-end encryption to ensure message security during transmission
3.  **Authentication**
    
    -   **JWT (JSON Web Tokens)**: Used for user authentication and session management
4.  **Containerization**
    
    -   **Docker**: For deploying and managing various services
    -   **Kubernetes**: For cluster management and service orchestration

### Detailed Design

1.  **FastAPI (Python Backend)**
    
    -   **API Endpoints**: User registration, login, sending messages, retrieving messages, file uploads, etc.
    -   **WebSocket**: Implement real-time chat functionality
    -   **Database Operations**: Use SQLAlchemy for database operations
    -   **File Storage**: Use boto3 (S3) or MinIO client for file uploads
2.  **C++ Service**
    
    -   **Message Processing**: Receive messages from FastAPI via gRPC, handle encryption
    -   **High-Performance Tasks**: Use Boost.Asio for asynchronous processing, improving concurrency performance
3.  **Authentication**
    
    -   **JWT**: Generate and validate user tokens, secure API and WebSocket connections
4.  **Client Applications**
    
    -   **Electron (Desktop Client)**, **React Native (Mobile Client)**, and **React (Web Client)**
    -   **UI Design**: Provide a user-friendly chat interface supporting various message types
    -   **API Interaction**: Use HTTP and WebSocket to interact with backend services, handle message sending and receiving

### Extended Features

-   **Multimedia Messaging**: Support sending and receiving images, videos, files, etc., through multimedia message handling modules in both frontend and backend.
-   **Group Chat Functionality**: Manage group chat members and messages by designing group chat data tables in the database.
-   **End-to-End Encryption**: Use NaCl or OpenSSL to implement message encryption, ensuring security during message transmission.

### Deployment

1.  **Containerization**
    
    -   Use Docker to containerize each component, simplifying deployment and management
    -   Write Docker Compose files to define dependencies between services
2.  **Cluster Management**
    
    -   Use Kubernetes for cluster management and service orchestration
    -   Write Kubernetes configuration files (such as Deployment, Service, Ingress) to define application deployment and service strategies

### Architecture
```
            +-----------------+
            |   React Native  |
            |  (Mobile Client)|<-----+
            +-----------------+      |
                                     |
                                     |
            +-----------------+      |
            |    Electron     |      |
            | (Desktop Client)|<---->|
            +-----------------+      |
                                     |
                                     |
            +-----------------+      |
            |     React       |      |
            |  (Web Client)   |<---->|
            +-----------------+      |
                                     |
           +-------------------------+---------------------------+
           |                                                      |
           |                                                      |
     +-----v---------+     +--------------------+     +-----------v---------+
     |  Load Balancer|<--->|     FastAPI        |<--->| PostgreSQL (DB)     |
     |  NGINX/HAProxy|     |  (Python Backend)  |     +---------------------+
     +---------------+     +--------------------+
                                   |
                                   |
                                   |    +-------------------------+
                                   +--->|   MinIO (or S3)         |
                                        | (Object Storage)        |
                                        +-------------------------+
                                              |
                                              |
                                         +----v-----+
                                         | WebSocket|
                                         +----------+
                                              |
                                              |
                                         +----v-----+
                                         | RabbitMQ |
                                         +----------+
                                              |
                                              |
                                         +----v-------+
                                         | C++ Service|
                                         | (gRPC)     |
                                         +------------+
                                              |
                                              |
                                         +----v--------+
                                         | OpenSSL/NaCl|
                                         | (Encryption)|
                                         +-------------+
```

### Folder Tree
```
chat-app/
├── backend/
│ ├── app/
│ │ ├── init.py # Initialize app module
│ │ ├── main.py # Entry point for the FastAPI application
│ │ ├── core/ # Core configurations and security-related code
│ │ │ ├── init.py
│ │ │ ├── config.py # Application configuration file
│ │ │ ├── security.py # Security-related functions, like password hashing
│ │ ├── models/ # Database models
│ │ │ ├── init.py
│ │ │ ├── user.py # User model
│ │ │ ├── message/ # Message models
│ │ │ ├── init.py
│ │ │ ├── base.py # Base message model
│ │ │ ├── text_message.py # Text message model
│ │ │ ├── image_message.py # Image message model
│ │ │ ├── video_message.py # Video message model
│ │ │ ├── file_message.py # File message model
│ │ │ ├── audio_message.py # Audio message model
│ │ │ ├── combination/ # Combination message models
│ │ │ ├── init.py
│ │ │ ├── text_image.py # Text + Image message model
│ │ │ ├── text_video.py # Text + Video message model
│ │ │ ├── text_file.py # Text + File message model
│ │ │ ├── text_audio.py # Text + Audio message model
│ │ │ ├── image_video.py # Image + Video message model
│ │ │ ├── image_video_text.py # Image + Video + Text message model
│ │ │ ├── file_text.py # File + Text message model
│ │ │ ├── audio_text.py # Audio + Text message model
│ │ ├── schemas/ # Data validation models (Pydantic)
│ │ │ ├── init.py
│ │ │ ├── user.py # User data model
│ │ │ ├── message/ # Message data models
│ │ │ ├── init.py
│ │ │ ├── base.py # Base message data model
│ │ │ ├── text_message.py # Text message data model
│ │ │ ├── image_message.py # Image message data model
│ │ │ ├── video_message.py # Video message data model
│ │ │ ├── file_message.py # File message data model
│ │ │ ├── audio_message.py # Audio message data model
│ │ │ ├── combination/ # Combination message data models
│ │ │ ├── init.py
│ │ │ ├── text_image.py # Text + Image message data model
│ │ │ ├── text_video.py # Text + Video message data model
│ │ │ ├── text_file.py # Text + File message data model
│ │ │ ├── text_audio.py # Text + Audio message data model
│ │ │ ├── image_video.py # Image + Video message data model
│ │ │ ├── image_video_text.py # Image + Video + Text message data model
│ │ │ ├── file_text.py # File + Text message data model
│ │ │ ├── audio_text.py # Audio + Text message data model
│ │ ├── crud/ # Database operations (CRUD)
│ │ │ ├── init.py
│ │ │ ├── user.py # User-related database operations
│ │ │ ├── message.py # Message-related database operations
│ │ ├── api/ # API routes
│ │ │ ├── init.py
│ │ │ ├── deps.py # Dependencies
│ │ │ ├── auth.py # User authentication routes
│ │ │ ├── messages/ # Message-related routes
│ │ │ ├── init.py
│ │ │ ├── base.py # Base message routes
│ │ │ ├── text.py # Text message routes
│ │ │ ├── image.py # Image message routes
│ │ │ ├── video.py # Video message routes
│ │ │ ├── file.py # File message routes
│ │ │ ├── audio.py # Audio message routes
│ │ │ ├── combination/ # Combination message routes
│ │ │ ├── init.py
│ │ │ ├── text_image.py # Text + Image message routes
│ │ │ ├── text_video.py # Text + Video message routes
│ │ │ ├── text_file.py # Text + File message routes
│ │ │ ├── text_audio.py # Text + Audio message routes
│ │ │ ├── image_video.py # Image + Video message routes
│ │ │ ├── image_video_text.py # Image + Video + Text message routes
│ │ │ ├── file_text.py # File + Text message routes
│ │ │ ├── audio_text.py # Audio + Text message routes
│ │ ├── services/ # Business logic
│ │ │ ├── init.py
│ │ │ ├── websocket.py # WebSocket-related services
│ │ │ ├── file.py # File upload and download services
│ │ ├── database.py # Database connection
│ │ ├── dependencies.py # Dependency injection
│ │ ├── routers.py # Route registration
│ │ ├── tests/ # Test files
│ │ ├── init.py
│ │ ├── test_auth.py # User authentication tests
│ │ ├── test_messages.py # Message-related tests
│ ├── Dockerfile # Docker image build file
│ ├── docker-compose.yml # Docker Compose configuration file
│ ├── requirements.txt # Python dependencies
│ ├── alembic.ini # Alembic configuration file
│ ├── alembic/ # Alembic database migration tool
│ ├── env.py
│ ├── script.py.mako
│ ├── versions/
├── web/ # Frontend folder
│ ├── public/ # Static files
│ │ ├── index.html # Application entry HTML file
│ ├── src/ # Frontend source code
│ │ ├── assets/ # Static assets (images, styles, etc.)
│ │ ├── components/ # React components
│ │ │ ├── Chat.js # Chat component
│ │ │ ├── Login.js # Login component
│ │ │ ├── Register.js # Register component
│ │ │ ├── MessageList.js # Message list component
│ │ │ ├── MessageInput.js # Message input component
│ │ │ ├── messages/ # Message components
│ │ │ ├── TextMessage.js # Text message component
│ │ │ ├── ImageMessage.js # Image message component
│ │ │ ├── VideoMessage.js # Video message component
│ │ │ ├── FileMessage.js # File message component
│ │ │ ├── AudioMessage.js # Audio message component
│ │ │ ├── TextImageMessage.js # Text + Image message component
│ │ │ ├── TextVideoMessage.js # Text + Video message component
│ │ │ ├── TextFileMessage.js # Text + File message component
│ │ │ ├── TextAudioMessage.js # Text + Audio message component
│ │ │ ├── ImageVideoMessage.js # Image + Video message component
│ │ │ ├── ImageVideoTextMessage.js # Image + Video + Text message component
│ │ │ ├── FileTextMessage.js # File + Text message component
│ │ │ ├── AudioTextMessage.js # Audio + Text message component
│ │ ├── pages/ # Page components
│ │ │ ├── HomePage.js # Home page component
│ │ │ ├── ChatPage.js # Chat page component
│ │ ├── services/ # Services to interact with the backend
│ │ │ ├── api.js # API request wrapper
│ │ │ ├── auth.js # Authentication request wrapper
│ │ ├── utils/ # Utility functions
│ │ │ ├── helpers.js # General utility functions
│ │ ├── App.js # Main React application component
│ │ ├── index.js # Entry point for the React application
│ ├── package.json # Project dependencies and scripts
│ ├── .eslintrc.js # ESLint configuration file
│ ├── .prettierrc # Prettier configuration file
│ ├── Dockerfile # Docker image build file
│ ├── docker-compose.yml # Docker Compose configuration file
├── .gitignore # Git ignore file
├── README.md # Project readme file
├── desktop/ # Desktop client folder
│ ├── electron/ # Electron project files
│ │ ├── main.js # Electron main process file
│ │ ├── index.html # Application entry HTML file
│ │ ├── package.json # Project dependencies
│ │ ├── src/ # Frontend resources
│ │ ├── styles/ # CSS styles
│ │ ├── scripts/ # JavaScript files
├── mobile/ # Mobile client folder
│ ├── README.md
```