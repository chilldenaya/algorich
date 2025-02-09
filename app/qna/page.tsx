"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { supabase } from "../utils/supabase/client";

export default function Page() {
  const [message, setMessage] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoadingAuth(false);
      }
    };

    checkUser();
  }, []);

  if (loadingAuth) {
    return;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("User not found :(");
      return;
    }

    const userId = user.id;

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

    const { error } = await supabase.from("transactions").insert({
      user_id: userId,
      category: data.category,
      type: data.type,
      value: data.value,
      description: data.description,
    });

    if (error) {
      toast.error("Failed to save to database :(");
      return;
    }

    toast.success(
      <div className="gap-1">
        <div>
          <strong>Categorized successfully!</strong>
          <Separator />
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
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Card className="w-4/5 sm:w-3/5 m-4">
        <CardHeader>
          <CardTitle>Algorich</CardTitle>
          <CardDescription>Tanya AI</CardDescription>
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
