
DROP DATABASE IF EXISTS speakit_db;
CREATE DATABASE speakit_db;
USE speakit_db;

CREATE TABLE Users(
  user_id INTEGER AUTO_INCREMENT NOT NULL,
  user_name VARCHAR(300),
  user_email VARCHAR(250),
  password Varchar(20),
  FOREIGN KEY savedsp(sp_id)
  REFERENCES subspeaks(sp_id)
  FOREIGN KEY savedpost(post_id)
  REFERENCES savedpost(post_id)

  PRIMARY KEY (user_id)
)

CREATE TABLE Posts (
    post_id INTEGER AUTO_INCREMENT NOT NULL,
    post_text VARCHAR(300),
    tags VARCHAR (100),
    views VARCHAR (100),
    title VARCHAR(100),
    categories VARCHAR (100),
    FOREIGN KEY whopost(user_id)
    REFERENCES whopost(user_id)

  PRIMARY KEY (post_id)
)

CREATE TABLE Subspeaks (
  sp_id INTEGER AUTO_INCREMENT NOT NULL,
  user_name VARCHAR(300),
  views VARCHAR(100),
  description VARCHAR(100),
  numberofsubs VARCHAR(100),
  icon VARCHAR(100),
  PRIMARY KEY (sp_id)
)

CREATE TABLE Comments(
  comment_id INTEGER AUTO_INCREMENT NOT NULL,
  comments VARCHAR(300),
  Voting VARCHAR(100),
  FOREIGN KEY whocomment(comment_id)
  REFERENCES whocomment(comment_id)
  FOREIGN KEY whopost(comment_id)
  REFERENCES whopost(comment_id)

  PRIMARY KEY (comment_id)
)

