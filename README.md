# 🏔️ TripBuddy - Wayanad Trip Management App

A comprehensive React application for managing your Wayanad trip with features for expense splitting, document storage, photo memories, and daily scheduling.

## ✨ Features

### 📸 **Memories Tab**

- **Photo Upload**: Drag & drop or click to upload trip photos
- **Auto Compression**: Images automatically compressed to 800px max with 70% quality
- **Storage Options**: Base64 storage (default) or Google Drive integration
- **Social Features**: Like, share, and download photos
- **Compression Stats**: View original vs compressed file sizes

### 📅 **Schedule Tab**

- **Daily Planning**: Schedule from today until September 7th, 2024
- **Task Management**: Add, edit, delete, and complete tasks
- **Priority Levels**: High, Medium, Low with color coding
- **Time Groups**: Tasks organized by time slots
- **Assignment**: Assign tasks to specific team members
- **Statistics**: Track total, completed, and pending tasks

### 💰 **Expense Splitter**

- **Add Expenses**: Track costs with descriptions and categories
- **Split Among Friends**: Automatically calculate splits
- **Bill Images**: Upload photos of receipts
- **Real-time Updates**: All data persists in Convex backend

### ☁️ **Personal Drive**

- **Document Storage**: Upload PDFs, images, and text files
- **Persistent Storage**: Files stored as base64 for persistence
- **View & Download**: In-browser viewing and downloading
- **Categories & Tags**: Organize files with metadata
- **Edit Metadata**: Rename, categorize, and tag documents

### 🏠 **Home Page**

- **Trip Overview**: Beautiful itinerary display
- **Activity Timeline**: Visual representation of trip activities
- **Responsive Design**: Works on all devices

## 🚀 Tech Stack

- **Frontend**: React 18, React Router DOM, Framer Motion
- **Backend**: Convex (Real-time database)
- **Styling**: CSS3 with modern animations
- **File Handling**: React Dropzone, Canvas API for image compression
- **Icons**: React Icons
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd tripBuddy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Convex Backend**

   ```bash
   npx convex dev
   ```

   This will:
   - Create a new Convex deployment
   - Generate `.env.local` with your Convex URL
   - Set up the database schema

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
REACT_APP_CONVEX_URL=your_convex_deployment_url
```

The Convex URL will be automatically generated when you run `npx convex dev`.

### Google Drive Integration (Optional)

For Google Drive storage, add these variables:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_API_KEY=your_google_api_key
```

See `GOOGLE_DRIVE_SETUP.md` for detailed setup instructions.

## 📁 Project Structure

```
tripBuddy/
├── src/
│   ├── components/
│   │   └── Navbar.js          # Navigation component
│   ├── pages/
│   │   ├── Home.js            # Trip overview
│   │   ├── ExpenseSplitter.js # Expense management
│   │   ├── PersonalDrive.js   # Document storage
│   │   ├── Memories.js        # Photo management
│   │   └── Schedule.js        # Task planning
│   ├── convex/
│   │   ├── schema.ts          # Database schema
│   │   ├── expenses.ts        # Expense functions
│   │   ├── documents.ts       # Document functions
│   │   ├── memories.ts        # Memory functions
│   │   └── schedule.ts        # Schedule functions
│   ├── assests/               # Avatar images
│   └── App.js                 # Main app component
├── public/
└── package.json
```

## 🎯 Key Features Explained

### **Image Compression**

```javascript
const compressImage = (file) => {
  // Compresses images to max 800px with 70% quality
  // Reduces file size significantly while maintaining quality
};
```

### **Persistent Storage**

```javascript
// Files stored as base64 for persistence after page refresh
const reader = new FileReader();
reader.readAsDataURL(file);
```

### **Real-time Updates**

```javascript
// All data updates in real-time using Convex
const memories = useQuery(api.memories.getMemories);
const addMemory = useMutation(api.memories.addMemory);
```

## 🚀 Deployment

### **Vercel Deployment**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### **Netlify Deployment**

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

### **Manual Build**

```bash
npm run build
```

The build folder will be created and ready for deployment.

## 📱 Mobile Responsive

The app is fully responsive and works perfectly on:

- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🔒 Data Security

- All data is stored securely in Convex
- No sensitive information is exposed
- Real-time updates with proper authentication
- File uploads are validated and compressed

## 🎨 UI/UX Features

- **Smooth Animations**: Framer Motion for beautiful transitions
- **Modern Design**: Clean, intuitive interface
- **Color Coding**: Priority levels and status indicators
- **Loading States**: Proper feedback for all operations
- **Error Handling**: User-friendly error messages

## 📊 Database Schema

### **Expenses Table**

- title, amount, paidBy, splitBetween, category, description, billImage, date

### **Documents Table**

- name, type, size, category, tags, fileUrl, previewUrl, uploadDate

### **Memories Table**

- title, description, imageUrl, driveUrl, originalSize, compressedSize, uploadDate, likes, tags

### **Tasks Table**

- title, description, time, location, priority, assignedTo, completed, date

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure Convex is running (`npx convex dev`)
3. Verify environment variables are set correctly
4. Check the Convex dashboard for deployment status

## 🎉 Ready for Your Wayanad Trip!

Your TripBuddy app is now ready to help you:

- 📸 Capture and share trip memories
- 📅 Plan daily activities and track progress
- 💰 Split expenses fairly among friends
- ☁️ Store important documents safely
- 🏠 Keep everything organized in one place

## 🚀 Live Demo

Visit the live application: [trip-itinerary-alpha.vercel.app](https://trip-itinerary-alpha.vercel.app)

## 📁 Repository

GitHub: [https://github.com/Vedang22MIC0017/TripItinerary](https://github.com/Vedang22MIC0017/TripItinerary)

Happy travels! 🏔️✨
