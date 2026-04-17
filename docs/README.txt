# Approval Workflow System

A full-stack approval workflow platform for internal business processes such as leave requests, reimbursements, overtime requests, and multi-role approvals.

## Overview

This project is designed to streamline internal approval operations by providing a structured workflow for employees, managers, HR, and administrators.

It includes:

* Request creation and submission
* Request tracking and status management
* Manager approval actions (approve / return / reject)
* HR final review workflow
* Role-based dashboards
* Administrative management pages
* Frontend and backend integration

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Zustand
* TanStack Query

### Backend

* Node.js
* REST API architecture
* Database integration (customizable)

## Roles

### Requester

* Create requests
* Edit drafts or returned requests
* View request history
* Track approval progress

### Manager

* Review pending requests
* Approve, return, or reject requests
* View request details and timeline

### HR

* Final review and approval
* Handle HR pending items
* Review approval history

### Admin

* User management
* Department management
* Role assignment
* Manager mapping

## Project Structure

```text
src/
├─ components/
├─ pages/
├─ layouts/
├─ routes/
├─ store/
├─ constants/
├─ types/
├─ lib/
└─ styles/
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Run frontend

```bash
npm run dev
```

### Build production version

```bash
npm run build
```

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### Why AGPL-3.0?

AGPL-3.0 is a strong copyleft license designed to protect open-source software, including software used over a network.

This means:

* If someone modifies this project and distributes it, they must also release the source code.
* If someone runs a modified version as a web service, they must provide the modified source code to users of that service.
* Derivative works must remain under the same AGPL-3.0 license.
* The original copyright and license notices must be preserved.

### Why choose it for this project?

This helps prevent closed-source forks of the system while ensuring improvements remain available to the community.

## Contributing

Pull requests, issues, and suggestions are welcome.

## Disclaimer

This project is provided "as is", without warranty of any kind.
