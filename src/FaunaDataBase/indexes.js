/*
  File keeping the names of all indexes in FaunaDB
*/

module.exports = {
  GET_COURSE_MODULE1_BY_ID: 'get_course_module1_by_id',
  GET_COURSE_MODULE2_BY_ID: 'get_course_module2_by_id',

  //____________GETTING DASHBOARD USER________________________//
  GET_DASHBOARD_USER_BY_USERNAME: 'get_dashboard_user_by_username',

  //____________GETTING STUDENT(s) FROM COLLECTIONS RELATED TO COURSES MODULE 1_____________________//
  GET_STUDENT_IN_COURSES_MODULE1_BY_NAME: 'get_student_in_courses_module1_by_name',
  GET_STUDENT_IN_COURSES_MODULE1_BY_EMAIL: 'get_student_in_courses_module1_by_email',
  GET_STUDENT_IN_PRESENCE_COURSE_MODULE1_BY_NAME: "get_student_in_course_presence_module1_by_name",
  GET_STUDENT_IN_PRESENCE_COURSE_MODULE1_BY_EMAIL: "get_student_in_course_presence_module1_by_email",
  GET_STUDENTS_IN_COURSES_MODULE1_BY_COURSE_NAME: 'get_students_in_courses_module1_by_course_name',
  GET_STUDENTS_IN_COURSES_MODULE1_BY_CAREER: 'get_students_in_courses_module1_by_career',
  
  //____________GETTING STUDENT FROM COLLECTIONS RELATED TO COURSES MODULE 2_______________________//
  GET_STUDENT_IN_COURSES_MODULE2_BY_NAME: 'get_student_in_courses_module2_by_name',
  GET_STUDENT_IN_COURSES_MODULE2_BY_EMAIL: 'get_student_in_courses_module2_by_email',
  GET_STUDENT_IN_PRESENCE_COURSE_MODULE2_BY_NAME: "get_student_in_course_presence_module2_by_name",
  GET_STUDENTS_IN_COURSES_MODULE2_BY_COURSE_NAME: 'get_students_in_courses_module2_by_course_name',
  GET_STUDENTS_IN_COURSES_MODULE2_BY_CAREER: 'get_students_in_courses_module2_by_career',
  
  //____________GETTING STUDENT & COURSE FOR PRESENCE CONFIRMATION_______________________//
  GET_COURSE_FOR_PRESENCE_CONFIRM_BY_COURSE_ID: "get_course_for_presence_confirm_by_course_id",
  GET_STUDENT_FOR_PRESENCE_CONFIRM_BY_COURSE_ID: "get_student_for_presence_confirm_by_course_id",

  GET_COURSE_PRESENCE_BY_NAME: 'get_course_presence_by_name',
  GET_COURSE_PRESENCE_BY_YEAR_MONTH: 'get_course_presence_by_year_month',
  GET_STUDENTS_BY_YEAR_MONTH: 'get_students_by_year_month'
}
 
