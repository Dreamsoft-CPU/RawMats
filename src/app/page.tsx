import React from "react";

const HomePage = async () => {
  const response = await fetch("http://localhost:3000/api/register", {
    cache: "no-cache",
  });
  const { message } = await response.json();
  return <div>HomePage {message}</div>;
};

export default HomePage;
