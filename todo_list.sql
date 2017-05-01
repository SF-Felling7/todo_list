CREATE TABLE tasks (
    id SERIAL PRIMARY KEY NOT NULL,
    taskname VARCHAR(30),
    description VARCHAR(60),
    complete DEFAULT false
);
