# Mercury Monitoring

A modern, open-source uptime and status monitoring platform inspired by Uptime Kuma. Mercury Monitoring provides real-time website, API, and service monitoring with beautiful dashboards, incident management, and notification integrations.

## Features

- **Real-time Uptime Monitoring**: Track the status and response time of your websites, APIs, and services.
- **Customizable Monitors**: HTTP(s), TCP, Ping, DNS, and keyword monitoring support.
- **Beautiful Dashboard**: Responsive UI with modern charts and statistics.
- **Incident Management**: Automatic incident creation and status updates when downtime is detected.
- **Notification Integrations**: Email, webhook, Slack, Discord, Telegram, and more (extensible).
- **Pause/Resume Monitors**: Temporarily disable or resume monitoring for any service.
- **History & Analytics**: View uptime history, response time trends, and incident logs.
- **Authentication**: Secure login and protected routes.
- **Easy Setup**: Runs locally with Node.js, Express, React, and SQLite.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, SQLite

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mercury-monitoring.git
   cd mercury-monitoring
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   # Install frontend dependencies
   cd ../
   npm install
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   node index.js
   # The backend will run on http://localhost:3001
   ```

4. **Start the frontend app:**
   ```bash
   cd ../
   npm run dev
   npm run start:all
   # The frontend will run on http://localhost:5173
   ```

5. **Access Mercury Monitoring:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Add a Monitor:** Click "Add Monitor" and fill in the details for your website, API, or service.
- **Pause/Resume:** Use the pause/play button on any monitor card to temporarily disable or resume monitoring.
- **View Incidents:** Incidents are automatically created when a monitor goes down. View and manage them from the Incidents section.
- **Dashboard:** See real-time stats, uptime history, and response time analytics.

## Folder Structure

```
mercury-monitoring/
  backend/           # Express + SQLite backend
    index.js         # Main backend server
    mercury.db       # SQLite database
    ...
  src/               # React frontend source
    components/      # UI components
    hooks/           # Custom React hooks
    types/           # TypeScript types
    ...
  ...
```

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, new features, or improvements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License.
