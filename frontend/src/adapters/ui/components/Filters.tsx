import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FiltersProps {
  vesselTypes: FilterOption[];
  fuelTypes: FilterOption[];
  years: FilterOption[];
  selectedVesselType: string;
  selectedFuelType: string;
  selectedYear: string;
  onVesselTypeChange: (value: string) => void;
  onFuelTypeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onReset: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  vesselTypes,
  fuelTypes,
  years,
  selectedVesselType,
  selectedFuelType,
  selectedYear,
  onVesselTypeChange,
  onFuelTypeChange,
  onYearChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vessel Type
          </label>
          <select
            value={selectedVesselType}
            onChange={(e) => onVesselTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            {vesselTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            value={selectedFuelType}
            onChange={(e) => onFuelTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Fuels</option>
            {fuelTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};