# Pollpit

Pollpit is a web application where users can create and participate in polls, comment on them, and engage in discussions.



## Schema Diagram

![image](/public//pngSchema.png) 

## Database Schema

The database schema for Pollpit is designed to efficiently manage users, polls, comments, and their relationships. Here's an overview of the schemas:

### User Schema

The User schema stores information about registered users, including their name, email, password (hashed),  profile picture , the polls on which they voted and the poll created by the user.

### Poll Schema

The Poll schema represents individual polls created by users. It contains fields such as the poll question, options, creator (reference to User schema).

### Comment Schema

The Comment schema allows users to leave comments on polls. It includes fields for the comment content, postedBy (reference to User schema), poll (reference to Poll schema).

These schemas are interlinked as follows:

- Each Poll is associated with a User who created it.
- Comments are linked to both Users (authors) and Polls.

## Setup Guide

Follow these steps to set up the Pollpit project on your local machine:

### Prerequisites

Ensure you have the following installed:

- Node.js (v12.x or higher)
- MongoDB
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pollpit.git
```

2. Jump to pp-server

```bash
cd pp-server
```

3. Install the dependencies 
```bash
npm install
```

4. Create an .env file and configure the environment Variables i.e MONGO_DB ( containing the database connection uri )

5. Run the server
```bash
nodemon --env-file .env index.js
```

6. Proceed to the [frontend Repository](https://github.com/AmanSharma061/pp-client) to See the further steps 