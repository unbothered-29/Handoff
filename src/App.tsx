import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Toast } from './components/common/Toast';
import { OverviewView } from './components/dashboard/OverviewView';
import { ProjectsListView } from './components/projects/ProjectsListView';
import { ProjectWorkspaceView } from './components/projects/ProjectWorkspaceView';
import { HandoffsInboxView } from './components/handoffs/HandoffsInboxView';
import { HandoffDetailView } from './components/handoffs/HandoffDetailView';
import { CreateHandoffModal } from './components/handoffs/CreateHandoffModal';
import { PersonaSwitcherModal } from './components/common/PersonaSwitcherModal';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { TeamView } from './components/team/TeamView';
import { SettingsView } from './components/settings/SettingsView';
import { ActivityAuditView } from './components/audit/ActivityAuditView';

const MainContent: React.FC = () => {
  const { 
    isAuthenticated,
    currentView, 
    isCreateHandoffOpen, 
    setIsCreateHandoffOpen,
    isPersonaSwitcherOpen,
    setIsPersonaSwitcherOpen 
  } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not authenticated, show the Login Page first
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'projects':
        return <ProjectsListView />;
      case 'project-detail':
        return <ProjectWorkspaceView />;
      case 'handoffs':
        return <HandoffsInboxView />;
      case 'handoff-detail':
        return <HandoffDetailView />;
      case 'ai-assistant':
        return <AiAssistantView />;
      case 'team':
        return <TeamView />;
      case 'activity-audit':
        return <ActivityAuditView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050606] text-[#F5F5F2] flex flex-col transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Top Bar Header */}
      <TopBar
        collapsed={sidebarCollapsed}
        onOpenMobileMenu={() => setMobileSidebarOpen(true)}
      />

      {/* Main View Area */}
      <main
        className={`flex-1 transition-all duration-200 p-4 sm:p-6 lg:p-8 ${
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {renderActiveView()}
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <CreateHandoffModal
        isOpen={isCreateHandoffOpen}
        onClose={() => setIsCreateHandoffOpen(false)}
      />
      <PersonaSwitcherModal
        isOpen={isPersonaSwitcherOpen}
        onClose={() => setIsPersonaSwitcherOpen(false)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
