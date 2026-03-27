import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_OE5FgwiYC",
      userPoolClientId: "4urbg1v1bdkqopiu7b1ek50ees", 
    }
  }
});

export default Amplify;