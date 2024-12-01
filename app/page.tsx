"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Page() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    toast.info("Categorizing...");
    const response = await fetch("/api/py/categorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (response.status === 500) {
      toast.error("Failed to categorize :(");
      return;
    }

    toast.success(
      <div className="gap-1">
        <div>
          <strong>Categorized successfully</strong>
        </div>
        <div>
          <strong>Category</strong>: {data.category}
        </div>
        <div>
          <strong>Type</strong>: {data.type}
        </div>
        <div>
          <strong>Value</strong>:
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(data.value)}
        </div>
        <div>
          <strong>Description</strong>: {data.description}
        </div>
      </div>,
      { duration: 10000 }
    );
    setMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Algorich</CardTitle>
          <CardDescription>Go rich or go home</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid w-full gap-2">
            <Textarea
              placeholder="Enter a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
