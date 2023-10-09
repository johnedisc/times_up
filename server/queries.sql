CREATE TABLE user_info (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) NOT NULL CHECK (
    email ~* '\w+.\@\w+.\w{1,3}'
  ),
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
);

CREATE TABLE groups (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  group_name VARCHAR(255) NOT NULL,
  owner_id INT REFERENCES user_info(id) ON DELETE CASCADE
);

CREATE TABLE interval_programs (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  program_name VARCHAR(255) NOT NULL,
  user_id INT REFERENCES user_info(id) ON DELETE CASCADE,
  group_id INT REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE intervals (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  time_seconds INT NOT NULL CHECK (
    time_seconds > 0
  ),
  interval_name VARCHAR(255) NOT NULL,
  sequence_number SMALLINT UNIQUE NOT NULL CHECK (
    sequence_number > 0
  ),
  interval_program_id INT REFERENCES interval_programs(id) ON DELETE CASCADE
);

