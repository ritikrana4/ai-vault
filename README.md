# AI Document Vault

An AI-powered document management system that automatically generates summaries and markdown versions of uploaded documents using Gen AI.

## Features

- **Document Management**: Upload, organize, and manage documents in a clean, intuitive interface
- **AI Processing**: Automatic generation of document summaries and markdown versions using Gen AI
- **Folder Organization**: Create nested folders to organize your documents
- **Search**: Search through your documents
- **Document Viewer**: View AI summaries, and markdown versions side-by-side
- **Drag & Drop**: Easy file upload with drag-and-drop support
- **Real-time Progress**: Track upload and processing status in real-time

##  Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** (for database and file storage)
- **OPEN AI API Key**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai_vault
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env

OPENAI_API_KEY=""
PORT=3001
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

#### Start the Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Architecture & Design Choices

### Technology Stack

**Frontend:**
- **React + TypeScript**: Type-safe component development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS for rapid UI development
- **@tailwindcss/typography**: Beautiful typography for markdown rendering
- **React Markdown**: Render AI-generated markdown

**Backend:**
- **Node.js + Express**: Fast, minimalist web framework
- **TypeScript**: Type safety and better developer experience
- **LangChain**: AI integration framework for document processing
- **Multer**: File upload handling
- **Supabase**: Database and file storage (PostgreSQL + S3-compatible storage)

**AI Integration:**
- **Open AI**: High-quality document summarization and markdown conversion

### Design Decisions

#### 1. **Separation of Concerns**

The application follows a clear separation between frontend and backend:
- **Frontend**: Focuses on UI/UX, state management, and user interactions
- **Backend**: Handles file processing, AI integration, and data persistence

#### 2. **Component Architecture**

Frontend components are organized by feature:
- `components/`: Reusable UI components (Button, Modal, Spinner, etc.)
- `pages/`: Page-level components (Dashboard)
- `hooks/`: Custom React hooks for data fetching and state management
- `services/`: API communication layer
- `context/`: Global state management

#### 3. **File Storage Strategy**

- **Original files**: Stored in Supabase Storage (S3-compatible)
- **Metadata & AI output**: Stored in PostgreSQL database
- **Temporary files**: Used during processing, then cleaned up automatically

#### 4. **AI Processing Pipeline**

Documents are processed in parallel:
1. **Summary Generation**: Creates a concise 4-5 sentence summary
2. **Markdown Conversion**: Converts document to clean, structured markdown
3. Both operations run simultaneously for faster processing

#### 5. **Folder Organization**

- Supports nested folder structures
- Root-level view shows all documents from all folders
- Folder-specific views show only relevant documents and subfolders
- Breadcrumb navigation for easy traversal (hidden in root view)

#### 6. **Real-time Feedback**

- Upload progress tracking
- Processing status indicators
- Error handling with user-friendly messages
- Loading states for better UX


## Usage

1. **Upload Documents**: Click "Upload" or drag & drop files onto the upload zone
2. **Create Folders**: Click "New Folder" to create a folder for organization
3. **View Documents**: Click on any document card to view:
   - AI-generated summary
   - Markdown version
   - Original file metadata
4. **Navigate Folders**: 
   - Use the sidebar to browse folders
   - Click "All Files" to see all documents
   - Click breadcrumbs to navigate back



## Project Structure

```
ai_vault/
├── backend/
│   ├── src/
│   │   ├── config.ts      # Configuration & AI setup
│   │   ├── services.ts    # Business logic
│   │   ├── routes.ts      # API routes
│   │   ├── types.ts       # TypeScript types
│   │   └── index.ts       # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── context/       # State management
│   │   ├── constants/     # App constants
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── README.md
```

