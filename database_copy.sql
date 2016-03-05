CREATE TABLE `courses` (
  `guid` varchar(255) NOT NULL,
  `course_title` varchar(255) NOT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `students` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `enrollment` (
  `username` varchar(255) NOT NULL,
  `guid` varchar(255) NOT NULL,
  PRIMARY KEY (`username`,`guid`),
  KEY `idx_enrollment_by_guid` (`guid`),
  CONSTRAINT `fk_enrollment_to_courses` FOREIGN KEY (`guid`) REFERENCES `courses` (`guid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_enrollment_to_students` FOREIGN KEY (`username`) REFERENCES `students` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
