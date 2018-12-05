
DROP DATABASE IF EXISTS speakit_db;
CREATE DATABASE speakit_db;
USE speakit_db;

CREATE TABLE posts (
    post_id INTEGER AUTO_INCREMENT NOT NULL,
    post_text VARCHAR(300),
    tags VARCHAR (100),
    views VARCHAR (100),
    title VARCHAR(100),
    categories VARCHAR (100),
  PRIMARY KEY (post_id)
);


CREATE TABLE users (
  user_id INTEGER AUTO_INCREMENT NOT NULL,
  user_name VARCHAR(300),
  user_email VARCHAR(250),
  password Varchar(20),
  PRIMARY KEY (user_id)
);


CREATE TABLE subspeaks (
  sp_id INTEGER AUTO_INCREMENT NOT NULL,
  user_name VARCHAR(300),
  views VARCHAR(100),
  description VARCHAR(100),
  numberofsubs VARCHAR(100),
  icon VARCHAR(100),
  PRIMARY KEY (sp_id)
);

CREATE TABLE comments(
  comment_id INTEGER AUTO_INCREMENT NOT NULL,
  comments VARCHAR(300),
  Voting VARCHAR(100),
  PRIMARY KEY (comment_id)
);

ALTER TABLE users
ADD FOREIGN KEY savedpost(post_id)
REFERENCES posts(post_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE users
ADD FOREIGN KEY savedsp(sp_id)
REFERENCES subspeaks(sp_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE posts
ADD FOREIGN KEY whopost(user_id)
REFERENCES users(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE comments
ADD FOREIGN KEY whocomment(user_id)
REFERENCES users(user_id)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE comments
ADD FOREIGN KEY whatpost(post_id)
REFERENCES posts(post_id)
ON DELETE CASCADE
ON UPDATE CASCADE;