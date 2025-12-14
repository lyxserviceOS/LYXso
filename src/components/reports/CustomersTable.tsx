'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CustomersTable({ customers }: { customers?: any }) {
  if (!customers || customers.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Ingen kunder å vise</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kunde</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead className="text-right">Bookinger</TableHead>
            <TableHead className="text-right">Total verdi</TableHead>
            <TableHead className="text-right">Snitt verdi</TableHead>
            <TableHead className="text-right">Siste booking</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer: any) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{customer.email}</div>
                  <div className="text-muted-foreground">{customer.phone}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">{customer.total_bookings}</TableCell>
              <TableCell className="text-right font-medium">
                {customer.total_spent.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
              </TableCell>
              <TableCell className="text-right">
                {customer.avg_booking_value.toLocaleString('no-NO', { style: 'currency', currency: 'NOK' })}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {customer.last_booking 
                  ? new Date(customer.last_booking).toLocaleDateString('no-NO')
                  : '-'
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
