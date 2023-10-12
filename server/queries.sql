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
  owner_id INT REFERENCES user_info(id)
);

CREATE TABLE group_members (
  group_id INT REFERENCES groups(id),
  user_id INT REFERENCES user_info(id),
  CONSTRAINT group_members_pk PRIMARY KEY (group_id, user_id)
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





SELECT 
  groups.id AS group_id,
  groups.name AS group_name,
  interval_programs.id AS interval_id,
  interval_programs.program_name AS program_name

FROM
  group_members

INNER JOIN 
  interval_programs

ON 
  group_members.group_id = interval_programs.group_id;
