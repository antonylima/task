# Task Manager - React Native Frontend

A beautiful and functional React Native mobile app for task management, built with Expo.

## Features

- 📱 **Cross-platform** - Works on iOS, Android, and Web
- ✨ **Modern UI** - Clean, intuitive interface with smooth animations
- 🔄 **Real-time sync** - Connects to your task management backend
- 📋 **Full CRUD operations** - Create, read, update, and delete tasks
- 🎯 **Task status management** - Pending, In Progress, Completed states
- 🔍 **Task details** - Detailed view with full description and metadata
- 📱 **Responsive design** - Optimized for different screen sizes
- ♿ **Accessibility** - Built with accessibility in mind

## Prerequisites

- Node.js 16.x or later
- Expo CLI: `npm install -g @expo/cli`
- A running Task Manager backend (see parent directory)

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure backend URL**:
Edit `src/utils/config.ts` and update the `API_BASE_URL` to point to your backend server:
```typescript
// For local development
API_BASE_URL: 'http://localhost:3000/api'

// For production
API_BASE_URL: 'https://your-production-api.com/api'
```

3. **Start the development server**:
```bash
npm start
```

## Running the App

### Development

```bash
# Start the Expo development server
npm start

# Run on Android (requires Android device/emulator)
npm run android

# Run on iOS (requires macOS and Xcode)
npm run ios

# Run in web browser
npm run web
```

### Testing on Device

1. Install the **Expo Go** app on your mobile device
2. Scan the QR code displayed in the terminal/browser
3. The app will load on your device

## App Structure

```
src/
├── components/          # Reusable UI components
│   ├── Common/         # Common components (buttons, loading, etc.)
│   ├── Form/           # Form-related components
│   └── Task/           # Task-specific components
├── screens/            # Main app screens
│   ├── HomeScreen.tsx      # Task list and main navigation
│   ├── CreateTaskScreen.tsx # Create new task
│   └── TaskDetailScreen.tsx # View/edit task details
├── services/           # API and external service integrations
│   └── taskService.ts      # Backend API integration
├── types/              # TypeScript type definitions
│   └── index.ts            # App-wide type definitions
└── utils/              # Utility functions and configuration
    └── config.ts           # App configuration and constants
```

## Key Components

### Screens
- **HomeScreen**: Main task list with pull-to-refresh and quick actions
- **CreateTaskScreen**: Form for creating new tasks
- **TaskDetailScreen**: Detailed task view with edit and delete options

### Components
- **TaskCard**: Individual task display with status indicators
- **TaskForm**: Reusable form for creating/editing tasks
- **Common components**: Buttons, loading states, empty states

## Features in Detail

### Task Management
- Create tasks with title, description, and status
- Update task information and status
- Delete tasks with confirmation
- Visual status indicators (color-coded)
- Quick status change with tap

### User Interface
- Modern iOS/Android design patterns
- Smooth animations and transitions
- Pull-to-refresh functionality
- Loading states and error handling
- Empty states with helpful messaging

### Data Handling
- Automatic data refresh when returning to screens
- Optimistic updates for better user experience
- Error handling with user-friendly messages
- Request timeout handling

## Customization

### Colors and Theming
Edit the StyleSheet objects in components to customize:
- Primary color: `#007AFF` (iOS blue)
- Secondary color: `#8E8E93` (iOS gray)
- Success color: `#34C759` (iOS green)
- Warning color: `#FF9500` (iOS orange)
- Danger color: `#FF3B30` (iOS red)

### API Configuration
Modify `src/utils/config.ts` to:
- Change backend URL
- Adjust request timeouts
- Add additional configuration options

## Building for Production

### Web
```bash
npm run build:web
```

### Mobile Apps
1. Configure your app in `app.json`
2. Use Expo Application Services (EAS):
```bash
npm install -g @expo/eas-cli
eas build
```

## Troubleshooting

### Common Issues

1. **Cannot connect to backend**:
   - Ensure backend is running on correct port
   - Check API_BASE_URL in config.ts
   - For mobile devices, use your computer's IP address instead of localhost

2. **Metro bundler issues**:
   ```bash
   npm start -- --clear
   ```

3. **Dependencies issues**:
   ```bash
   npm install --legacy-peer-deps
   ```

### Network Configuration for Development

When testing on physical devices, replace `localhost` with your computer's IP address:
```typescript
// Instead of
API_BASE_URL: 'http://localhost:3000/api'

// Use your computer's IP (find with ipconfig/ifconfig)
API_BASE_URL: 'http://192.168.1.100:3000/api'
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.