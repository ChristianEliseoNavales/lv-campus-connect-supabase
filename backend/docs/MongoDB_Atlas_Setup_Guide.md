# MongoDB Atlas Connection Setup Guide

## Current Status
✅ **MongoDB Atlas connection configuration is correct**  
❌ **IP Address not whitelisted in MongoDB Atlas**

## Issue Diagnosis
The connection test revealed that the MongoDB Atlas cluster is rejecting connections because the current IP address is not whitelisted in the Atlas security settings.

## Solution Steps

### Step 1: Whitelist Your IP Address in MongoDB Atlas

1. **Log into MongoDB Atlas**
   - Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
   - Sign in with your MongoDB Atlas account

2. **Navigate to Network Access**
   - In the left sidebar, click on "Network Access"
   - This is under the "Security" section

3. **Add Your Current IP Address**
   - Click the "ADD IP ADDRESS" button
   - Choose one of these options:
     
     **Option A: Add Current IP (Recommended for development)**
     - Click "ADD CURRENT IP ADDRESS"
     - This will automatically detect and add your current public IP
     
     **Option B: Allow Access from Anywhere (NOT recommended for production)**
     - Click "ALLOW ACCESS FROM ANYWHERE"
     - This adds `0.0.0.0/0` which allows all IPs (use only for testing)
     
     **Option C: Add Specific IP Range**
     - Enter your specific IP address or range
     - You can find your public IP at [https://whatismyipaddress.com](https://whatismyipaddress.com)

4. **Save the Configuration**
   - Add a comment like "Development Machine" or "Local Testing"
   - Click "Confirm"
   - Wait for the changes to propagate (usually takes 1-2 minutes)

### Step 2: Verify Database User Permissions

1. **Go to Database Access**
   - In the left sidebar, click on "Database Access"
   - This is also under the "Security" section

2. **Check User Permissions**
   - Verify that the user `lvcampusconnect_db_user` exists
   - Ensure it has the following permissions:
     - **Database**: `lvcampusconnect` (or `admin` for full access)
     - **Role**: `readWrite` or `dbAdmin`

3. **If User Doesn't Exist, Create One**
   - Click "ADD NEW DATABASE USER"
   - Choose "Password" authentication
   - Username: `lvcampusconnect_db_user`
   - Password: `Cx0IZV4UN0HTJIRy` (or generate a new secure password)
   - Database User Privileges: Select "Built-in Role" → "Read and write to any database"
   - Click "Add User"

### Step 3: Test the Connection Again

After whitelisting your IP address, run the connection test:

```bash
npm run test:connection
```

If successful, you should see:
```
✅ Connection successful!
📊 Database: lvcampusconnect
🎉 MongoDB Atlas connection is working!
```

### Step 4: Run the Database Seed Script

Once the connection test passes, run the seed script:

```bash
npm run seed
```

This will:
- Connect to MongoDB Atlas
- Clear existing data (if any)
- Create all necessary collections
- Insert sample data for testing
- Display a summary of created records

## Alternative Solutions

### If IP Whitelisting Doesn't Work

1. **Check Your Network Configuration**
   - If you're behind a corporate firewall, contact your IT department
   - Some networks block MongoDB Atlas ports (27017)
   - Try connecting from a different network (mobile hotspot, home network)

2. **Use MongoDB Compass for Testing**
   - Download [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Use the same connection string to test connectivity
   - This helps isolate whether it's a Node.js/Mongoose issue or network issue

3. **Update Connection String**
   - Try using the connection string without the database name:
   ```
   mongodb+srv://lvcampusconnect_db_user:Cx0IZV4UN0HTJIRy@lvcampusconnect.ffhtqzt.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Check Cluster Status**
   - In MongoDB Atlas, go to "Clusters"
   - Ensure your cluster is in "Running" state
   - If it's paused, click "Resume" to start it

## Security Best Practices

### For Development
- Whitelist only your specific IP address
- Use a dedicated development database
- Rotate passwords regularly

### For Production
- Never use `0.0.0.0/0` (allow all IPs)
- Whitelist only your server's IP addresses
- Use strong, unique passwords
- Enable additional security features like VPC peering
- Set up monitoring and alerts

## Connection String Format

The current connection string format is correct:
```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```

Where:
- `username`: `lvcampusconnect_db_user`
- `password`: `Cx0IZV4UN0HTJIRy`
- `cluster`: `lvcampusconnect.ffhtqzt.mongodb.net`
- `database`: `lvcampusconnect`
- `options`: SSL, retry settings, etc.

## Troubleshooting Commands

```bash
# Test MongoDB Atlas connection
npm run test:connection

# Seed the database (after successful connection)
npm run seed

# Start the backend server
npm run dev

# Clear and re-seed the database
npm run seed:clear
```

## Next Steps

1. ✅ Whitelist IP address in MongoDB Atlas
2. ✅ Run connection test (`npm run test:connection`)
3. ✅ Run database seed script (`npm run seed`)
4. ✅ Start backend server (`npm run dev`)
5. ✅ Test API endpoints from frontend

Once these steps are completed, your University Kiosk System will be fully connected to MongoDB Atlas and ready for development and testing.
