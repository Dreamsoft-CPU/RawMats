import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthScreen from "@/components/Screens/AuthScreen";
import LoginForm from "@/components/AuthComponents/LoginForm";

const LoginPage = async () => {
  const header = "Ready to Dive In?";
  const message = "Log in to your account!";
  const body: React.ReactNode = <LoginForm />;

  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error || data.user) {
    redirect("/");
  }

  return <AuthScreen header={header} message={message} body={body} />;
};

export default LoginPage;
