
DROP DATABASE IF EXISTS speakit_db;
CREATE DATABASE speakit_db;
USE speakit_db;

CREATE TABLE Users(
  id INTEGER AUTO_INCREMENT NOT NULL,
  user_name VARCHAR(300) UNIQUE, 
  user_email VARCHAR(250),
  password Varchar(300),
  createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY (id)
);

CREATE TABLE Posts (
    id INTEGER AUTO_INCREMENT NOT NULL,
    post_text VARCHAR(300),
    tags VARCHAR (100),
    views VARCHAR (100),
    title VARCHAR(100),
    categories VARCHAR (100),
 createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY (id)
);

CREATE TABLE Subspeaks (
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(300),
  views VARCHAR(100),
  description VARCHAR(100),
  numberofsubs VARCHAR(100),
  icon VARCHAR(100),
   createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY (id)
);

CREATE TABLE SubbedSubspeaks (
  id INTEGER AUTO_INCREMENT NOT NULL,
  subspeak_id INTEGER,
  subspeak_name VARCHAR(300)
  subspeak_description VARCHAR(100),
  user_id INTEGER,
  createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY (id)
);

CREATE TABLE Comments(
  id INTEGER AUTO_INCREMENT NOT NULL,
  comments VARCHAR(300),
  voting VARCHAR(100),
 createdAt DATE,
  updatedAt DATE,
  PRIMARY KEY (id)
)
