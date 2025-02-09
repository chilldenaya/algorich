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
import { supabase } from "./utils/supabase/client";
import TransactionTable from "@/components/ui/TransactionTable";

interface Transaction {
  id: string;
  category: string;
  type: string;
  value: number;
  description: string;
  location: string;
}

export default function Page() {
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransaction, setLoadingTransaction] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  const fetchTransactions = async () => {
    setLoadingTransaction(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("User not found :(");
      setLoadingTransaction(false);
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .select()
      .order("id", { ascending: false })
      .eq("user_id", user.id)
      .limit(10);

    if (error) {
      toast.error("Failed to fetch transactions :(");
      return;
    }

    setTransactions(data);
    setLoadingTransaction(false);
  };

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
    fetchTransactions();
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
      location: data.location,
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
    fetchTransactions();
  };

  const handleUpdate = async (
    id: string,
    updatedTransaction: Partial<Transaction>
  ) => {
    const { error } = await supabase
      .from("transactions")
      .update(updatedTransaction)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update transaction :(");
      return;
    }

    toast.success("Transaction updated successfully!");
    fetchTransactions();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete transaction :(");
      return;
    }

    toast.success("Transaction deleted successfully!");
    fetchTransactions();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Card className="w-4/5 sm:w-3/5 m-4">
        <CardHeader>
          <CardTitle>Algorich</CardTitle>
          <CardDescription>Catet yuk!</CardDescription>
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
      <div className="w-4/5 sm:w-3/5 m-4">
        <TransactionTable
          transactions={transactions}
          loadingTransaction={loadingTransaction}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
