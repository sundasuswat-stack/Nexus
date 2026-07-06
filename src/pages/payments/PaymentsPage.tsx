import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Wallet, ArrowDownCircle, ArrowUpCircle, ArrowRightLeft,
  TrendingUp, X, CheckCircle
} from 'lucide-react';

type TxType = 'Deposit' | 'Withdraw' | 'Transfer' | 'Funding';
type TxStatus = 'Completed' | 'Pending' | 'Failed';

interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  sender: string;
  receiver: string;
  status: TxStatus;
  date: string;
}

type ModalType = 'deposit' | 'withdraw' | 'transfer' | 'fund' | null;

export const PaymentsPage: React.FC = () => {
  const [balance, setBalance] = useState(24500);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'Deposit',
      amount: 10000,
      sender: 'Bank Account',
      receiver: 'Sarah Johnson',
      status: 'Completed',
      date: 'July 4, 2026',
    },
    {
      id: '2',
      type: 'Funding',
      amount: 5000,
      sender: 'Michael Rodriguez',
      receiver: 'TechWave AI',
      status: 'Completed',
      date: 'July 2, 2026',
    },
    {
      id: '3',
      type: 'Withdraw',
      amount: 1500,
      sender: 'Sarah Johnson',
      receiver: 'Bank Account',
      status: 'Pending',
      date: 'July 5, 2026',
    },
  ]);

  const statusColor: Record<TxStatus, 'success' | 'accent' | 'error'> = {
    Completed: 'success',
    Pending: 'accent',
    Failed: 'error',
  };

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setAmount('');
    setRecipient('');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    let newTx: Transaction;

    switch (activeModal) {
      case 'deposit':
        setBalance((prev) => prev + numAmount);
        newTx = {
          id: Date.now().toString(),
          type: 'Deposit',
          amount: numAmount,
          sender: 'Bank Account',
          receiver: 'Sarah Johnson',
          status: 'Completed',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        setSuccessMsg(`Deposited $${numAmount.toLocaleString()} successfully!`);
        break;

      case 'withdraw':
        if (numAmount > balance) {
          setSuccessMsg('Insufficient balance for this withdrawal.');
          return;
        }
        setBalance((prev) => prev - numAmount);
        newTx = {
          id: Date.now().toString(),
          type: 'Withdraw',
          amount: numAmount,
          sender: 'Sarah Johnson',
          receiver: 'Bank Account',
          status: 'Pending',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        setSuccessMsg(`Withdrawal of $${numAmount.toLocaleString()} initiated.`);
        break;

      case 'transfer':
        if (!recipient.trim()) return;
        if (numAmount > balance) {
          setSuccessMsg('Insufficient balance for this transfer.');
          return;
        }
        setBalance((prev) => prev - numAmount);
        newTx = {
          id: Date.now().toString(),
          type: 'Transfer',
          amount: numAmount,
          sender: 'Sarah Johnson',
          receiver: recipient.trim(),
          status: 'Completed',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        setSuccessMsg(`Transferred $${numAmount.toLocaleString()} to ${recipient.trim()}.`);
        break;

      case 'fund':
        if (!recipient.trim()) return;
        if (numAmount > balance) {
          setSuccessMsg('Insufficient balance for this funding.');
          return;
        }
        setBalance((prev) => prev - numAmount);
        newTx = {
          id: Date.now().toString(),
          type: 'Funding',
          amount: numAmount,
          sender: 'Sarah Johnson',
          receiver: recipient.trim(),
          status: 'Completed',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        };
        setSuccessMsg(`Funded ${recipient.trim()} with $${numAmount.toLocaleString()}!`);
        break;

      default:
        return;
    }

    setTransactions((prev) => [newTx, ...prev]);
    setActiveModal(null);
  };

  const modalConfig: Record<Exclude<ModalType, null>, { title: string; needsRecipient: boolean; recipientLabel: string }> = {
    deposit: { title: 'Deposit Funds', needsRecipient: false, recipientLabel: '' },
    withdraw: { title: 'Withdraw Funds', needsRecipient: false, recipientLabel: '' },
    transfer: { title: 'Transfer Funds', needsRecipient: true, recipientLabel: 'Recipient name' },
    fund: { title: 'Fund a Deal', needsRecipient: true, recipientLabel: 'Entrepreneur / Startup name' },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">
          Manage your wallet, deposits, withdrawals, and deal funding.
        </p>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="mb-4 bg-success-50 border border-success-500/30 text-success-700 px-4 py-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Wallet Balance Card */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary-100 mb-1">
              <Wallet size={18} />
              <span className="text-sm">Wallet Balance</span>
            </div>
            <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="accent" leftIcon={<ArrowDownCircle size={16} />} onClick={() => openModal('deposit')}>
              Deposit
            </Button>
            <Button variant="secondary" leftIcon={<ArrowUpCircle size={16} />} onClick={() => openModal('withdraw')}>
              Withdraw
            </Button>
            <Button variant="outline" className="!bg-white/10 !text-white !border-white/30" leftIcon={<ArrowRightLeft size={16} />} onClick={() => openModal('transfer')}>
              Transfer
            </Button>
            <Button variant="outline" className="!bg-white/10 !text-white !border-white/30" leftIcon={<TrendingUp size={16} />} onClick={() => openModal('fund')}>
              Fund a Deal
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Sender</th>
                <th className="px-4 py-3 font-medium">Receiver</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{tx.type}</td>
                  <td className="px-4 py-3 text-gray-700">${tx.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.sender}</td>
                  <td className="px-4 py-3 text-gray-500">{tx.receiver}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColor[tx.status]}>{tx.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <Card className="p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalConfig[activeModal].title}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {modalConfig[activeModal].needsRecipient && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalConfig[activeModal].recipientLabel}
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <p className="text-xs text-gray-400 mb-6">
              Current balance: ${balance.toLocaleString()} (simulation only — no real funds involved)
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};