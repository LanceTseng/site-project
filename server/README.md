# HR Management System

This is a comprehensive Human Resources management system designed to streamline employee onboarding, offboarding, and various internal administrative processes.

## Features

*   **Employee Management:** Manage employee information and records.
*   **Onboarding & Offboarding:** Dedicated workflows for new hires and departing employees.
*   **Task Management:** Create, assign, and track parent and sub-tasks.
*   **Asset Management:** Track company equipment and its assignment history.
*   **Document Management:** Upload and manage important documents.
*   **Access Provisioning:** Control user access to various systems and resources.
*   **Training Modules:** Manage and track employee training programs.
*   **Form Builder:** Design and manage dynamic forms for various purposes.
*   **Role-Based Dashboards:** Customized views for Employees, HR, and IT departments.
*   **Reporting:** Generate reports on tickets, user payments, tasks, and training.

## Technologies Used

*   **Backend:**
    *   [Node.js](https://nodejs.org/)
    *   [Express.js](https://expressjs.com/)
    *   [Sequelize](https://sequelize.org/) (ORM for PostgreSQL)
    *   [PostgreSQL](https://www.postgresql.org/)
    *   [JSON Web Tokens (JWT)](https://jwt.io/) for authentication
*   **Frontend:**
    *   [EJS (Embedded JavaScript templates)](https://ejs.co/)
*   **File Handling:**
    *   [Multer](https://github.com/expressjs/multer) for file uploads
*   **Utilities:**
    *   [Winston](https://github.com/winstonjs/winston) for logging
    *   [date-fns](https://date-fns.org/) for date manipulation

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd NCT-Assignment
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Set up Environment Variables:**
    While in the `server` directory, create a `.env` file. You can use `.env-temp` as a template.
    ```bash
    # Make sure you are in the 'server' directory
    # Create a copy of the template
    cp .env-temp .env
    ```
    Next, open the `.env` file and fill in your database credentials and a secret for JWT:
    ```
    DB_USER=your_db_user
    DB_HOST=your_db_host
    DB_DATABASE=your_db_name
    DB_PASSWORD=your_db_password
    DB_PORT=your_db_port
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run the application:**
    *   To run the server for development (with automatic restarts on file changes):
        ```bash
        npm run dev
        ```
    *   To run the server for production:
        ```bash
        npm start
        ```
    The application should now be running at `http://localhost:3000` (or your configured port).

## Project Structure

```
server/
├───config/         # Database configuration
├───controllers/    # Handles business logic and request handling
├───middlewares/    # Custom middleware (e.g., logging, file uploads)
├───models/         # Sequelize models for database tables
├───public/         # Static assets (CSS, JavaScript, images)
├───repositories/   # Data access layer, interacts with models
├───routes/         # Express route definitions
├───views/          # EJS templates for the user interface
└───server.js       # Main application entry point
```