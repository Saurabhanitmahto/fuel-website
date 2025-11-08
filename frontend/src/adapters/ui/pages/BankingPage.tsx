import React, { useState } from "react";
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { BankingUseCase } from "../../../core/application/BankingUseCase";
import { BankEntry } from "../../../core/domain/Compliance";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Alert } from "../components/Alert";
import { Modal } from "../components/Modal";
import { formatNumber, formatLargeNumber } from "../../../shared/utils";

interface BankingPageProps {
  bankingUseCase: BankingUseCase;
}

export const BankingPage: React.FC<BankingPageProps> = ({ bankingUseCase }) => {
  const [records, setRecords] = useState<BankEntry[]>([]);
  const [totalBanked, setTotalBanked] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [shipId, setShipId] = useState("SHIP001");
  const [year, setYear] = useState(2025);
  const [amount, setAmount] = useState("");

  // Modal states
  const [showBankModal, setShowBankModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const loadRecords = async () => {
    if (!shipId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await bankingUseCase.getRecords(shipId);
      setRecords(data.records);
      setTotalBanked(data.totalBanked);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!shipId || !year || !amount) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await bankingUseCase.bank(shipId, year, parseFloat(amount));
      setSuccess(`Successfully banked ${amount} tCO₂eq`);
      setShowBankModal(false);
      setAmount("");
      await loadRecords();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to bank surplus");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!shipId || !year || !amount) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await bankingUseCase.apply(shipId, year, parseFloat(amount));
      setSuccess(`Successfully applied ${amount} tCO₂eq from banked surplus`);
      setShowApplyModal(false);
      setAmount("");
      await loadRecords();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to apply banked surplus"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Banking</h1>
        <p className="mt-2 text-gray-600">
          Manage banked surplus compliance balance
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Ship Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ship ID
            </label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter ship ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              min="2025"
              max="2050"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={loadRecords} loading={loading} className="w-full">
              Load Records
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Banked"
          value={`${formatLargeNumber(totalBanked)} tCO₂eq`}
          icon={<Wallet size={24} />}
          trend={totalBanked > 0 ? "up" : "neutral"}
        />
        <Card title="Total Transactions" value={records.length} />
        <Card
          title="Available Balance"
          value={`${formatLargeNumber(totalBanked)} tCO₂eq`}
          subtitle={totalBanked > 0 ? "Available for use" : "No balance"}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => setShowBankModal(true)}
          variant="success"
          disabled={!shipId}
        >
          <ArrowUpCircle size={20} className="inline mr-2" />
          Bank Surplus
        </Button>
        <Button
          onClick={() => setShowApplyModal(true)}
          variant="primary"
          disabled={!shipId || totalBanked <= 0}
        >
          <ArrowDownCircle size={20} className="inline mr-2" />
          Apply Banked
        </Button>
      </div>

      {/* Records Table */}
      {records.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (tCO₂eq)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        record.amountGco2eq > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {record.amountGco2eq > 0 ? "+" : ""}
                      {formatNumber(record.amountGco2eq, 2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        record.amountGco2eq > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.amountGco2eq > 0 ? "Banked" : "Applied"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.createdAt
                      ? new Date(record.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bank Modal */}
      <Modal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        title="Bank Surplus"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (tCO₂eq)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter amount to bank"
              step="0.01"
              min="0"
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              Banking positive compliance balance allows you to use it in future
              periods to offset deficits.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleBank}
              variant="success"
              loading={loading}
              className="flex-1"
            >
              Confirm Bank
            </Button>
            <Button
              onClick={() => setShowBankModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply Banked Surplus"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (tCO₂eq)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter amount to apply"
              step="0.01"
              min="0"
              max={totalBanked}
            />
            <p className="mt-1 text-sm text-gray-500">
              Available: {formatNumber(totalBanked, 2)} tCO₂eq
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              Applying banked surplus will reduce your available balance and
              offset compliance deficits for the selected year.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleApply}
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Confirm Apply
            </Button>
            <Button
              onClick={() => setShowApplyModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
