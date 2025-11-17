# Task Manager

A full-stack task management application built with React Native (Expo) frontend and Node.js/Express backend, using Turso as the database.

## 🚀 Features

- Create, read, update, and delete tasks
- Cross-platform mobile app (iOS/Android/Web)
- RESTful API backend
- Turso SQLite database for fast and reliable data storage
- Real-time task synchronization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn package manager
- Expo CLI (for mobile development)
- Git

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with your Turso database configuration:
```env
DATABASE_URL=your_turso_database_url
DATABASE_AUTH_TOKEN=your_turso_auth_token
PORT=3000
```

4. Run database migrations:
```bash
npm run migrate
```

5. Test the database connection:
```bash
npm run test-connection
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Usage

### Starting the Backend Server

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the development server:
```bash
npm run dev
```

The API server will be running at `http://localhost:3000`

### Starting the Frontend App

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the Expo development server:
```bash
npm start
```

3. Choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

## 📚 API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a specific task
- `DELETE /api/tasks/:id` - Delete a specific task

## 🏗️ Project Structure

```
task/
├── backend/                 # Node.js/Express API server
│   ├── routes/             # API route handlers
│   ├── scripts/            # Database scripts
│   ├── migrations/         # Database migration files
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/               # React Native (Expo) app
│   ├── src/               # App source code
│   ├── assets/            # Images and assets
│   ├── App.js             # Main app component
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🧪 Testing

### Backend Testing

Test the database connection:
```bash
cd backend
npm run test-connection
```

### API Testing

You can test the API endpoints using curl or tools like Postman:

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Create a new task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample Task","description":"A sample task description"}'
```

## 🔧 Development Scripts

### Backend Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run test-connection` - Test database connectivity

### Frontend Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start on web

## 🗄️ Database

This project uses [Turso](https://turso.tech/) as the database, which provides:

- SQLite-compatible database
- Edge deployment capabilities
- Built-in replication
- HTTP-based API

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.
