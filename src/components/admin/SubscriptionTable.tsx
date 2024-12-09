import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface SubscriptionTableProps {
  data: any[];
}

export function SubscriptionTable({ data }: SubscriptionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((plan) =>
            plan.users.map((user: any, index: number) => (
              <TableRow key={`${plan.name}-${index}`}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{user.user_name || "N/A"}</TableCell>
                <TableCell>{user.user_email || "N/A"}</TableCell>
                <TableCell>
                  {format(new Date(user.start_date), "PPP")}
                </TableCell>
                <TableCell>
                  {format(new Date(user.end_date), "PPP")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}