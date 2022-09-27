function createTemplateContext(input) {
  return {
    course_name: input.name,
    course_date: input.date,
    course_hour: input.hour,
    course_logo: input.logo,
    course_page: input.course_page
  }
}

module.exports = createTemplateContext

