/*
  File keeping the names of all indexes in FaunaDB
*/

module.exports = {
  GET_COURSE_MODULE1_BY_ID: 'get_course_module1_by_id',
  GET_COURSE_MODULE2_BY_ID: 'get_course_module2_by_id',
  GET_DASHBOARD_USER_BY_EMAIL: 'get_dashboard_user_by_email',
  GET_STUDENT_COURSE_MODULE1_BY_EMAIL: 'get_student_course_module1_by_email',
  GET_STUDENT_COURSE_MODULE2_BY_EMAIL: 'get_student_course_module2_by_email',
  GET_STUDENT_COURSE_MODULE1_BY_NAME: 'get_student_course_module1_by_name',
  GET_STUDENT_COURSE_MODULE1_BY_COURSE_NAME: 'get_registered_student_by_course_name',
  GET_STUDENT_COURSE_MODULE1_BY_CAREER: 'get_registered_student_by_career',
  GET_STUDENT_COURSE_MODULE1_BY_BUSINESS: 'get_registered_student_by_business',
  GET_STUDENT_COURSE_MODULE2_BY_NAME: 'get_student_course_module2_by_name',
  GET_COURSE_PRESENCE_BY_NAME: 'get_course_presence_by_name',
  GET_COURSE_PRESENCE_BY_YEAR_MONTH: 'get_course_presence_by_year_month',
  GET_COURSE_FOR_PRESENCE_CONFIRMATION_BY_ID: "get_course_and_student_for_presence_by_course_id",
  GET_STUDENT_FOR_PRESENCE_CONFIRMATION_BY_COURSE_ID: 'get_course_and_student_for_presence_by_course_id',
  GET_STUDENTS_BY_YEAR_MONTH: 'get_students_by_year_month'
}