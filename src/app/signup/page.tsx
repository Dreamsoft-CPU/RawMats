import React from "react";
import AuthScreen from "@/components/Screens/AuthScreen";
import SignUpForm from "@/components/AuthComponents/SignUpForm";

const BuyerSignUp = () => {
  const header = "Sign Up";
  const message = "Join the community!";
  const body = <SignUpForm />;

  return <AuthScreen header={header} message={message} body={body} />;
};

export default BuyerSignUp;
