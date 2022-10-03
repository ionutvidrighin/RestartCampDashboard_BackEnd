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
    this.career = input.career
    this.domain = input.domain
    this.subscribedToEmails = true,
    this.activeStudent = true,
    this.course = input.course
    this.registrationDate = input.registrationDate,
    this.year_month = input.year_month
  }
}

module.exports.CreateNewStudent = CreateNewStudent