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
  groups.group_name AS group_name,
  group_members.user_id AS user_id,
  interval_programs.id AS program_id,
  interval_programs.program_name AS program_name,
  intervals.interval_name,
  intervals.time_seconds,
  intervals.sequence_number,
  intervals.id AS interval_id

FROM
  groups

INNER JOIN 
  group_members

ON 
  group_members.group_id = groups.id

INNER JOIN
  interval_programs

ON
  interval_programs.group_id = group_members.group_id

WHERE
  interval_programs.user_id = 31 AND group_members.user_id = 31;

INSERT INTO group_members (
  group_id,
  user_id
) VALUES 
  (5, 31),
  (5, 42),
  (5, 43),
  (1, 42),
  (2, 43),
  (4, 31),
  (6, 31),
  (6, 40);
