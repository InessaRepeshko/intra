# Intra 360° Feedback System - Functionality Documentation

## Overview
This document provides a comprehensive overview of the functionality of the Intra 360° Feedback System, based on the implemented Backend API. The system is designed to facilitate 360-degree performance reviews, manageable via a Role-Based Access Control (RBAC) system.

---

## 1. Authentication & Security Policy
The system uses a secure authentication mechanism integrated with Google OAuth2 and supports role-based permissions.

### **Authentication Methods**
- **Google OAuth2**: The primary authentication method. Users log in using their corporate Google accounts.
  - **Flow**: `GET /auth/google` -> Redirects to Google -> `GET /auth/google/callback` validates the token and creates/updates the user session.
- **Development Login**: A special endpoint (`POST /auth/dev/signin`) available only in non-production environments to simulate login for any user (e.g., for testing different roles).

### **Authorization & Roles**
The system implements strict **Role-Based Access Control (RBAC)**. Supported roles include:
- **ADMIN**: System administrator with full access.
- **HR**: Human Resources manager, capable of managing cycles, users, and organizational structures.
- **MANAGER**: Team lead or manager, can view their team's data and reports.
- **EMPLOYEE**: Standard user, participates in reviews and views their own results.

**Security Features:**
- **Guards**: `AuthSessionGuard` ensures valid sessions, and `RolesGuard` enforces role permissions on specific endpoints.
- **Session Management**: Secure HTTP-only cookies are used for session management.

---

## 2. Organization Management
The system models the company's structure through Users, Teams, and Positions.

### **User Management** (`/identity/users`)
- **Profile**: Stores user details (Name, Email, Status, Roles).
- **CRUD Operations**: Admins and HRs can create, update, and soft-delete users.
- **Role Assignment**: Endpoint to replace or modify user roles (`PUT /identity/users/:id/roles`).

### **Organizational Structure**
- **Teams** (`/organisation/teams`):
  - Teams can be created and managed by HR/Admin.
  - **Members**: Users can be assigned to teams. One user can be a "Primary" member of a team.
- **Positions & Hierarchy** (`/organisation/positions`):
  - Defines job titles (e.g., "Senior Backend Engineer").
  - **Hierarchy**: Supports a tree structure of positions (Superior <-> Subordinate) to automatically determine reporting lines for feedback.

---

## 3. Competence Library
A flexible library to store skills and evaluation criteria used in feedback cycles.

### **Competences & Clusters** (`/library`)
- **Competences**: Individual skills or behaviors to be evaluated (e.g., "Communication", "Code Quality").
- **Clusters**: Groupings of competences for broader analysis (e.g., "Soft Skills", "Technical Skills").
  - Competences are linked to specific positions to tailor reviews.

### **Question Templates**
- **Templates**: Pre-defined questions linked to competences.
- **Types**: Supports various answer types (e.g., Rating Scale, Open Text).
- **Targeting**: Templates can be specific to certain positions or self-assessments.

---

## 4. 360° Feedback System (`/feedback360`)
The core module for running performance review cycles.

### **Cycles**
- **Review Cycles**: HR creates a "Cycle" (e.g., "Q4 2023 Performance Review") with a defined start and end date.
- **Management**: Cycles can be created, updated, and force-finished by HR.

### **Reviews**
A "Review" is a central entity linking a **Subject** (the employee being reviewed) to a **Cycle**.
- **Stakeholders**:
  - **Reviewers**: Peers, Managers, or Subordinates invited to give feedback.
  - **Self-Review**: The subject fills out a self-assessment.
- **Process**:
  1. **Preparation**: HR/Manager adds reviewers and questions to a review.
  2. **Data Collection**: Questions are attached (`POST /reviews/:id/questions`), and respondents submit answers.
  3. **Completion**: Once feedback is gathered, the review is completed (automatically or forced by HR).

### **Feedback Collection**
- **Respondents**: Tracks who has been invited to review and their status (Invited, Responded, Canceled).
- **Answers**: Supports numerical ratings and text comments.

---

## 5. Reporting & Analytics (`/reporting`)
Post-review analysis and feedback presentation.

### **Individual Reports**
- **Report Generation**: Once a review is closed, a Report is generated containing aggregated data.
- **Access**: Employees can view their own reports; Managers and HR can view reports for their subjects.
- **Content**:
  - **Score Summaries**: Average scores per competence and cluster.
  - **Comparisons**: Self-evaluation vs. others' feedback.

### **Analytics & Insights**
- **Cluster Scores**: Visual breakdown of performance across different skill clusters.
- **Text Analytics**:
  - **Anonymized Answers**: Text feedback is aggregated and anonymized to protect respondent identity (`GET /reviews/:id/text-answers`).
  - **Comments**: Managers/HR can add comments or private notes to the report.
  - **Sentiment**: (Potential feature supported by data model) Analysis of text sentiment.

---

## Technical Summary
The backend is built with **NestJS** following **Domain-Driven Design (DDD)** and **Clean Architecture** principles.
- **API Documentation**: Swagger/OpenAPI compliant.
- **Database**: Relational database (likely PostgreSQL via Prisma/TypeORM context).
- **Scalability**: Modular context-based structure allowing independent scaling of "Identity", "Feedback", and "Reporting" domains.
