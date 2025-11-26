# 🗺️ DC Searcher

> **Find Distribution Centers - Fast, Visual, and Intelligent**

A modern web application for discovering and analyzing distribution centers (DCs) based on proximity, travel time, and route optimization. Built with real-time Firebase integration and interactive mapping capabilities.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://jonekaa.github.io/DC-Searcher/)
[![Firebase](https://img.shields.io/badge/Firebase-10.12.2-orange)](https://firebase.google.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-green)](https://leafletjs.com/)

---

## ✨ Features

### 🔍 **Smart Search**
- **Autocomplete Suggestions**: Type-ahead search with real-time DC name and location ID matching
- **Flexible Queries**: Search by company name (PT) or location identifier
- **Keyboard Navigation**: Full arrow key and Enter support for quick selection

### 📍 **Proximity Analysis**
- **Radius-Based Search**: Find all DCs within a specified distance (in kilometers)
- **Duration Filtering**: Filter results by travel time (HH:MM format)
- **Visual Mapping**: Interactive Leaflet map with custom markers and radius circles
- **Distance Calculation**: Precise haversine distance computation

### 🛣️ **Route Optimization**
- **Multi-Point Routing**: Compare multiple DCs with visual route overlays
- **Interactive Selection**: Click to add/remove DCs from comparison
- **Route Visualization**: Color-coded paths with Leaflet Routing Machine
- **Clear Comparison**: One-click reset for route selections

### 📊 **Data Management** (Admin Panel)
- **Secure Authentication**: Firebase Auth with email/password
- **Dual Upload Modes**: CSV file upload or manual data entry
- **Real-time Sync**: Live updates using Firestore snapshots
- **CRUD Operations**: Full create, read, update, delete for DCs and durations
- **Batch Processing**: Efficient bulk uploads with validation

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Loading States**: Smooth transitions and spinner animations
- **Error Handling**: User-friendly error messages
- **Search Filtering**: Real-time list filtering in results

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project with Firestore enabled
- Basic understanding of HTML/JavaScript

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonekaa/DC-Searcher.git
   cd DC-Searcher
   ```

2. **Configure Firebase**
   
   Update `js/firebaseConfig.js` with your Firebase credentials:
   ```javascript
   export const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

3. **Set up Firestore Collections**
   
   Create two collections in your Firebase project:
   - `dcs` - Distribution center data
   - `durations` - Travel time/distance matrix

4. **Serve the application**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Or open index.html directly in your browser
   ```

5. **Access the app**
   - Main search: `http://jonekaa.github.io/DC-Searcher/`

---

## 📁 Project Structure

```
DC-Searcher/
├── index.html              # Main search interface
├── manage/
│   ├── DC_Manager.html     # Admin data management panel
│   └── css/
│       └── manage_style.css
├── css/
│   └── style.css           # Main application styles
├── js/
│   ├── app.js              # Core application logic
│   ├── ui.js               # UI rendering and interactions
│   ├── utils.js            # Utility functions
│   └── firebaseConfig.js   # Firebase configuration
└── README.md
```

---

## 🗄️ Data Schema

### DC Collection (`dcs`)
```javascript
{
  id: number,           // Unique identifier
  name: string,         // DC name (e.g., "DC_JAKARTA")
  loc: string,          // Location code
  lat: number,          // Latitude
  lon: number,          // Longitude
  fpallet: number,      // Food pallet demand/day
  fpalletcap: number,   // Food pallet capacity
  nfpallet: number,     // Non-food pallet demand/day
  nfpalletcap: number   // Non-food pallet capacity
}
```

### Durations Collection (`durations`)
```javascript
{
  durations: {
    [destinationName]: {
      km: string,       // Distance (e.g., "120 KM")
      duration: string  // Travel time (e.g., "2 hours 15 minutes")
    }
  }
}
```

---

## 🔧 Technology Stack

| Technology | Purpose |
|------------|---------|
| **Firebase** | Backend-as-a-Service (Authentication, Firestore) |
| **Leaflet.js** | Interactive mapping and geolocation |
| **Leaflet Routing Machine** | Route calculation and visualization |
| **Tailwind CSS** | Utility-first styling framework |
| **Vanilla JavaScript** | Core application logic (ES6+) |

---

## 🎯 Usage Examples

### Searching for Nearby DCs
1. Type a DC name or location ID in the search box
2. Select from autocomplete suggestions
3. Enter desired radius (e.g., `200` km)
4. Optionally set max duration (e.g., `04:30`)
5. Click **Find DC** to see results on map and list

### Comparing Multiple DCs
1. Perform a search to get results
2. Click **Add to Compare** on desired DCs
3. View optimized routes on the map
4. Use **Clear Selection** to reset

### Managing DC Data (Admin)
1. Navigate to `/manage/DC_Manager.html`
2. Log in with credentials
3. Choose **Upload File** or **Input Manually**
4. For CSV: Select file and click upload
5. For manual: Fill form and proceed through steps
6. Use **Edit Data** tab to modify existing entries

---

## 🔐 Security Notes

- Firebase security rules should be configured to restrict write access
- Admin credentials should be stored securely (not in code)
- Consider implementing role-based access control (RBAC)
- Use environment variables for sensitive configuration in production

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **Leaflet** - For the amazing mapping library
- **Firebase** - For the robust backend infrastructure
- **Tailwind CSS** - For the beautiful utility classes
- **OpenStreetMap** - For the map tiles

---

## 📧 Contact

**Project Maintainer**: [Jonathan Eka](https://github.com/jonekaa)

**Project Link**: [https://github.com/jonekaa/DC-Searcher](https://github.com/jonekaa/DC-Searcher)

---

<div align="center">
  
**⭐ Star this repo if you find it useful!**

Made with ❤️ for logistics optimization

</div>
