# Mercury Monitoring

<p align="center">
  <span style="font-size: 120px; color: #007bff;">☿</span>
</p>

<p align="center">
  A sleek, modern web application for monitoring website and API uptime with real-time notifications.
</p>

## 🌟 Description

Mercury Monitoring is a lightweight, elegant solution for monitoring the availability and performance of web services. Built with modern web technologies and featuring a beautiful glassmorphism design, it provides real-time monitoring of websites, APIs, and XML endpoints.

Named after the swift messenger god Mercury (☿), this tool offers quick and reliable monitoring capabilities with an intuitive user interface. The application uses a clean, modern design language with a focus on user experience and real-time feedback.

### Key Features

- **Real-time Monitoring**: Continuously monitors your services with customizable check intervals
- **Multi-Protocol Support**: Monitors HTTP websites, REST APIs, and XML services
- **Instant Notifications**: Email notifications when service status changes
- **Beautiful UI**: Modern glassmorphism design with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Performance Metrics**: Tracks uptime percentage and response times
- **Easy Management**: Simple interface to add, remove, and monitor services
- **Status History**: Maintains service uptime history and statistics
- **Local Storage**: Persists data locally for quick access
- **Zero Dependencies**: No backend required, runs entirely in the browser

### Perfect For

- 🔍 Developers monitoring their applications
- 🌐 Website administrators
- 📊 Small to medium-sized projects
- 🚀 Quick deployment monitoring
- 💻 Personal project monitoring

## 🎯 Purpose

Mercury Monitoring was created to provide a simple yet powerful solution for monitoring web services without the complexity of traditional monitoring tools. It's perfect for developers and small teams who need quick insights into their services' availability and performance.

## 🛠 Technology Stack

- Pure JavaScript (ES6+)
- HTML5 & CSS3
- Bootstrap 5
- Local Storage API
- Modern Browser APIs
- SweetAlert2 for notifications
- Font Awesome for icons

## 🚀 Getting Started

Visit our [Installation Guide](#installation) to get started with Mercury Monitoring in minutes.

## 📝 License

MIT License - feel free to use in your projects

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](../../issues).

---

<p align="center">
  Made with ❤️ for the developer community
</p>

## Features

- 🌐 Monitoring for websites, APIs, and XML sources
- ⏱️ Customizable check intervals
- 📊 Uptime statistics
- 🎨 Modern glassmorphism design
- 📱 Responsive layout
- 🔔 Real-time status updates
- 💾 LocalStorage data persistence
- 🔒 Basic authentication
- 🔄 Expandable monitor cards
- ⚡ Fast response time tracking

## Installation

### Requirements

- Visual Studio Code
- Live Server extension
- Modern web browser (Chrome, Firefox, Edge, etc.)

### Setup with Visual Studio Code

1. Download and extract the project

2. Open Visual Studio Code

3. Open the project:
   ```
   File -> Open Folder -> select mercury-monitoring folder
   ```

4. Install Live Server extension:
   - Go to Extensions tab (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install Live Server by Ritwick Dey

5. Run the project:
   - Open `index.html`
   - Click "Go Live" in the bottom right
   - Or right-click and select "Open with Live Server"

6. Browser will automatically open `http://127.0.0.1:5500`

## Usage

### Adding a New Monitor

1. Fill in the "Add New Monitor" form:
   - Name: Identifier for the monitor
   - URL: Full URL of the service to monitor
   - Type: HTTP, API, or XML
   - Check Interval: Frequency in minutes

2. Click "Add Monitor"

### Managing Monitors

- Monitor statuses update automatically
- Click on a monitor to view detailed information
- Delete monitors using the trash icon
- Track uptime statistics in the left panel

### Settings

- Click the "Settings" button in the top right
- Configure email notifications
- Save settings

## Project Structure

```
mercury-monitoring/
├── index.html          # Main HTML file
├── login.html          # Login page
├── README.md          # Documentation
├── assets/
│   ├── css/
│   │   └── style.css  # Styles
│   ├── js/
│   │   ├── Monitor.js           # Monitor class
│   │   ├── MercuryMonitoring.js # Main app class
│   │   ├── auth.js             # Authentication
│   │   └── app.js              # App initializer
│   └── img/
│       └── favicon.svg         # Site icon
```

## Development

To develop the project:

1. Open in Visual Studio Code
2. Edit relevant files:
   - HTML: `index.html`, `login.html`
   - Styles: `assets/css/style.css`
   - JavaScript: files in `assets/js/`

3. Live Server will automatically reflect changes

## Debugging

1. Open browser Developer Tools (F12)
2. Check Console tab for logs
3. Monitor network requests in Network tab

## Default Login

- Username: admin
- Password: admin

## Planned Features

- [ ] Email notifications
- [ ] Detailed uptime graphs
- [ ] HTTP header and method support
- [ ] Webhook integrations
- [ ] User accounts
- [ ] API endpoints
- [ ] Custom status check conditions
- [ ] Historical data tracking
- [ ] Export/import functionality

## License

MIT License

## Contact

For questions and support, please open an issue.
