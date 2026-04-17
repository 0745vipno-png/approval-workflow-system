==================================================
Approval Workflow System
==================================================

A modern full-stack internal approval platform for managing leave requests,
reimbursements, overtime applications, and multi-stage approval processes.

Built with a modular frontend/backend architecture and designed for real
business workflows.

==================================================
FEATURES
==================================================

[Core Workflow]

- Create approval requests
- Save draft requests
- Edit returned requests
- Submit requests into workflow
- View request history
- Track request status
- View approval timeline
- Upload attachments


[Multi-Role Approval Process]

Requester
- Create and manage requests
- Edit drafts / returned items
- Track progress
- Review own history

Manager
- Review pending requests
- Approve requests
- Return requests for revision
- Reject requests
- View request details

HR
- Final review process
- Approve / reject requests
- Handle HR queue
- Review completed cases

Admin
- Dashboard overview
- User management
- Department management
- Role assignment
- Manager mapping
- System data administration


==================================================
LATEST PROJECT STATUS
==================================================

[Completed Modules]

Frontend
- Login page
- Role-based routing
- Request pages
- Manager pages
- HR pages
- Admin pages
- i18n language switch (Chinese / English)
- Responsive UI components
- Global state management

Backend
- RESTful API structure
- Modular route/controller/service architecture
- Authentication API
- Request APIs
- Admin APIs
- Clean folder organization

Admin APIs Completed
- /api/admin/dashboard
- /api/admin/users
- /api/admin/departments
- /api/admin/manager-mappings


==================================================
TECH STACK
==================================================

Frontend
- React
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query

Backend
- Node.js
- Express
- TypeScript
- REST API

Next Phase
- Database persistence layer
- Prisma ORM / SQL integration
- JWT authentication
- Toast notifications
- Validation improvements


==================================================
SYSTEM ROLES
==================================================

Requester : Submit and track requests
Manager   : First-stage approver
HR        : Final reviewer
Admin     : System administrator


==================================================
PROJECT STRUCTURE
==================================================

[Frontend]

frontend/src
├─ components
├─ pages
├─ routes
├─ layouts
├─ store
├─ constants
├─ lib
├─ types
└─ styles


[Backend]

backend/src
├─ controllers
├─ routes
├─ modules
│  └─ admin
│     ├─ users
│     ├─ departments
│     ├─ manager-mappings
│     └─ dashboard
├─ services
├─ repositories
└─ utils


==================================================
GETTING STARTED
==================================================

Install Dependencies
npm install

Run Frontend
npm run dev

Run Backend
npm run dev


==================================================
DEMO ACCOUNTS
==================================================

requester / 1234
manager   / 1234
hr        / 1234
admin     / 1234


==================================================
ROADMAP
==================================================

In Progress
- Database migration
- Persistent data storage

Planned
- JWT auth
- Audit logs
- Export reports
- Notification system
- Better UI feedback
- Deployment


==================================================
LICENSE
==================================================

Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0)

⚠️ **Important Note for Developers & Companies:**
Unlike the standard GPL, the **AGPL-3.0** requires that if you modify this 
system and run it as a web service (SaaS), you **MUST** make your modified 
source code available to your users. 

This ensures that any improvements made to this Approval System remain 
open-source for the community.

==================================================
CONTRIBUTING
==================================================

Issues, pull requests, and suggestions are welcome.

==================================================
DISCLAIMER
==================================================

This project is provided "as is", without warranty of any kind.
