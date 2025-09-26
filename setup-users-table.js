import { pool } from "./db/cn.js";

async function setupUsersTable() {
  try {
    console.log("Setting up users table...");
    
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        profile_pic VARCHAR(500) DEFAULT ''
      )
    `);
    
    console.log("✅ Users table ready!");
    
    // Check if Liana user exists, if not create it
    const [existing] = await pool.query("SELECT * FROM users WHERE username = ?", ["Liana"]);
    
    if (existing.length === 0) {
      // Create Liana user with bcrypt hash
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash("12345", 10);
      
      await pool.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ["Liana", "liana@example.com", hashedPassword, "admin"]
      );
      
      console.log("✅ Created user: Liana with password: 12345");
    } else {
      console.log("ℹ️  User Liana already exists");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupUsersTable();