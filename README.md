# College Management System

A role based backend system designed to manage courses, users, and roles (Admin, Faculty, and Student) efficiently. This system allows administrators to perform CRUD operations on courses, manage user roles, and facilitate course enrollment for faculty and students.

## Features

### Admin
- Create, Update, and Delete courses.
- Assign courses to faculty members.
- Unassign courses from faculty members.
- Promote users to faculty role.
- Demote faculty members to student role.
- Allocate courses to students.

### Faculty
- Update details of assigned courses.
- Enroll students in their courses.
- Remove students from their courses.

### Student
- View courses they are enrolled in.

## Technologies Used
- **Backend Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication Middleware**: Custom JWT-based system

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/MohdMusaiyab/vrv-security-assingment
2. Navigate to backend directory
   ```bash
      cd vrv-security-assingment/server
3. Install all the necessary dependencies
    ```bash
      npm insatll
4. Setup the .env file according to the .env.sample file
5. Run Prisma migrations
   ```bash
      npx prisma migrate dev
6. Start the application
``` bash
npm run dev
```
#Example of Few API Routes
## API Endpoints

### Admin Routes

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| POST   | `/admin/create-course`                  | Create a new course.           |
| DELETE | `/delete-course/:courseId`       | Delete a course.               |
| PUT    | `/update-course/:courseId`       | Update a course.               |
| POST   | `/assign-course-to-faculty`      | Assign a course to a faculty.  |
| DELETE | `/unassign-course-from-faculty`  | Unassign a course from a faculty.|
| PUT    | `/promote-to-faculty/:userId`    | Promote a user to faculty.     |
| PUT    | `/demote-from-faculty/:userId`   | Demote a faculty to student.   |

### Faculty Routes

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| POST   | `/enroll-student/:courseId`      | Enroll a student in a course.  |
| DELETE | `/remove-student/:courseId`      | Remove a student from a course. |

### Student Routes

| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/:studentId/courses`            | View enrolled courses.          |
       
