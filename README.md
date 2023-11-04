# Maintenance Management Web Application

The Maintenance Management Web Application is designed to streamline the process of job management, enabling users to submit, track, and update maintenance tasks effectively.

## Features

The application supports the following functionalities:

- **Submit Jobs:**
  Users can submit jobs with detailed descriptions, locations, and priority. Each job is categorized into one of the three statuses: submitted, in progress, or completed.

- **Job List:**
  Displays all jobs ordered by their status and the date they were submitted.

- **Job Update:**
  Provides the ability to update information for individual jobs.

- **Batch Job Status Update:**
  Allows bulk status updates for multiple jobs at once.

- **Job Archival:**
  Enables archiving specific jobs, removing them from the list while retaining their records.

- **Status-based Filtering:**
  Filters and displays jobs based on their status, showing only jobs of a specified status at a time.

## Backend Development

### Mongoose Installation

Mongoose, a MongoDB object modeling tool, is integrated into the project for handling interactions with the database.

### Code Structure

The back-end code is structured into two key directories:

- **models:** Contains the necessary data models for jobs.
- **controllers:** Manages the business logic and CRUD operations for the application.

### User Management and Permissions

This application primarily focuses on job management functionalities and does not involve user management or permission control.

## Usage Instructions

1. Clone or download the repository excluding the 'node_modules' directory.
2. Configure and set up the necessary environment variables and MongoDB connections.
3. Run the application.
4. Access the provided endpoints to perform job management actions such as job submission, update, archiving, and status-based filtering.

## Important Note

For data security and privacy reasons, sensitive details and keys are not included in this public README.

## License

The project operates under the guidelines of the MIT License, encouraging exploration, customization, and educational use.

Feel free to contribute, enhance, or utilize the code for your learning and development.

