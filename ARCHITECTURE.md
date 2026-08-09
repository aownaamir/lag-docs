## Overview

Lag Docs is a small full-stack document editor built with Next.js, React, TypeScript, Tiptap, and MongoDB.

The main goal was to build the complete document workflow, including creating, editing, saving, importing, and sharing documents, within the assessment time limit.

## Architecture

Next.js is used for both the frontend and backend.

```text
Browser
   │
   │ React / Tiptap
   ▼
Next.js App Router
   │
   │ API Routes
   ▼
MongoDB
```

## Frontend

The frontend is built with React and Next.js.

The main components are:

- Dashboard, document list and document creation
- Editor, document editing and formatting
- File Upload, `.txt` and `.md` import
- Share Dialog, document sharing
- Login, demo user selection

Tiptap is used for the document editor and provides the required formatting features.

## Backend

The backend uses Next.js API routes.

The API handles:

- Creating documents
- Loading documents
- Updating documents
- Listing documents
- Sharing documents
- Listing users

The API checks the current user before allowing access to documents.

## Database

MongoDB is used for persistence through Mongoose.

The main models are:

```text
User
 ├── _id
 ├── name
 └── email

Document
 ├── _id
 ├── title
 ├── content
 ├── owner
 ├── sharedWith[]
 ├── createdAt
 └── updatedAt
```

Document content is stored as HTML from Tiptap. This keeps the formatting when a document is reopened.

## Authentication and Access

The authentication is intentionally simple for this assessment.

Users are seeded in the database and selected from the login page. The selected user is stored in `localStorage`, and the user ID is sent with API requests.

A user can access a document if they are the owner or if the document has been shared with them.

Only the owner can share the document with another user.

A full authentication system was not added because it was not necessary for demonstrating the main document and sharing workflows.

## File Import

The application supports `.txt` and `.md` files.

The file is read in the browser and converted into basic HTML before being sent to the document API.

The Markdown import currently supports:

- H1 headings
- H2 headings
- Unordered lists
- Paragraphs

This keeps file import simple without adding a large document processing dependency.

## Saving

Document changes are saved automatically after a short delay.

```text
User edits
    ↓
Tiptap update
    ↓
800ms delay
    ↓
PATCH /api/documents/:id
    ↓
MongoDB
```

The delay prevents a database request from being sent for every keystroke.

The editor also shows the current save status.

## Scope

The main priority was to get the important workflows working end to end.

Prioritized:

- Document creation
- Rich-text editing
- Persistence
- File import
- Document sharing
- Basic validation
- Error handling
- Deployment

Not included:

- Real-time collaboration
- Full authentication
- Version history
- Comments
- Suggestions
- Advanced permissions
- `.docx` and PDF processing

These are possible future additions if more development time is available.

## Deployment

The application is deployed on Vercel and uses MongoDB for persistence.

Live application:

https://lag-docs.vercel.app/

## Summary

The project keeps the architecture simple by using Next.js for the frontend and API layer, Tiptap for editing, and MongoDB for persistence.

This was enough to cover the main product requirements without adding unnecessary services or complexity.
