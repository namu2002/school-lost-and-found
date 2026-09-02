# Bright School Lost & Found

A web-based Lost and Found Management System designed to help students and staff report, search for, and manage lost and found items within a school environment.

## Features

* User registration and login
* JWT-based authentication
* Report lost items
* Report found items
* Browse lost and found items
* Search for reported items
* View item details
* Manage reported items
* MongoDB database integration
* Responsive web interface

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* MongoDB Atlas
* JSON Web Token (JWT)
* dotenv

## Project Structure

```text
Brightschoollostandfound/
├── public/              # Frontend files
├── server/              # Backend files
├── .env                 # Environment variables
├── package.json         # Project configuration
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

Before running the project, make sure you have:

* Node.js installed
* npm installed
* A MongoDB Atlas account

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd Brightschoollostandfound
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file and add your environment variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm start
```

The application server runs on:

```text
http://localhost:5000
```

## Development

To run the project in development mode:

```bash
npm run dev:all
```

## Future Improvements

* Email notifications
* Improved item matching
* Image upload and storage
* Advanced search and filtering
* Admin dashboard
* Deployment to a live hosting platform

## Author

**Joy Namunyak**

BSc Information Technology
