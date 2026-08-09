# Lag Docs

Lag Docs is a small collaborative document editor built for the Full Stack Product Engineer assessment.

Users can create documents, edit them with basic rich-text formatting, import `.txt` and `.md` files, and share documents with other users.

**Live application:** https://lag-docs.vercel.app/

## Features

### Documents

- Create new documents
- Rename documents
- Edit documents in the browser
- Automatically save changes
- Reopen documents after refreshing
- Bold, italic, and underline
- H1 and H2 headings
- Bulleted lists
- Numbered lists

### File Import

Users can import:

- `.txt`
- `.md`

The imported file is converted into an editable document.

The Markdown import currently supports basic headings, unordered lists, and normal paragraphs.

### Sharing

Each document has an owner.

The owner can share a document with another user. Shared documents appear in a separate **Shared With Me** section.

The application uses seeded demo users instead of a full authentication system to keep the scope focused on the main product requirements.

### Persistence

Documents and sharing information are stored in MongoDB.

Document content is stored as HTML from the Tiptap editor so that formatting is preserved when the document is reopened.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Tiptap
- MongoDB
- Mongoose
- Vercel

## Getting Started

### Requirements

- Node.js 18 or newer
- npm
- MongoDB

MongoDB Atlas can be used for the database.

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd lag-docs
```

Install the dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
```

### Run locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Select one of the available demo users to enter the application.

## Environment Variables

The application requires one environment variable:

| Variable      | Description               |
| ------------- | ------------------------- |
| `MONGODB_URI` | MongoDB connection string |

Do not commit `.env.local` or database credentials to the repository.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Runs the lint checks.

## Main Application Flow

The main flow is:

```text
Login
  ↓
Workspace
  ↓
Create or Import Document
  ↓
Edit Document
  ↓
Auto-save
  ↓
Share Document
  ↓
Other User Opens Shared Document
```

## Project Structure

The main application files are organized as follows:

```text
app/
├── api/
│   ├── documents/
│   └── users/
├── documents/
│   └── [id]/
├── login/
└── page.tsx

components/
├── Dashboard.tsx
├── DocumentCard.tsx
├── Editor.tsx
├── FileUpload.tsx
├── ShareDialog.tsx
├── Toolbar.tsx
└── UserSwitcher.tsx

lib/
├── auth.ts
├── db.ts
└── models/
    ├── Document.ts
    └── User.ts
```

## Data Model

### User

```text
_id
name
email
```

### Document

```text
_id
title
content
owner
sharedWith[]
createdAt
updatedAt
```

`owner` stores the document owner.

`sharedWith` stores users who have access to the document.

## Access

The current user can access a document if they are:

- The document owner
- Included in the document's `sharedWith` list

Only the owner can share a document with another user.

The authentication system is intentionally simple for this assessment. The selected demo user is stored in `localStorage`, and the user ID is sent with API requests.

## Scope Decisions

The main goal was to complete the core product flow within the 4 to 6 hour time limit.

The following were prioritized:

- Document creation
- Rich-text editing
- Persistence
- File import
- Sharing
- Basic validation and error handling
- Deployment

The following were left out:

- Full authentication
- Real-time collaboration
- Version history
- Comments
- Suggestions
- Advanced sharing permissions
- `.docx` support
- PDF import and export
- Notifications

These could be added in a future version.

## Deployment

The application is deployed on Vercel.

Live application:

https://lag-docs.vercel.app/

MongoDB is used as the persistent database, with the connection string configured through the deployment environment.

## Limitations

Authentication is intended for the assessment and is not production-ready.

File import is limited to `.txt` and `.md`.

Markdown parsing is basic and only handles a small set of common elements.

Sharing currently provides basic access without separate viewer and editor roles.

## Summary

The project focuses on a small but complete document workflow. The main functionality works across the frontend, API layer, and database, while more advanced features were left out to keep the implementation focused and within the assessment time limit.
