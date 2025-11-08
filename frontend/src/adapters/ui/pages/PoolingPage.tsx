import React, { useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { PoolingUseCase } from '../../../core/application/PoolingUseCase';
import { PoolMember, Pool } from '../../../core/domain/Compliance';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import { formatNumber } from '../../../shared/utils';

interface PoolingPageProps {
  poolingUseCase: PoolingUseCase;
}

export const PoolingPage: React.FC<PoolingPageProps> = ({ poolingUseCase }) => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<PoolMember[]>([
    { shipId: '', cbBefore: 0, cbAfter: 0 },
  ]);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPools = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await poolingUseCase.getPoolsByYear(year);
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pools');
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    setMembers([...members, { shipId: '', cbBefore: 0, cbAfter: 0 }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof PoolMember, value: any) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const validateAndCreatePool = async () => {
    // Client-side validation
    const validation = poolingUseCase.validatePool(members);
    
    if (!validation.valid) {
      setError(validation.errors.join('. '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const pool = await poolingUseCase.createPool(year, members);
      setSuccess('Pool created successfully');
      setShowCreateModal(false);
      setMembers([{ shipId: '', cbBefore: 0, cbAfter: 0 }]);
      await loadPools();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const totalCbBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
  const totalCbAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);
  const poolValid = totalCbBefore >= 0 && Math.abs(totalCbAfter - totalCbBefore) < 0.01;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pooling</h1>
        <p className="mt-2 text-gray-600">
          Create and manage compliance balance pools
        </p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Year Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="flex items-end gap-4">
            <Button onClick={loadPools} loading={loading} className="flex-1">
              Load Pools
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="success"
              className="flex-1"
            >
              <Plus size={20} className="inline mr-2" />
              Create Pool
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Pools"
          value={pools.length}
          icon={<Users size={24} />}
        />
        <Card
          title="Valid Pools"
          value={pools.filter((p) => p.valid).length}
          trend="up"
        />
        <Card
          title="Total Members"
          value={pools.reduce((sum, p) => sum + p.members.length, 0)}
        />
      </div>

      {/* Pools List */}
      {pools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Pools for {year}
          </h2>
          {pools.map((pool, poolIndex) => (
            <div key={poolIndex} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pool #{poolIndex + 1}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pool.valid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {pool.valid ? '✓ Valid' : '✗ Invalid'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Total CB Before</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatNumber(pool.totalCbBefore, 2)} tCO₂eq
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Total CB After</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatNumber(pool.totalCbAfter, 2)} tCO₂eq
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {pool.members.length}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Ship ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        CB Before
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        CB After
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pool.members.map((member, memberIndex) => {
                      const change = member.cbAfter - member.cbBefore;
                      return (
                        <tr key={memberIndex}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {member.shipId}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={
                                member.cbBefore >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {formatNumber(member.cbBefore, 2)}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={
                                member.cbAfter >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {formatNumber(member.cbAfter, 2)}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={
                                change >= 0 ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {change > 0 ? '+' : ''}
                              {formatNumber(change, 2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Pool Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Pool"
        size="xl"
      >
        <div className="space-y-6">
          {/* Pool Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Total CB Before</p>
              <p
                className={`text-lg font-semibold ${
                  totalCbBefore >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatNumber(totalCbBefore, 2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total CB After</p>
              <p
                className={`text-lg font-semibold ${
                  totalCbAfter >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatNumber(totalCbAfter, 2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pool Status</p>
              <p
                className={`text-lg font-semibold ${
                  poolValid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {poolValid ? '✓ Valid' : '✗ Invalid'}
              </p>
            </div>
          </div>

          {/* Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Pool Members
              </h4>
              <Button onClick={addMember} size="sm" variant="secondary">
                <Plus size={16} className="inline mr-1" />
                Add Member
              </Button>
            </div>

            {members.map((member, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ship ID
                  </label>
                  <input
                    type="text"
                    value={member.shipId}
                    onChange={(e) =>
                      updateMember(index, 'shipId', e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="SHIP001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    CB Before
                  </label>
                  <input
                    type="number"
                    value={member.cbBefore}
                    onChange={(e) =>
                      updateMember(index, 'cbBefore', parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    CB After
                  </label>
                  <input
                    type="number"
                    value={member.cbAfter}
                    onChange={(e) =>
                      updateMember(index, 'cbAfter', parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    step="0.01"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => removeMember(index)}
                    size="sm"
                    variant="danger"
                    disabled={members.length === 1}
                    className="w-full"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Validation Rules */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h5 className="text-sm font-semibold text-blue-900 mb-2">
              Pooling Rules:
            </h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Total CB before pooling must be ≥ 0</li>
              <li>• Total CB after must equal total CB before</li>
              <li>• Deficit ships cannot exit with increased deficit</li>
              <li>• Surplus ships cannot exit with a deficit</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={validateAndCreatePool}
              variant="success"
              loading={loading}
              disabled={!poolValid}
              className="flex-1"
            >
              Create Pool
            </Button>
            <Button
              onClick={() => setShowCreateModal(false)}
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