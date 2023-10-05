CREATE TABLE groups (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
group_name VARCHAR(255) NOT NULL,
owner_id INT REFERENCES user_info(id) ON DELETE CASCADE
);

CREATE TABLE interval_program (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
user_id INT REFERENCES user_info(id) ON DELETE CASCADE,
group_id INT REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE interval (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
time_seconds INT NOT NULL CHECK (
  time_seconds > 0
),
interval_name VARCHAR(255) NOT NULL,
sequence_number SMALLINT UNIQUE NOT NULL CHECK (
  sequence_number > 0
),
interval_program_id INT REFERENCES interval_programs(interval_program_id) ON DELETE CASCADE
);

