import React, { useState, useEffect } from 'react';
import { BarChart3, Target } from 'lucide-react';
import { CompareRoutesUseCase } from '../../../core/application/CompareRoutesUseCase';
import { RouteComparison } from '../../../core/domain/Route';
import { Table } from '../components/Table';
import { Chart } from '../components/Chart';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { formatNumber } from '../../../shared/utils';

interface ComparePageProps {
  compareRoutesUseCase: CompareRoutesUseCase;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  compareRoutesUseCase,
}) => {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await compareRoutesUseCase.execute();
      setComparisons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparisons');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'routeId',
      header: 'Route ID',
      render: (comp: RouteComparison) => (
        <span className="font-medium">{comp.routeId}</span>
      ),
    },
    {
      key: 'vesselType',
      header: 'Vessel Type',
      render: (comp: RouteComparison) => comp.vesselType,
    },
    {
      key: 'fuelType',
      header: 'Fuel Type',
      render: (comp: RouteComparison) => comp.fuelType,
    },
    {
      key: 'year',
      header: 'Year',
      render: (comp: RouteComparison) => comp.year,
    },
    {
      key: 'baselineGhgIntensity',
      header: 'Baseline (gCO₂eq/MJ)',
      render: (comp: RouteComparison) => formatNumber(comp.baselineGhgIntensity, 2),
    },
    {
      key: 'comparisonGhgIntensity',
      header: 'Current (gCO₂eq/MJ)',
      render: (comp: RouteComparison) => formatNumber(comp.comparisonGhgIntensity, 2),
    },
    {
      key: 'percentDiff',
      header: '% Difference',
      render: (comp: RouteComparison) => (
        <span
          className={
            comp.percentDiff < 0 ? 'text-green-600' : 'text-red-600'
          }
        >
          {comp.percentDiff > 0 ? '+' : ''}
          {formatNumber(comp.percentDiff, 2)}%
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Target (gCO₂eq/MJ)',
      render: (comp: RouteComparison) => formatNumber(comp.target, 2),
    },
    {
      key: 'compliant',
      header: 'Status',
      render: (comp: RouteComparison) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            comp.compliant
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {comp.compliant ? '✓ Compliant' : '✗ Non-Compliant'}
        </span>
      ),
    },
  ];

  const chartData = comparisons.map((comp) => ({
    routeId: comp.routeId,
    baseline: comp.baselineGhgIntensity,
    current: comp.comparisonGhgIntensity,
    target: comp.target,
  }));

  const stats = {
    compliant: comparisons.filter((c) => c.compliant).length,
    nonCompliant: comparisons.filter((c) => !c.compliant).length,
    avgDiff: comparisons.length > 0
      ? comparisons.reduce((sum, c) => sum + c.percentDiff, 0) / comparisons.length
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compare Routes</h1>
        <p className="mt-2 text-gray-600">
          Compare route performance against baseline and compliance targets
        </p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Compliant Routes"
          value={stats.compliant}
          subtitle={`${comparisons.length} total routes`}
          icon={<Target size={24} />}
          trend="up"
        />
        <Card
          title="Non-Compliant Routes"
          value={stats.nonCompliant}
          icon={<BarChart3 size={24} />}
          trend="down"
        />
        <Card
          title="Avg % Difference"
          value={`${formatNumber(stats.avgDiff, 2)}%`}
          subtitle="vs baseline"
          trend={stats.avgDiff < 0 ? 'up' : 'down'}
        />
      </div>

      {/* Chart */}
      {!loading && comparisons.length > 0 && (
        <Chart
          data={chartData}
          xKey="routeId"
          yKeys={[
            { key: 'current', label: 'Current GHG Intensity', color: '#0ea5e9' },
            { key: 'baseline', label: 'Baseline', color: '#f59e0b' },
            { key: 'target', label: 'Target', color: '#10b981' },
          ]}
          height={400}
          title="GHG Intensity Comparison"
        />
      )}

      {/* Comparison Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading comparisons...</p>
        </div>
      ) : (
        <Table data={comparisons} columns={columns} />
      )}
    </div>
  );
};