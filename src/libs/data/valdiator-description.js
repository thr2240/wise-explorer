export default class ValidatorDescription {
  constructor() {
    this.moniker = '...'
    this.identity = '...'
    this.website = '...'
    this.security_contact = '...'
    this.details = '...'
  }

  init(element) {
    if (element != null) {
      this.moniker = element.moniker
      this.identity = element.identity
      this.website = element.website
      this.security_contact = element.security_contact
      this.details = element.details
    }
    return this
  }
}
