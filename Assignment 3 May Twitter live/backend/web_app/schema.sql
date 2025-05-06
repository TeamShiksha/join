DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS image;

CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE image (
    id INTEGER PRIMARY KEY,
    uploader_id INTEGER NOT NULL,
    uploaded_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    compressed_filepath TEXT,
    FOREIGN KEY (uploader_id) REFERENCES user (id)
);
