using System.Collections.Generic;
using System.Drawing;

namespace NotificationApplication
{
    public class CourseRecord
    {
        public Dictionary<string, Course> Courses { get; set; }

        public CourseRecord()
        {
            Courses = new Dictionary<string, Course>();
            AddCourse("CS101", new Course { Code = "CS101", Title = "Introduction to Computer Science", Description = "This course provides an introduction to the principles of computer science.", Credits = 3 });
            AddCourse("MATH102", new Course { Code = "MATH102", Title = "Calculus II", Description = "This course covers advanced calculus topics.", Credits = 4 });
            AddCourse("ENGL101", new Course { Code = "ENGL101", Title = "English Composition", Description = "This course focuses on writing and composition skills.", Credits = 3 });
            AddCourse("BIO101", new Course { Code = "BIO101", Title = "Introduction to Biology", Description = "This course provides an introduction to the principles of biology.", Credits = 4 });
            AddCourse("CHEM101", new Course { Code = "CHEM101", Title = "Introduction to Chemistry", Description = "This course provides an introduction to the principles of chemistry.", Credits = 4 });
            AddCourse("PHYS101", new Course { Code = "PHYS101", Title = "Introduction to Physics", Description = "This course provides an introduction to the principles of physics.", Credits = 4 });
            AddCourse("CS202", new Course { Code = "CS202", Title = "Data Structures and Algorithms", Description = "This course covers data structures and algorithms.", Credits = 3 });
            AddCourse("MATH201", new Course { Code = "MATH201", Title = "Linear Algebra", Description = "This course covers linear algebra topics.", Credits = 3 });
            AddCourse("ENGL202", new Course { Code = "ENGL202", Title = "English Literature", Description = "This course focuses on English literature.", Credits = 3 });
            AddCourse("BIO202", new Course { Code = "BIO202", Title = "Cell Biology", Description = "This course covers cell biology topics.", Credits = 4 });
            AddCourse("CHEM202", new Course { Code = "CHEM202", Title = "Organic Chemistry", Description = "This course covers organic chemistry topics.", Credits = 4 });
            AddCourse("PHYS202", new Course { Code = "PHYS202", Title = "Electricity and Magnetism", Description = "This course covers electricity and magnetism topics.", Credits = 4 });
            AddCourse("CS303", new Course { Code = "CS303", Title = "Computer Systems", Description = "This course covers computer systems.", Credits = 3 });
            AddCourse("MATH301", new Course { Code = "MATH301", Title = "Differential Equations", Description = "This course covers differential equations topics.", Credits = 3 });
            AddCourse("ENGL301", new Course { Code = "ENGL301", Title = "Creative Writing", Description = "This course focuses on creative writing.", Credits = 3 });
        }

        public void AddCourse(string courseCode, Course course)
        {
            Courses.Add(courseCode, course);
        }

        public void Display(string courseCode = "", string title = "")
        {

        }
    }
}