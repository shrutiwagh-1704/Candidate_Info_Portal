#Candidate_Info_Portal

# Clone the repository
1. git clone https://github.com/shrutiwagh-1704/Candidate_Info_Portal.git
2. cd Candidate_Info_Portal

# Setup Backend
1. cd server
2. npm install
3. Create a .env file with:
    1. MONGO_URI=your_mongodb_connection_string
       **Note**
       You can get your MongoDB connection string from [MongoDB Atlas]
       Example format:'MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yourDB'
    2. PORT=8080
4. npm start

# Setup Frontend (open new terminal)
1. cd ../client
2. npm install
3. npm run dev

**App will run on: http://localhost:5173**
**Server will run on: http://localhost:8080**
