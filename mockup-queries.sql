# Get course info for courses taught by user_id 1
SELECT course.guid, title FROM course
JOIN course_instructor ON (course.guid = course_instructor.guid)
WHERE course_instructor.user_id = 1;

# Get course info for courses in subject_id 5
SELECT c.guid, c.title FROM course AS c
JOIN course_subject AS cs ON (c.guid = cs.guid)
WHERE cs.subject_id = 5;

# Get all subject titles
SELECT subject FROM subject;

# Get all guids for courses in (subject_id x)
SELECT cs.guid FROM course_subject AS cs
JOIN course AS c ON (cs.guid = c.guid)
WHERE cs.subject_id = 1;

# Get titles for all courses in (subject_id x)
SELECT c.title FROM course AS c
JOIN course_subject AS cs ON (c.guid = cs.guid)
WHERE cs.subject_id = 1;

# Get title and subtitle for guid x
SELECT c.title, c.subtitle FROM course AS c
WHERE c.guid = 10026;

# Get all instructor names for guid x
SELECT u.name FROM user AS u
JOIN course_instructor AS ci ON (u.user_id = ci.user_id)
WHERE ci.guid = 1383;  

# Get all users and whether or not they are a student and/or a faculty
SELECT u.user_id, u.name, ur1.user_id AS 'is_student', ur2.user_id AS 'is_faculty'
FROM user AS u
LEFT JOIN user_role AS ur1 ON (u.user_id = ur1.user_id AND ur1.role = 'student')
LEFT JOIN user_role AS ur2 ON (u.user_id = ur2.user_id AND ur2.role = 'faculty')
#WHERE u.user_id = 1
