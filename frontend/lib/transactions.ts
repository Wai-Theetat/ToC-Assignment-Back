// --This file is contain MOCK data for transaction page ONLY. --

export type Transaction = {
  id: string;
  type: "deposit" | "withdraw" | "transfer_in" | "transfer_out";
  amount: number;
  cardNumber: string;
  date: string;
  time: string;
};

export const MOCK_TRANSACTIONS: Transaction[] = [
{
	id: "1",
	type: "withdraw",
	amount: 500,
	cardNumber: "XXXX-XXXX-XXXX-1234",
	date: "15 Aug 26",
	time: "10:01 AM",
},
{
	id: "2",
	type: "deposit",
	amount: 500,
	cardNumber: "XXXX-XXXX-XXXX-1234",
	date: "15 Aug 26",
	time: "10:00 AM",
},
];