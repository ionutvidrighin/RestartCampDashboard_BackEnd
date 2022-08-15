class CreateNewStudent {
  constructor(input) {
    this.id = input.id
    this.appellation = input.appellation
    this.address = input.address
    this.county = input.county
    this.fullName = input.fullName
    this.phoneCode = input.phoneCode
    this.phoneNo = input.phoneNo
    this.email = input.email
    this.job = input.job
    this.remarks = input.remarks
    this.reference = input.reference
    this.is_career = input.is_career
    this.is_business = input.is_business
    this.domain = input.domain
    this.course = input.course
    this.registrationDate = input.registrationDate,
    this.year_month = input.year_month
  }
}

class CreateNewStudentForPresence {
  constructor(input) {
    this.id = input.id
    this.fullName = input.fullName
    this.phoneNo = input.phoneNo
    this.email = input.email
    this.course = input.course
  }
}

module.exports.CreateNewStudent = CreateNewStudent
module.exports.CreateNewStudentForPresence = CreateNewStudentForPresence