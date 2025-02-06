import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";

interface Transaction {
  id: string;
  category: string;
  type: string;
  value: number;
  description: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  loadingTransaction: boolean;
  onUpdate: (id: string, updatedTransaction: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loadingTransaction,
  onUpdate,
  onDelete,
}) => {
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [updatedTransaction, setUpdatedTransaction] = React.useState<
    Partial<Transaction>
  >({});

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setUpdatedTransaction(transaction);
  };

  const handleSave = () => {
    if (editingTransaction) {
      onUpdate(editingTransaction.id, updatedTransaction);
      setEditingTransaction(null);
    }
  };

  return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingTransaction ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {editingTransaction?.id === transaction.id ? (
                  <Input
                    type="text"
                    value={updatedTransaction.type || ""}
                    onChange={(e) =>
                      setUpdatedTransaction({
                        ...updatedTransaction,
                        type: e.target.value,
                      })
                    }
                  />
                ) : (
                  transaction.type
                )}
              </TableCell>
              <TableCell>
                {editingTransaction?.id === transaction.id ? (
                  <Input
                    type="text"
                    value={updatedTransaction.category || ""}
                    onChange={(e) =>
                      setUpdatedTransaction({
                        ...updatedTransaction,
                        category: e.target.value,
                      })
                    }
                  />
                ) : (
                  transaction.category
                )}
              </TableCell>
              <TableCell>
                {editingTransaction?.id === transaction.id ? (
                  <Input
                    type="text"
                    value={updatedTransaction.description || ""}
                    onChange={(e) =>
                      setUpdatedTransaction({
                        ...updatedTransaction,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  transaction.description
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingTransaction?.id === transaction.id ? (
                  <Input
                    type="number"
                    value={updatedTransaction.value || ""}
                    onChange={(e) =>
                      setUpdatedTransaction({
                        ...updatedTransaction,
                        value: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(transaction.value)
                )}
              </TableCell>
              <TableCell className="text-right">
                {editingTransaction?.id === transaction.id ? (
                  <Button className="text-xs mx-1 px-2" onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <Button
                    className="text-xs mx-1 px-2"
                    onClick={() => handleEdit(transaction)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  className="text-xs mx-1 py-1 px-2"
                  onClick={() => onDelete(transaction.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
