// --This file is contain MOCK data for transaction page ONLY. --

export type Transaction = {
	id: string;
	type: "deposit" | "withdraw";
	amount: number;
	cardNumber: string;
	date: string; // e.g. "15 Aug 26"
	time: string; // e.g. "10:01 AM"
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