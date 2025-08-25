import React, { useState, useEffect } from 'react';
import { useAuth, useProfile, useClients, usePackages, useLeads, useProjects, useAddOns, useTransactions, usePromoCodes, useTeamMembers, useContracts, useAssets, useSops } from './hooks/useSupabase';
import SupabaseAuth from './components/SupabaseAuth';
import PublicSupabaseBooking from './components/PublicSupabaseBooking';
import PublicSupabaseFeedback from './components/PublicSupabaseFeedback';
import PublicSupabaseLeadForm from './components/PublicSupabaseLeadForm';
import { ViewType, Client, Project, TeamMember, Transaction, Package, AddOn, TeamProjectPayment, Profile, FinancialPocket, TeamPaymentRecord, Lead, RewardLedgerEntry, User, Card, Asset, ClientFeedback, Contract, RevisionStatus, NavigationAction, Notification, SocialMediaPost, PromoCode, SOP, CardType, PocketType, VendorData } from './types';
import { MOCK_USERS, DEFAULT_USER_PROFILE, MOCK_DATA, HomeIcon, FolderKanbanIcon, UsersIcon, DollarSignIcon, PlusIcon, lightenColor, darkenColor, hexToHsl } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { Leads } from './components/Leads';
import Booking from './components/Booking';
import Clients from './components/Clients';
import { Projects } from './components/Projects';
import { Freelancers } from './components/Freelancers';
import Finance from './components/Finance';
import Packages from './components/Packages';
import Assets from './components/Assets';
import Settings from './components/Settings';
import { CalendarView } from './components/CalendarView';
import Login from './components/Login';
import PublicBookingForm from './components/PublicBookingForm';
import PublicPackages from './components/PublicPackages';
import PublicFeedbackForm from './components/PublicFeedbackForm';
import PublicRevisionForm from './components/PublicRevisionForm';
import PublicLeadForm from './components/PublicLeadForm';
import Header from './components/Header';
import SuggestionForm from './components/SuggestionForm';
import ClientReports from './components/ClientKPI';
import GlobalSearch from './components/GlobalSearch';
import Contracts from './components/Contracts';
import ClientPortal from './components/ClientPortal';
import FreelancerPortal from './components/FreelancerPortal';
import { SocialPlanner } from './components/SocialPlanner';
import PromoCodes from './components/PromoCodes';
import SOPManagement from './components/SOP';
import Homepage from './components/Homepage';

const AccessDenied: React.FC<{onBackToDashboard: () => void}> = ({ onBackToDashboard }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-2xl font-bold text-brand-danger mb-2">Akses Ditolak</h2>
        <p className="text-brand-text-secondary mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <button onClick={onBackToDashboard} className="button-primary">Kembali ke Dashboard</button>
    </div>
);

const BottomNavBar: React.FC<{ activeView: ViewType; handleNavigation: (view: ViewType) => void }> = ({ activeView, handleNavigation }) => {
    const navItems = [
        { view: ViewType.DASHBOARD, label: 'Beranda', icon: HomeIcon },
        { view: ViewType.PROJECTS, label: 'Proyek', icon: FolderKanbanIcon },
        { view: ViewType.CLIENTS, label: 'Klien', icon: UsersIcon },
        { view: ViewType.FINANCE, label: 'Keuangan', icon: DollarSignIcon },
    ];

    return (
        <nav className="bottom-nav xl:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => handleNavigation(item.view)}
                        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activeView === item.view ? 'text-brand-accent' : 'text-brand-text-secondary'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

const App: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { clients, createClient, updateClient, deleteClient } = useClients();
  const { packages, createPackage, updatePackage, deletePackage } = usePackages();
  const { leads, createLead, updateLead, deleteLead } = useLeads();
  const { projects, createProject, updateProject, deleteProject } = useProjects();
  const { addOns, createAddOn, updateAddOn, deleteAddOn } = useAddOns();
  const { transactions, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { promoCodes, createPromoCode, updatePromoCode, deletePromoCode } = usePromoCodes();
  const { teamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const { contracts, createContract, updateContract, deleteContract } = useContracts();
  const { assets, createAsset, updateAsset, deleteAsset } = useAssets();
  const { sops, createSop, updateSop, deleteSop } = useSops();
  
  const [activeView, setActiveView] = useState<ViewType>(ViewType.HOMEPAGE);
  const [notification, setNotification] = useState<string>('');
  const [initialAction, setInitialAction] = useState<NavigationAction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [route, setRoute] = useState(window.location.hash || '#/home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- Mock data for features not yet integrated with Supabase ---
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.teamProjectPayments)));
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<TeamPaymentRecord[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.teamPaymentRecords)));
  const [pockets, setPockets] = useState<FinancialPocket[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.pockets)));
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<RewardLedgerEntry[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.rewardLedgerEntries)));
  const [cards, setCards] = useState<Card[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.cards)));
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.clientFeedback)));
  const [notifications, setNotifications] = useState<Notification[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.notifications)));
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>(() => JSON.parse(JSON.stringify(MOCK_DATA.socialMediaPosts)));


    // --- [NEW] MOCK EMAIL SERVICE ---
    const sendEmailNotification = (recipientEmail: string, notification: Notification) => {
        console.log(`
        ========================================
        [SIMULASI EMAIL] Mengirim notifikasi ke: ${recipientEmail}
        ----------------------------------------
        Judul: ${notification.title}
        Pesan: ${notification.message}
        Waktu: ${new Date(notification.timestamp).toLocaleString('id-ID')}
        ========================================
        `);
    };

    // --- [NEW] CENTRALIZED NOTIFICATION HANDLER ---
    const addNotification = (newNotificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotification: Notification = {
            id: `NOTIF-${Date.now()}`,
            timestamp: new Date().toISOString(),
            isRead: false,
            ...newNotificationData
        };

        setNotifications(prev => [newNotification, ...prev]);

        if (profile.email) {
            sendEmailNotification(profile.email, newNotification);
        } else {
            console.warn('[SIMULASI EMAIL] Gagal: Alamat email vendor tidak diatur di Pengaturan Profil.');
        }
    };

  useEffect(() => {
    const handleHashChange = () => {
        const newRoute = window.location.hash || '#/home';
        setRoute(newRoute);
        if (!user) {
            const isPublicRoute = newRoute.startsWith('#/public') || newRoute.startsWith('#/feedback') || newRoute.startsWith('#/suggestion-form') || newRoute.startsWith('#/revision-form') || newRoute.startsWith('#/portal') || newRoute.startsWith('#/freelancer-portal') || newRoute.startsWith('#/login') || newRoute === '#/home' || newRoute === '#';
            if (!isPublicRoute) {
                window.location.hash = '#/home';
            }
        }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);
  
  useEffect(() => {
        const styleElement = document.getElementById('public-theme-style');
        const isPublicRoute = route.startsWith('#/public') || route.startsWith('#/portal') || route.startsWith('#/freelancer-portal');
        
        document.body.classList.toggle('app-theme', !isPublicRoute);
        document.body.classList.toggle('public-page-body', isPublicRoute);

        if (isPublicRoute) {
            const brandColor = profile?.brandColor || '#3b82f6';
            
            if (styleElement) {
                const hoverColor = darkenColor(brandColor, 10);
                const brandHsl = hexToHsl(brandColor);
                styleElement.innerHTML = `
                    :root {
                        --public-accent: ${brandColor};
                        --public-accent-hover: ${hoverColor};
                        --public-accent-hsl: ${brandHsl};
                    }
                `;
            }
        } else if (styleElement) {
            styleElement.innerHTML = '';
        }

    }, [route, profile?.brandColor]);

  const showNotification = (message: string, duration: number = 3000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, duration);
  };

  const handleAuthSuccess = () => {
    window.location.hash = '#/dashboard';
    setActiveView(ViewType.DASHBOARD);
  };
  
  const handleLogout = () => {
    signOut();
    window.location.hash = '#/home';
    setActiveView(ViewType.HOMEPAGE);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNavigation = (view: ViewType, action?: NavigationAction, notificationId?: string) => {
    const viewRouteMap: { [key in ViewType]?: string } = {
        [ViewType.HOMEPAGE]: '#/home',
        [ViewType.DASHBOARD]: '#/dashboard',
        [ViewType.CLIENTS]: '#/clients',
        [ViewType.PROJECTS]: '#/projects',
    };

    const routeKey = Object.keys(viewRouteMap).find(key => key === view) as ViewType | undefined;
    
    let newRoute = '#/dashboard'; // Default fallback
    if (routeKey && viewRouteMap[routeKey]) {
        newRoute = viewRouteMap[routeKey]!;
    } else {
        newRoute = `#/${view.toLowerCase().replace(/ /g, '-')}`;
    }

    window.location.hash = newRoute;

    setActiveView(view);
    setInitialAction(action || null);
    setIsSidebarOpen(false); // Close sidebar on navigation
    setIsSearchOpen(false); // Close search on navigation
    if (notificationId) {
        handleMarkAsRead(notificationId);
    }
  };

  const hasPermission = (view: ViewType) => {
    if (!user) return false;
    // For now, all authenticated users have access to all views
    // In a real app, you'd check user roles and permissions
    if (view === ViewType.DASHBOARD) return true;
    return true;
  };
  
  // Show loading while checking authentication
  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto"></div>
          <p className="mt-4 text-brand-text-secondary">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    if (!hasPermission(activeView)) {
        return <AccessDenied onBackToDashboard={() => setActiveView(ViewType.DASHBOARD)} />;
    }
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard 
          projects={projects} 
          clients={clients} 
          transactions={transactions} 
          teamMembers={teamMembers}
          cards={cards}
          pockets={pockets}
          handleNavigation={handleNavigation}
          leads={leads}
          teamProjectPayments={teamProjectPayments}
          packages={packages}
          assets={assets}
          clientFeedback={clientFeedback}
          contracts={contracts}
          currentUser={null}
          projectStatusConfig={profile?.projectStatusConfig || []}
        />;
      case ViewType.PROSPEK:
        return <Leads
            leads={leads} createLead={createLead} updateLead={updateLead} deleteLead={deleteLead}
            clients={clients} createClient={createClient}
            projects={projects} createProject={createProject}
            packages={packages} addOns={addOns}
            transactions={transactions} createTransaction={createTransaction}
            userProfile={profile || MOCK_DATA.profile} setProfile={updateProfile} showNotification={showNotification}
            cards={cards} setCards={setCards}
            pockets={pockets} setPockets={setPockets}
            promoCodes={promoCodes}
        />;
      case ViewType.BOOKING:
        return <Booking
            leads={leads}
            clients={clients}
            projects={projects}
            createProject={createProject}
            packages={packages}
            userProfile={profile}
            setProfile={updateProfile}
            handleNavigation={handleNavigation}
            showNotification={showNotification}
        />;
      case ViewType.CLIENTS:
        return <Clients
          clients={clients} createClient={createClient} updateClient={updateClient} deleteClient={deleteClient}
          projects={projects} createProject={createProject} updateProject={updateProject}
          packages={packages} addOns={addOns}
          transactions={transactions} createTransaction={createTransaction}
          userProfile={profile || MOCK_DATA.profile}
          showNotification={showNotification}
          initialAction={initialAction} setInitialAction={setInitialAction}
          cards={cards} setCards={setCards}
          pockets={pockets} setPockets={setPockets}
          contracts={contracts}
          handleNavigation={handleNavigation}
          clientFeedback={clientFeedback}
          promoCodes={promoCodes} createPromoCode={createPromoCode} updatePromoCode={updatePromoCode}
          onSignInvoice={(pId, sig) => updateProject(pId, { invoiceSignature: sig })}
          onSignTransaction={(tId, sig) => updateTransaction(tId, { vendorSignature: sig })}
          addNotification={addNotification}
        />;
      case ViewType.PROJECTS:
        return <Projects 
          projects={projects} createProject={createProject} updateProject={updateProject} deleteProject={deleteProject}
          clients={clients}
          packages={packages}
          teamMembers={teamMembers}
          teamProjectPayments={teamProjectPayments} setTeamProjectPayments={setTeamProjectPayments}
          transactions={transactions} createTransaction={createTransaction}
          initialAction={initialAction} setInitialAction={setInitialAction}
          profile={profile || MOCK_DATA.profile}
          showNotification={showNotification}
          cards={cards}
          setCards={setCards}
        />;
      case ViewType.TEAM:
        return (
          <Freelancers
            teamMembers={teamMembers}
            createTeamMember={createTeamMember}
            updateTeamMember={updateTeamMember}
            deleteTeamMember={deleteTeamMember}
            teamProjectPayments={teamProjectPayments}
            setTeamProjectPayments={setTeamProjectPayments}
            teamPaymentRecords={teamPaymentRecords}
            setTeamPaymentRecords={setTeamPaymentRecords}
            transactions={transactions}
            createTransaction={createTransaction}
            userProfile={profile || MOCK_DATA.profile}
            showNotification={showNotification}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            projects={projects}
            updateProject={updateProject}
            rewardLedgerEntries={rewardLedgerEntries}
            setRewardLedgerEntries={setRewardLedgerEntries}
            pockets={pockets}
            setPockets={setPockets}
            cards={cards}
            setCards={setCards}
            onSignPaymentRecord={(rId, sig) => setTeamPaymentRecords(prev => prev.map(r => r.id === rId ? { ...r, vendorSignature: sig } : r))}
          />
        );
      case ViewType.FINANCE:
        return <Finance 
          transactions={transactions}
          createTransaction={createTransaction}
          updateTransaction={updateTransaction}
          deleteTransaction={deleteTransaction}
          pockets={pockets} setPockets={setPockets}
          projects={projects}
          profile={profile || MOCK_DATA.profile}
          cards={cards} setCards={setCards}
          teamMembers={teamMembers}
          rewardLedgerEntries={rewardLedgerEntries}
        />;
      case ViewType.PACKAGES:
        return <Packages
            packages={packages}
            createPackage={createPackage}
            updatePackage={updatePackage}
            deletePackage={deletePackage}
            addOns={addOns}
            createAddOn={createAddOn}
            updateAddOn={updateAddOn}
            deleteAddOn={deleteAddOn}
            projects={projects}
        />;
      case ViewType.ASSETS:
        return <Assets
            assets={assets}
            createAsset={createAsset}
            updateAsset={updateAsset}
            deleteAsset={deleteAsset}
            profile={profile || MOCK_DATA.profile}
            showNotification={showNotification}
        />;
      case ViewType.CONTRACTS:
        return <Contracts 
            contracts={contracts}
            createContract={createContract}
            updateContract={updateContract}
            deleteContract={deleteContract}
            clients={clients}
            projects={projects}
            profile={profile || MOCK_DATA.profile}
            showNotification={showNotification}
            initialAction={initialAction} setInitialAction={setInitialAction}
            packages={packages}
            onSignContract={(cId, sig, signer) => updateContract(cId, { [signer === 'vendor' ? 'vendorSignature' : 'clientSignature']: sig })}
        />;
      case ViewType.SOP:
        return <SOPManagement
            sops={sops}
            createSop={createSop}
            updateSop={updateSop}
            deleteSop={deleteSop}
            profile={profile || MOCK_DATA.profile}
            showNotification={showNotification}
        />;
      case ViewType.SETTINGS:
        return <Settings 
          profile={profile || MOCK_DATA.profile}
          updateProfile={updateProfile}
          transactions={transactions}
          projects={projects}
          users={[]} // Empty for now since user management is not implemented
          setUsers={() => {}}
          currentUser={null}
        />;
      case ViewType.CALENDAR:
        return <CalendarView
            projects={projects}
            updateProject={updateProject}
            teamMembers={teamMembers}
            profile={profile || MOCK_DATA.profile}
        />;
      case ViewType.CLIENT_REPORTS:
        return <ClientReports 
            clients={clients}
            leads={leads}
            projects={projects}
            feedback={clientFeedback}
            setFeedback={setClientFeedback}
            showNotification={showNotification}
        />;
      case ViewType.SOCIAL_MEDIA_PLANNER:
        return <SocialPlanner posts={socialMediaPosts} setPosts={setSocialMediaPosts} projects={projects} showNotification={showNotification} />;
      case ViewType.PROMO_CODES:
        return <PromoCodes
            promoCodes={promoCodes}
            createPromoCode={createPromoCode}
            updatePromoCode={updatePromoCode}
            deletePromoCode={deletePromoCode}
            projects={projects}
            showNotification={showNotification}
        />;
      default:
        return <div />;
    }
  };
  
  // --- ROUTING LOGIC ---
  if (route.startsWith('#/home') || route === '#/') return <Homepage />;
  if (route.startsWith('#/login')) return <SupabaseAuth onAuthSuccess={handleAuthSuccess} />;
  
  if (route.startsWith('#/public-packages')) {
    const vendorId = route.split('/public-packages/')[1];
    return <PublicSupabaseBooking vendorId={vendorId} />;
  }
  if (route.startsWith('#/public-booking')) {
    const vendorId = route.split('/public-booking/')[1];
    return <PublicSupabaseBooking vendorId={vendorId} />;
  }
  if (route.startsWith('#/public-lead-form')) {
    const vendorId = route.split('/public-lead-form/')[1];
    return <PublicSupabaseLeadForm vendorId={vendorId} />;
  }
  
  if (route.startsWith('#/feedback')) {
    const vendorId = route.split('/feedback/')[1] || 'default';
    return <PublicSupabaseFeedback vendorId={vendorId} />;
  }
  if (route.startsWith('#/suggestion-form')) return <SuggestionForm setLeads={setLeads} />;
  if (route.startsWith('#/revision-form')) return <PublicRevisionForm projects={projects} teamMembers={teamMembers} onUpdateRevision={(pId, rId, data) => {
    // For now, just log the revision update
    console.log('Revision update:', pId, rId, data);
  }} />;
  if (route.startsWith('#/portal/')) {
    const accessId = route.split('/portal/')[1];
    return <ClientPortal accessId={accessId} clients={clients} projects={projects} setClientFeedback={setClientFeedback} showNotification={showNotification} contracts={contracts} transactions={transactions} userProfile={profile || MOCK_DATA.profile} packages={packages} onClientConfirmation={(pId, stage) => {
      console.log('Client confirmation:', pId, stage);
    }} onClientSubStatusConfirmation={(pId, sub, note) => {
      console.log('Client sub-status confirmation:', pId, sub, note);
    }} onSignContract={(cId, sig, signer) => setContracts(prev => prev.map(c => c.id === cId ? {...c, [signer === 'vendor' ? 'vendorSignature' : 'clientSignature']: sig} : c))} />;
  }
  if (route.startsWith('#/freelancer-portal/')) {
     const accessId = route.split('/freelancer-portal/')[1];
     return <FreelancerPortal accessId={accessId} teamMembers={teamMembers} projects={projects} teamProjectPayments={teamProjectPayments} teamPaymentRecords={teamPaymentRecords} rewardLedgerEntries={rewardLedgerEntries} showNotification={showNotification} onUpdateRevision={(pId, rId, data) => {
       console.log('Revision update:', pId, rId, data);
     }} sops={sops} userProfile={profile || MOCK_DATA.profile} />;
  }

  if (!user) return <SupabaseAuth onAuthSuccess={handleAuthSuccess} />;

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text-primary">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => handleNavigation(view)} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        currentUser={null}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            pageTitle={activeView} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            setIsSearchOpen={setIsSearchOpen}
            notifications={notifications}
            handleNavigation={handleNavigation}
            handleMarkAllAsRead={handleMarkAllAsRead}
            currentUser={null}
            profile={profile || MOCK_DATA.profile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 xl:pb-8">
            {renderView()}
        </main>
      </div>
      {notification && (
        <div className="fixed top-5 right-5 bg-brand-accent text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {notification}
        </div>
      )}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        clients={clients}
        projects={projects}
        teamMembers={teamMembers}
        handleNavigation={handleNavigation}
      />
      <BottomNavBar activeView={activeView} handleNavigation={handleNavigation} />
    </div>
  );
};

export default App;
