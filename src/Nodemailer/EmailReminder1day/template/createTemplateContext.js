function createTemplateContext(input) {
  return {
    course_name: input.name,
    course_hour: input.hour,
    course_page: input.course_page
  }
}

module.exports = createTemplateContext