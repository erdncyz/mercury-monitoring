import Header from './Header';
import Sidebar from './Sidebar';
import IncidentModal from '../Incidents/IncidentModal';

export default function MainLayout({
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  hasUnreadNotifications,
  renderContent,
  selectedIncident,
  setSelectedIncident,
  incidents
}: any) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onProfileClick={() => {
          window.location.href = '/profile';
        }}
        onNotificationsClick={() => setShowNotifications((v: boolean) => !v)}
        onSettingsClick={() => setActiveSection('settings')}
        hasUnreadNotifications={hasUnreadNotifications}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {showNotifications && (
        <div id="notification-panel" className="absolute top-16 right-8 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-2">Bildirimler</h3>
          {incidents.length === 0 && <div className="text-gray-500 text-sm">Hiç incident yok.</div>}
          <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            {incidents.map((i: any) => (
              <li key={i.id} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{i.title}</span>
                  <span className={`text-xs ml-2 px-2 py-1 rounded-full ${i.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.status}</span>
                </div>
                <div className="text-xs text-gray-500">{i.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
} 