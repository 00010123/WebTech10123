class Validator {
  isValid(data) {
    if (data.title.trim() === "" || data.body.trim() === "") {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = Validator;