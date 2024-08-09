export class LateCheckInValidateError extends Error {
  constructor() {
    super("the check-in can only be validate until 20 minutes of its creation");
  }
}
