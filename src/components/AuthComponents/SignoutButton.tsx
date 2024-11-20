"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { logout } from "../AuthHandlers/LoginHandler";

const SignoutButton = () => {
  const signOut = async () => {
    await logout();
  };
  return (
    <Button
      className="bg-rawmats-accent-300 hover:bg-rawmats-accent-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      onClick={signOut}
    >
      Sign out
    </Button>
  );
};

export default SignoutButton;
