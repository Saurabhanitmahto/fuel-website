import { useState } from 'react';
import { Ship, BarChart3, Wallet, Users } from 'lucide-react';
import { ApiClient } from '../infrastructure/ApiClient';
import { FetchRoutesUseCase } from '../../core/application/FetchRoutesUseCase';
import { CompareRoutesUseCase } from '../../core/application/CompareRoutesUseCase';
import { BankingUseCase } from '../../core/application/BankingUseCase';
import { PoolingUseCase } from '../../core/application/PoolingUseCase';
import { RoutesPage } from './pages/RoutesPage';
import { ComparePage } from './pages/ComparePage';
import { BankingPage } from './pages/BankingPage';
import { PoolingPage } from './pages/PoolingPage';

type Tab = 'routes' | 'compare' | 'banking' | 'pooling';

// Initialize dependencies
const apiClient = new ApiClient();
const fetchRoutesUseCase = new FetchRoutesUseCase(apiClient);
const compareRoutesUseCase = new CompareRoutesUseCase(apiClient);
const bankingUseCase = new BankingUseCase(apiClient);
const poolingUseCase = new PoolingUseCase(apiClient);

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('routes');

  const tabs = [
    { id: 'routes' as Tab, label: 'Routes', icon: Ship },
    { id: 'compare' as Tab, label: 'Compare', icon: BarChart3 },
    { id: 'banking' as Tab, label: 'Banking', icon: Wallet },
    { id: 'pooling' as Tab, label: 'Pooling', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Ship className="text-primary-600" size={32} />
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                FuelEU Maritime Compliance
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Compliance Dashboard
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'routes' && (
          <RoutesPage
            fetchRoutesUseCase={fetchRoutesUseCase}
            apiClient={apiClient}
          />
        )}
        {activeTab === 'compare' && (
          <ComparePage compareRoutesUseCase={compareRoutesUseCase} />
        )}
        {activeTab === 'banking' && (
          <BankingPage bankingUseCase={bankingUseCase} />
        )}
        {activeTab === 'pooling' && (
          <PoolingPage poolingUseCase={poolingUseCase} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            FuelEU Maritime Compliance Platform © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;