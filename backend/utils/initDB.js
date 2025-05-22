require('dotenv').config({ path: '../.env' });  // Si .env está un nivel arriba
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    await conn.query(`
      DROP DATABASE IF EXISTS ${process.env.DB_NAME};
      CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      USE ${process.env.DB_NAME};

      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role ENUM('standard', 'admin') DEFAULT 'standard',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE token_blacklist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        expired_at DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 DAY)
      );

      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

      CREATE TABLE orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total DECIMAL(10,2),
        status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT,
        price DECIMAL(10,2),
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE order_status_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );

      INSERT INTO categories (name) VALUES ('Tecnología'), ('Moda'), ('Hogar');
    `);

    console.log('✅ Base de datos miniecommerce creada correctamente.');
    await conn.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
})();
