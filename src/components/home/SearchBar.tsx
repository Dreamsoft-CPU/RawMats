"use client";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex w-full max-w-md items-center h-24">
      <Input
        placeholder="Search for an item..."
        className="bg-background rounded-r-none rounded-l-full h-12"
      />
      <Button type="submit" className="rounded-l-none rounded-r-full h-12">
        <SearchIcon />
      </Button>
    </div>
  );
};

export default SearchBar;
