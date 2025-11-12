# Candidate_Info_Portal
A full-stack web application for collecting candidate information, resumes, and video submissions using React, Node.js, and MongoDB.

# Clone the repository
1. git clone https://github.com/shrutiwagh-1704/Candidate_Info_Portal.git
2. cd Candidate_Info_Portal

# Setup Backend
1. cd server
2. npm install
3. Create a .env file with:
    1. MONGO_URI=your_mongodb_connection_string
       1. Go to MongoDB Atlas and log in or create a free account.
       2. Create a new Cluster (you can use the free tier).
       3. Click Connect → Connect your application.
       4. Copy the provided connection string.
       Example format:'MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yourDB'
    3. PORT=8080
4. npm run dev

# Setup Frontend (open new terminal)
1. cd ../client
2. npm install
3. npm run dev

1. **open this link in browser: http://localhost:5173**
2. **App will run on: http://localhost:5173**
3. **Server will run on: http://localhost:8080**
