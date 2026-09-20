// "use client";

// import { useState } from "react";
// import Sidebar from "@/components/Sidebar";

// const AMOUNTS = [1, 2, 5, 10, 50, 100, 500, 1000];

// export default function MainMenu() {
//   const [balance, setBalance] = useState(500);
//   const [depositAmount, setDepositAmount] = useState("");
//   const [withdrawAmount, setWithdrawAmount] = useState("");

//   const bump = (
//     setter: React.Dispatch<React.SetStateAction<string>>,
//     amount: number
//   ) => setter((prev) => String((Number(prev) || 0) + amount));

//   const handleDeposit = () => {
//     const value = Number(depositAmount);
//     if (!value) return;
//     setBalance((prev) => prev + value);
//     setDepositAmount("");
//   };

//   const handleWithdraw = () => {
//     const value = Number(withdrawAmount);
//     if (!value) return;
//     setBalance((prev) => prev - Math.abs(value));
//     setWithdrawAmount("");
//   };

//   return (
//     <div className="flex min-h-screen bg-white">
//       <Sidebar />

//       <main className="relative flex flex-1 flex-col px-16 py-12">
//         <h1 className="text-3xl text-gray-900">Username</h1>
//         <p className="mt-2 text-sm text-gray-500">XXXX-XXXX-XXXX-1234</p>

//         <div className="mt-10 max-w-xl">
//           <div className="grid grid-cols-4 gap-4">
//             {AMOUNTS.map((amount) => (
//               <button
//                 key={`deposit-${amount}`}
//                 type="button"
//                 onClick={() => bump(setDepositAmount, amount)}
//                 className="rounded-lg bg-green-200 py-4 text-center text-gray-900 hover:bg-green-300"
//               >
//                 +{amount.toLocaleString()}
//               </button>
//             ))}
//           </div>

//           <div className="mt-4 flex items-center rounded-lg bg-green-50 pr-2">
//             <input
//               type="text"
//               value={depositAmount}
//               onChange={(e) => setDepositAmount(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleDeposit()}
//               placeholder="Enter Amount Deposit"
//               className="w-full bg-transparent px-5 py-4 font-semibold text-gray-900 placeholder:font-semibold placeholder:text-gray-900 focus:outline-none"
//             />
//             {depositAmount && (
//               <button
//                 type="button"
//                 onClick={handleDeposit}
//                 className="shrink-0 rounded-md bg-green-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-green-300"
//               >
//                 Enter
//               </button>
//             )}
//           </div>

//           <hr className="my-8 border-gray-300" />

//           <div className="grid grid-cols-4 gap-4">
//             {AMOUNTS.map((amount) => (
//               <button
//                 key={`withdraw-${amount}`}
//                 type="button"
//                 onClick={() => bump(setWithdrawAmount, amount)}
//                 className="rounded-lg bg-green-200 py-4 text-center text-gray-900 hover:bg-green-300"
//               >
//                 -{amount.toLocaleString()}
//               </button>
//             ))}
//           </div>

//           <div className="mt-4 flex items-center rounded-lg bg-green-50 pr-2">
//             <input
//               type="text"
//               value={withdrawAmount}
//               onChange={(e) => setWithdrawAmount(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleWithdraw()}
//               placeholder="Enter Amount Withdraw"
//               className="w-full bg-transparent px-5 py-4 font-semibold text-gray-900 placeholder:font-semibold placeholder:text-gray-900 focus:outline-none"
//             />
//             {withdrawAmount && (
//               <button
//                 type="button"
//                 onClick={handleWithdraw}
//                 className="shrink-0 rounded-md bg-green-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-green-300"
//               >
//                 Enter
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="pointer-events-none absolute right-16 top-1/2 flex h-80 w-80 -translate-y-1/2 items-center justify-center rounded-full border-2 border-green-600 bg-green-200">
//           <span className="text-2xl font-medium text-gray-900">
//             {balance.toFixed(2)} Baht
//           </span>
//         </div>
//       </main>
//     </div>
//   );
// }


import { redirect } from "next/navigation";

export default function Home() {
  redirect("/Login");
}