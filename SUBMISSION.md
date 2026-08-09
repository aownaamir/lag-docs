# Lag Docs Submission

## Live Application

https://lag-docs.vercel.app/

## Source Code

https://github.com/aownaamir/lag-docs

## Documentation

- `README.md`
  Setup instructions, features, project structure, and scope.

- `ARCHITECTURE.md`
  Short overview of the application architecture and main technical decisions.

- `AI_WORKFLOW.md`
  Summary of how AI tools were used during development.

## Demo Users

The application provides seeded demo users on the login screen.

Select any user to enter the application.

To test sharing:

1. Log in as one user.
2. Create or open a document.
3. Select **Share**.
4. Select another user.
5. Log out using the user switcher.
6. Log in as the second user.
7. Open the document from **Shared With Me**.

## Supported File Import

The application supports:

- `.txt`
- `.md`

## Main Features

- Create documents
- Rename documents
- Rich-text editing
- Bold, italic, underline
- H1 and H2 headings
- Bulleted and numbered lists
- Automatic saving
- Document persistence
- `.txt` and `.md` import
- Document sharing
- Owned and shared document sections

## Deployment

The application is deployed on Vercel and uses MongoDB for persistence.

## Included Files

```text
lag-docs/
├── Source Code
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
├── SUBMISSION.md
└── walkthrough-video.txt
```

## Known Limitations

The current version does not include:

- Full user authentication
- Real-time collaboration
- Document version history
- Comments or suggestions
- Advanced sharing permissions
- `.docx` or PDF import
