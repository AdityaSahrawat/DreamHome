-- CREATE DATABASE dreamhome;

USE dreamhome;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('client', 'manager', 'supervisor', 'assistant') NOT NULL
);

CREATE TABLE branch (
    branch_id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client') DEFAULT 'client',
    branch_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE staffApplications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('manager', 'supervisor', 'assistant') NOT NULL,
    branch_id INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    temp_password VARCHAR(255), 
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE Staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('manager', 'supervisor', 'assistant') NOT NULL,
    branch_id INT,
    password VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role ENUM('client', 'manager', 'supervisor', 'assistant') NOT NULL,
    branch_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('owner') DEFAULT 'owner',
    branch_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
)

CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  agent_id INT,
  branch_id INT,
  description TEXT,
  price DECIMAL(15,2) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC(4,1) NOT NULL,
  sqft DECIMAL(10,2) NOT NULL,
  year_built INTEGER,
  status ENUM('pending', 'approved', 'rejected', 'sold', 'rented') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES Staff(id) ON DELETE CASCADE,
  FOREIGN KEY (branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);

CREATE TABLE property_photos (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL,  
  photo_url VARCHAR(255),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE viewrequests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  property_id INT NOT NULL,
  assistant_id INT,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  scheduled_time DATETIME NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES Users(user_id),
  FOREIGN KEY (property_id) REFERENCES Properties(property_id),
  FOREIGN KEY (assistant_id) REFERENCES Users(user_id)
);

CREATE TABLE lease_draft (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  client_id INT NOT NULL,
  current_terms JSON NOT NULL, 
  status ENUM('draft','client_review','manager_review','approved','signed'),
  version INT DEFAULT 1,
  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE negotiations (
  id int INT KEY AUTO_INCREMENT 
  draft_id int 
  proposed_terms json 
  status enum('pending','accepted','rejected','countered') 
  client_id int 
  staff_id int 
  staff_response json 
  response_message text 
  previous_negotiation_id int 
  created_at timestamp 
  responded_at timestamp 
  message text
  FOREIGN KEY (draft_id) REFERENCES lease_drafts(id)
);

CREATE TABLE leases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  draft_id INT NOT NULL,
  final_terms JSON NOT NULL,
  signed_by_client BOOLEAN DEFAULT FALSE,
  signed_by_agent BOOLEAN DEFAULT FALSE,
  active_from DATE NOT NULL,
  FOREIGN KEY (draft_id) REFERENCES lease_draft(id)
);
