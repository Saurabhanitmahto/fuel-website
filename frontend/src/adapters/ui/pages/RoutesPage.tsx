import React, { useState, useEffect } from 'react';
import { Ship, TrendingUp } from 'lucide-react';
import { FetchRoutesUseCase } from '../../../core/application/FetchRoutesUseCase';
import { Route } from '../../../core/domain/Route';
import { Table } from '../components/Table';
import { Filters } from '../components/Filters';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { formatNumber } from '../../../shared/utils';
import { VESSEL_TYPES, FUEL_TYPES, YEARS } from '../../../shared/constants';

interface RoutesPageProps {
  fetchRoutesUseCase: FetchRoutesUseCase;
  apiClient: any;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({
  fetchRoutesUseCase,
  apiClient,
}) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filters
  const [selectedVesselType, setSelectedVesselType] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {};
      if (selectedVesselType) filters.vesselType = selectedVesselType;
      if (selectedFuelType) filters.fuelType = selectedFuelType;
      if (selectedYear) filters.year = parseInt(selectedYear);

      const data = await fetchRoutesUseCase.execute(filters);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, [selectedVesselType, selectedFuelType, selectedYear]);

  const handleSetBaseline = async (routeId: string) => {
    try {
      setError(null);
      await apiClient.setBaseline(routeId);
      setSuccess(`Route ${routeId} set as baseline`);
      await loadRoutes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set baseline');
    }
  };

  const resetFilters = () => {
    setSelectedVesselType('');
    setSelectedFuelType('');
    setSelectedYear('');
  };

  const columns = [
    {
      key: 'routeId',
      header: 'Route ID',
      render: (route: Route) => (
        <span className="font-medium">{route.routeId}</span>
      ),
    },
    {
      key: 'vesselType',
      header: 'Vessel Type',
      render: (route: Route) => route.vesselType,
    },
    {
      key: 'fuelType',
      header: 'Fuel Type',
      render: (route: Route) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {route.fuelType}
        </span>
      ),
    },
    {
      key: 'year',
      header: 'Year',
      render: (route: Route) => route.year,
    },
    {
      key: 'ghgIntensity',
      header: 'GHG Intensity (gCO₂eq/MJ)',
      render: (route: Route) => formatNumber(route.ghgIntensity, 2),
    },
    {
      key: 'fuelConsumption',
      header: 'Fuel Consumption (t)',
      render: (route: Route) => formatNumber(route.fuelConsumption, 0),
    },
    {
      key: 'distance',
      header: 'Distance (km)',
      render: (route: Route) => formatNumber(route.distance, 0),
    },
    {
      key: 'totalEmissions',
      header: 'Total Emissions (t)',
      render: (route: Route) => formatNumber(route.totalEmissions, 0),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (route: Route) => (
        <Button
          size="sm"
          variant={route.isBaseline ? 'success' : 'secondary'}
          onClick={() => handleSetBaseline(route.routeId)}
          disabled={route.isBaseline}
        >
          {route.isBaseline ? '✓ Baseline' : 'Set Baseline'}
        </Button>
      ),
    },
  ];

  const stats = {
    total: routes.length,
    avgGhgIntensity: routes.length > 0
      ? routes.reduce((sum, r) => sum + r.ghgIntensity, 0) / routes.length
      : 0,
    totalFuelConsumption: routes.reduce((sum, r) => sum + r.fuelConsumption, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
        <p className="mt-2 text-gray-600">
          View and manage route data for compliance monitoring
        </p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Routes"
          value={stats.total}
          icon={<Ship size={24} />}
        />
        <Card
          title="Avg GHG Intensity"
          value={`${formatNumber(stats.avgGhgIntensity, 2)} gCO₂eq/MJ`}
          icon={<TrendingUp size={24} />}
        />
        <Card
          title="Total Fuel Consumption"
          value={`${formatNumber(stats.totalFuelConsumption, 0)} t`}
        />
      </div>

      {/* Filters */}
      <Filters
        vesselTypes={VESSEL_TYPES.map(v => ({ label: v, value: v }))}
        fuelTypes={FUEL_TYPES.map(f => ({ label: f, value: f }))}
        years={YEARS.map(y => ({ label: y.toString(), value: y.toString() }))}
        selectedVesselType={selectedVesselType}
        selectedFuelType={selectedFuelType}
        selectedYear={selectedYear}
        onVesselTypeChange={setSelectedVesselType}
        onFuelTypeChange={setSelectedFuelType}
        onYearChange={setSelectedYear}
        onReset={resetFilters}
      />

      {/* Routes Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading routes...</p>
        </div>
      ) : (
        <Table data={routes} columns={columns} />
      )}
    </div>
  );
};