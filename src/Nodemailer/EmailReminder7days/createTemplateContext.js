function createTemplateContext(input) {
  return {
    course_name: input.name,
    course_page: input.course_page
  }
}

module.exports = createTemplateContext