import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AdminPortal() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalLeads: 0,
        newLeads: 0,
        totalClients: 0,
        activeProjects: 0,
        totalRevenue: 0,
        pendingTickets: 0
    });
    const [leads, setLeads] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [debugInfo, setDebugInfo] = useState(null);
    const router = useRouter();

    // Function to create admin user document for testing
    const createAdminUser = async () => {
        if (!auth.currentUser) {
            alert('No user authenticated');
            return;
        }

        try {
            const user = auth.currentUser;
            const userData = {
                name: user.displayName || 'Admin User',
                email: user.email,
                role: 'admin',
                uid: user.uid,
                emailVerified: user.emailVerified,
                displayName: user.displayName,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Try to create user document by UID
            await setDoc(doc(db, 'users', user.uid), userData);
            alert('Admin user document created successfully! Please refresh the page.');
            window.location.reload();
        } catch (error) {
            console.error('Error creating admin user:', error);
            alert('Error creating admin user: ' + error.message);
        }
    };

    // Temporary debug function to check user status
    const checkUserStatus = async () => {
        if (!auth.currentUser) {
            setDebugInfo('No user authenticated');
            return;
        }

        const user = auth.currentUser;
        let debugData = {
            uid: user.uid,
            email: user.email,
            userDocExists: false,
            userData: null,
            role: null,
            error: null,
            approach: null
        };

        try {
            // Check if user document exists by doc ID (primary approach)
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                debugData.userDocExists = true;
                debugData.userData = userDoc.data();
                debugData.role = userDoc.data().role;
                debugData.approach = 'document_id';
            } else {
                debugData.approach = 'email_query_fallback';

                // Try query by email as fallback
                const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
                const userSnapshot = await getDocs(userQuery);
                if (!userSnapshot.empty) {
                    debugData.userDocExists = true;
                    debugData.userData = userSnapshot.docs[0].data();
                    debugData.role = userSnapshot.docs[0].data().role;
                }
            }

        } catch (error) {
            debugData.error = error.message;
        }

        setDebugInfo(debugData);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    console.log('User authenticated:', user.email);
                    console.log('User UID:', user.uid);

                    // Check if user is admin - use simple, reliable approach
                    let isAdmin = false;
                    let userData = null;

                    // Try to get user document by UID as document ID (most common approach)
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists()) {
                            userData = userDoc.data();
                            console.log('User data found by doc ID:', userData);
                            isAdmin = userData.role === 'admin';
                        } else {
                            console.log('User document not found by doc ID, trying email query...');

                            // Fallback: try query by email if document ID approach fails
                            const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
                            const userSnapshot = await getDocs(userQuery);
                            if (!userSnapshot.empty) {
                                userData = userSnapshot.docs[0].data();
                                console.log('User data found by email query:', userData);
                                isAdmin = userData.role === 'admin';
                            } else {
                                console.log('User document not found by email query either');
                            }
                        }
                    } catch (error) {
                        console.error('Error checking admin status:', error);
                        // Try email query as fallback
                        try {
                            const userQuery = query(collection(db, 'users'), where('email', '==', user.email));
                            const userSnapshot = await getDocs(userQuery);
                            if (!userSnapshot.empty) {
                                userData = userSnapshot.docs[0].data();
                                console.log('User data found by email query (fallback):', userData);
                                isAdmin = userData.role === 'admin';
                            }
                        } catch (fallbackError) {
                            console.error('Fallback query also failed:', fallbackError);
                        }
                    }

                    console.log('Final admin check result:', isAdmin);
                    console.log('User data:', userData);

                    if (isAdmin) {
                        console.log('User is admin, setting up admin portal');
                        setUser(user);
                        await loadAllData();
                    } else {
                        console.log('User is not admin or user document not found, redirecting to login');
                        console.log('User role:', userData?.role);
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    router.push('/login');
                }
            } else {
                console.log('No user authenticated, redirecting to login');
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const loadAllData = async () => {
        try {
            console.log('Loading admin data...');

            // Load leads
            try {
                const leadsQuery = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
                const leadsSnapshot = await getDocs(leadsQuery);
                const leadsData = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLeads(leadsData);
                console.log('Loaded leads:', leadsData.length);
            } catch (error) {
                console.error('Error loading leads:', error);
                setLeads([]);
            }

            const newLeads = leads.filter(lead => lead.status === 'new');

            // Load clients
            try {
                const clientsQuery = query(collection(db, 'users'), where('role', '==', 'client'));
                const clientsSnapshot = await getDocs(clientsQuery);
                const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setClients(clientsData);
                console.log('Loaded clients:', clientsData.length);
            } catch (error) {
                console.error('Error loading clients:', error);
                setClients([]);
            }

            // Load projects
            try {
                const projectsQuery = query(collection(db, 'projects'), orderBy('timestamp', 'desc'));
                const projectsSnapshot = await getDocs(projectsQuery);
                const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(projectsData);
                console.log('Loaded projects:', projectsData.length);
            } catch (error) {
                console.error('Error loading projects:', error);
                setProjects([]);
            }

            // Load tickets
            try {
                const ticketsQuery = query(collection(db, 'tickets'), orderBy('timestamp', 'desc'));
                const ticketsSnapshot = await getDocs(ticketsQuery);
                const ticketsData = ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTickets(ticketsData);
                console.log('Loaded tickets:', ticketsData.length);
            } catch (error) {
                console.error('Error loading tickets:', error);
                setTickets([]);
            }

            // Load blog posts
            try {
                const blogQuery = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'));
                const blogSnapshot = await getDocs(blogQuery);
                const blogData = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBlogPosts(blogData);
                console.log('Loaded blog posts:', blogData.length);
            } catch (error) {
                console.error('Error loading blog posts:', error);
                setBlogPosts([]);
            }

            // Calculate revenue
            const totalRevenue = leads.reduce((sum, lead) => {
                if (lead.status === 'closed' && lead.quote) {
                    return sum + (lead.quote.finalPrice || 0);
                }
                return sum;
            }, 0);

            setStats({
                totalLeads: leads.length,
                newLeads: newLeads.length,
                totalClients: clients.length,
                activeProjects: projects.filter(p => p.status === 'active').length,
                totalRevenue,
                pendingTickets: tickets.filter(t => t.status === 'open').length
            });

            console.log('Admin data loading completed');

        } catch (error) {
            console.error('Error loading admin data:', error);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
            await loadAllData(); // Refresh data
        } catch (error) {
            console.error('Error updating lead status:', error);
        }
    };

    const updateTicketStatus = async (ticketId, newStatus) => {
        try {
            await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
            await loadAllData(); // Refresh data
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading admin portal...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Debug section for non-admin users
    if (!user) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-4">You don't have admin privileges or your user document is not properly configured.</p>

                        <button
                            onClick={checkUserStatus}
                            className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Check User Status
                        </button>

                        <button
                            onClick={createAdminUser}
                            className="w-full mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Create Admin User Document (for testing)
                        </button>

                        {debugInfo && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                <h3 className="font-semibold mb-2">Debug Information:</h3>
                                <pre className="text-xs text-gray-700 overflow-auto">
                                    {typeof debugInfo === 'string' ? debugInfo : JSON.stringify(debugInfo, null, 2)}
                                </pre>
                            </div>
                        )}

                        <div className="mt-4 text-sm text-gray-500">
                            <p>If you believe you should have admin access, please:</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>Check that your user document exists in Firestore</li>
                                <li>Verify your role is set to 'admin'</li>
                                <li>Click "Check User Status" to see debug information</li>
                                <li>If no user document exists, click "Create Admin User Document"</li>
                                <li>Contact the system administrator if issues persist</li>
                            </ul>

                            <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                <h4 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h4>
                                <ol className="list-decimal list-inside text-blue-800 space-y-1">
                                    <li>Click "Check User Status" to see your current user data</li>
                                    <li>If no user document exists, click "Create Admin User Document"</li>
                                    <li>Refresh the page after creating the admin document</li>
                                    <li>If you still can't access, check the browser console for errors</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-8">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                                { id: 'leads', name: 'Lead Management', icon: '👥' },
                                { id: 'clients', name: 'Client Management', icon: '👤' },
                                { id: 'projects', name: 'Project Oversight', icon: '📁' },
                                { id: 'tickets', name: 'Support Tickets', icon: '🎫' },
                                { id: 'blog', name: 'Blog Management', icon: '📝' },
                                { id: 'pricing', name: 'Pricing Management', icon: '💰' },
                                { id: 'analytics', name: 'Analytics', icon: '📈' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white rounded-lg shadow">
                        {activeTab === 'dashboard' && (
                            <DashboardTab stats={stats} leads={leads} projects={projects} />
                        )}
                        {activeTab === 'leads' && (
                            <LeadsTab leads={leads} onUpdateStatus={updateLeadStatus} />
                        )}
                        {activeTab === 'clients' && (
                            <ClientsTab clients={clients} />
                        )}
                        {activeTab === 'projects' && (
                            <ProjectsTab projects={projects} />
                        )}
                        {activeTab === 'tickets' && (
                            <TicketsTab tickets={tickets} onUpdateStatus={updateTicketStatus} />
                        )}
                        {activeTab === 'blog' && (
                            <BlogTab blogPosts={blogPosts} onRefresh={loadAllData} />
                        )}
                        {activeTab === 'pricing' && (
                            <PricingTab />
                        )}
                        {activeTab === 'analytics' && (
                            <AnalyticsTab stats={stats} leads={leads} projects={projects} />
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

// Dashboard Tab Component
function DashboardTab({ stats, leads, projects }) {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">New Leads</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Clients</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Tickets</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingTickets}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Leads</h3>
                    <div className="space-y-3">
                        {leads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{lead.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">{lead.email}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                        lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {lead.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Projects</h3>
                    <div className="space-y-3">
                        {projects.slice(0, 5).map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{project.title || 'Untitled Project'}</p>
                                    <p className="text-sm text-gray-600">{project.clientId}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Leads Tab Component
function LeadsTab({ leads, onUpdateStatus }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [notes, setNotes] = useState('');
    const [nextAction, setNextAction] = useState('');

    const filteredLeads = filterStatus === 'all'
        ? leads
        : leads.filter(lead => lead.status === filterStatus);

    const handleLeadAction = async (leadId, action) => {
        try {
            const leadData = {
                status: action,
                lastAction: action,
                lastActionDate: new Date(),
                notes: notes,
                nextAction: nextAction
            };

            await updateDoc(doc(db, 'leads', leadId), leadData);
            setShowLeadModal(false);
            setNotes('');
            setNextAction('');
            setSelectedLead(null);
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const openLeadModal = (lead) => {
        setSelectedLead(lead);
        setShowLeadModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
                <div className="flex space-x-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                        <option value="lost">Lost</option>
                    </select>
                    <button
                        onClick={() => window.open('/admin/leads/cold-calling', '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Cold Calling Pipeline
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{lead.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{lead.phone || 'No phone'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.industry || 'Unknown'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.source || 'Unknown'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                                            lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                                lead.status === 'closed' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {lead.timestamp?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openLeadModal(lead)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                        >
                                            Manage
                                        </button>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded text-xs"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="closed">Closed</option>
                                            <option value="lost">Lost</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Lead Management Modal */}
            {showLeadModal && selectedLead && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Lead: {selectedLead.name}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                    placeholder="Add notes about this lead..."
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Next Action</label>
                                <select
                                    value={nextAction}
                                    onChange={(e) => setNextAction(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select next action</option>
                                    <option value="call">Call</option>
                                    <option value="email">Send Email</option>
                                    <option value="meeting">Schedule Meeting</option>
                                    <option value="proposal">Send Proposal</option>
                                    <option value="follow-up">Follow Up</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowLeadModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleLeadAction(selectedLead.id, 'contacted')}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                >
                                    Mark Contacted
                                </button>
                                <button
                                    onClick={() => handleLeadAction(selectedLead.id, 'qualified')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Mark Qualified
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Clients Tab Component
function ClientsTab({ clients }) {
    const [selectedClient, setSelectedClient] = useState(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientNotes, setClientNotes] = useState('');

    const handleClientAction = async (clientId, action) => {
        try {
            const clientData = {
                status: action,
                lastAction: action,
                lastActionDate: new Date(),
                notes: clientNotes
            };

            await updateDoc(doc(db, 'users', clientId), clientData);
            setShowClientModal(false);
            setClientNotes('');
            setSelectedClient(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    const openClientModal = (client) => {
        setSelectedClient(client);
        setShowClientModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
                <button
                    onClick={() => window.open('/admin/clients/add', '_blank')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Add New Client
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{client.name || 'Unknown'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openClientModal(client)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                        >
                                            Manage
                                        </button>
                                        <button
                                            onClick={() => window.open(`/admin/clients/${client.id}`, '_blank')}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Client Management Modal */}
            {showClientModal && selectedClient && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Client: {selectedClient.name}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client Notes</label>
                                <textarea
                                    value={clientNotes}
                                    onChange={(e) => setClientNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                    placeholder="Add notes about this client..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowClientModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleClientAction(selectedClient.id, 'active')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Mark Active
                                </button>
                                <button
                                    onClick={() => handleClientAction(selectedClient.id, 'inactive')}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Mark Inactive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Projects Tab Component
function ProjectsTab({ projects }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [projectNotes, setProjectNotes] = useState('');
    const [projectStatus, setProjectStatus] = useState('');

    const handleProjectAction = async (projectId, action) => {
        try {
            const projectData = {
                status: action,
                lastUpdate: new Date(),
                notes: projectNotes
            };

            await updateDoc(doc(db, 'projects', projectId), projectData);
            setShowProjectModal(false);
            setProjectNotes('');
            setProjectStatus('');
            setSelectedProject(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const openProjectModal = (project) => {
        setSelectedProject(project);
        setProjectStatus(project.status);
        setShowProjectModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Project Oversight</h2>
                <button
                    onClick={() => window.open('/admin/projects/add', '_blank')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Add New Project
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{project.title || 'Untitled Project'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.clientId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.industry || 'Unknown'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                            project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {project.timestamp?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openProjectModal(project)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                        >
                                            Manage
                                        </button>
                                        <button
                                            onClick={() => window.open(`/admin/projects/${project.id}`, '_blank')}
                                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Project Management Modal */}
            {showProjectModal && selectedProject && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Project: {selectedProject.title}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Status</label>
                                <select
                                    value={projectStatus}
                                    onChange={(e) => setProjectStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Notes</label>
                                <textarea
                                    value={projectNotes}
                                    onChange={(e) => setProjectNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                    placeholder="Add project notes..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowProjectModal(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleProjectAction(selectedProject.id, projectStatus)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Tickets Tab Component
function TicketsTab({ tickets, onUpdateStatus }) {
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredTickets = filterStatus === 'all'
        ? tickets
        : tickets.filter(ticket => ticket.status === filterStatus);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{ticket.subject || 'No subject'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.clientId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {ticket.priority || 'low'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                                        ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {ticket.timestamp?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Pricing Tab Component
function PricingTab() {
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [pricingData, setPricingData] = useState({});
    const [loading, setLoading] = useState(false);
    const [allPricingData, setAllPricingData] = useState({});
    const [formLoading, setFormLoading] = useState(false);

    // All supported currencies from the pricing table
    const currencies = [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
        { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
        { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal' },
        { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar' },
        { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar' },
        { code: 'OMR', symbol: 'OMR', name: 'Omani Rial' }
    ];

    // Default pricing structure
    const defaultPricing = {
        // Setup fees
        staticSetup: 0,
        dynamicSetup: 0,
        ecommerceSetup: 0,

        // Monthly fees
        staticMonthly: 0,
        dynamicMonthly: 0,
        ecommerceMonthly: 0,

        // Add-ons
        extraPage: 0,
        extraProduct: 0,
        paymentGateway: 0,
        emailAccount: 0,

        // Additional Features
        contactForms: 0,
        newsletterSignup: 0,
        socialMediaIntegration: 0,
        googleMapsIntegration: 0,
        bookingAppointmentSystem: 0,
        liveChat: 0,
        multiLanguageSupport: 0,
        searchFunctionality: 0,
        imageGallery: 0,
        videoIntegration: 0,

        // Long-term discounts
        yearlyDiscount: 0,
        twoYearDiscount: 0,
        threeYearDiscount: 0
    };

    // Load all pricing data on component mount
    useEffect(() => {
        loadAllPricingData();
    }, []);

    // Load pricing data when currency changes
    useEffect(() => {
        loadPricingData(selectedCurrency);
    }, [selectedCurrency]);

    // Load all pricing data
    const loadAllPricingData = async () => {
        try {
            const pricingPromises = currencies.map(async (currency) => {
                try {
                    const docRef = doc(db, 'pricing', currency.code);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        return { [currency.code]: docSnap.data() };
                    } else {
                        return { [currency.code]: defaultPricing };
                    }
                } catch (error) {
                    console.error(`Error loading pricing for ${currency.code}:`, error);
                    return { [currency.code]: defaultPricing };
                }
            });

            const results = await Promise.all(pricingPromises);
            const allData = results.reduce((acc, data) => ({ ...acc, ...data }), {});
            setAllPricingData(allData);
        } catch (error) {
            console.error('Error loading all pricing data:', error);
        }
    };

    // Load pricing data for selected currency
    const loadPricingData = async (currency) => {
        setFormLoading(true);
        try {
            const docRef = doc(db, 'pricing', currency);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPricingData({ ...defaultPricing, ...docSnap.data() });
            } else {
                setPricingData(defaultPricing);
            }
        } catch (error) {
            console.error('Error loading pricing data:', error);
            setPricingData(defaultPricing);
        } finally {
            setFormLoading(false);
        }
    };

    // Save pricing data
    const savePricingData = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'pricing', selectedCurrency), {
                ...pricingData,
                lastUpdated: new Date(),
                currency: selectedCurrency
            });

            // Update local state
            setAllPricingData(prev => ({
                ...prev,
                [selectedCurrency]: { ...pricingData, lastUpdated: new Date(), currency: selectedCurrency }
            }));

            alert('Pricing updated successfully!');
        } catch (error) {
            console.error('Error saving pricing:', error);
            alert('Error saving pricing: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setPricingData(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    // Format price with currency symbol
    const formatPrice = (price, currencyCode) => {
        const currency = currencies.find(c => c.code === currencyCode);
        if (!currency) return price;

        if (currencyCode === 'INR') {
            return `${currency.symbol}${price.toLocaleString('en-IN')}`;
        } else {
            return `${currency.symbol}${price}`;
        }
    };

    // Function to populate initial pricing data based on the pricing table
    const populateInitialPricing = async () => {
        if (!confirm('This will populate initial pricing data for all currencies. Continue?')) {
            return;
        }

        const initialPricing = {
            INR: {
                staticSetup: 4999,
                staticMonthly: 399,
                dynamicSetup: 9999,
                dynamicMonthly: 599,
                ecommerceSetup: 14999,
                ecommerceMonthly: 899,
                extraPage: 300,
                extraProduct: 20,
                paymentGateway: 500,
                emailAccount: 199,
                contactForms: 150,
                newsletterSignup: 200,
                socialMediaIntegration: 300,
                googleMapsIntegration: 250,
                bookingAppointmentSystem: 800,
                liveChat: 400,
                multiLanguageSupport: 600,
                searchFunctionality: 200,
                imageGallery: 150,
                videoIntegration: 300,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            USD: {
                staticSetup: 59,
                staticMonthly: 5,
                dynamicSetup: 120,
                dynamicMonthly: 7.2,
                ecommerceSetup: 180,
                ecommerceMonthly: 11,
                extraPage: 3,
                extraProduct: 0.2,
                paymentGateway: 5,
                emailAccount: 2.4,
                contactForms: 2,
                newsletterSignup: 2.5,
                socialMediaIntegration: 4,
                googleMapsIntegration: 3,
                bookingAppointmentSystem: 10,
                liveChat: 5,
                multiLanguageSupport: 8,
                searchFunctionality: 2.5,
                imageGallery: 2,
                videoIntegration: 4,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            CAD: {
                staticSetup: 80,
                staticMonthly: 6,
                dynamicSetup: 160,
                dynamicMonthly: 10,
                ecommerceSetup: 240,
                ecommerceMonthly: 14,
                extraPage: 4,
                extraProduct: 0.3,
                paymentGateway: 7,
                emailAccount: 3.2,
                contactForms: 2.5,
                newsletterSignup: 3,
                socialMediaIntegration: 5,
                googleMapsIntegration: 4,
                bookingAppointmentSystem: 13,
                liveChat: 6.5,
                multiLanguageSupport: 10,
                searchFunctionality: 3,
                imageGallery: 2.5,
                videoIntegration: 5,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            EUR: {
                staticSetup: 55,
                staticMonthly: 4.4,
                dynamicSetup: 110,
                dynamicMonthly: 6.6,
                ecommerceSetup: 165,
                ecommerceMonthly: 10,
                extraPage: 3,
                extraProduct: 0.2,
                paymentGateway: 5,
                emailAccount: 2.2,
                contactForms: 2,
                newsletterSignup: 2.5,
                socialMediaIntegration: 4,
                googleMapsIntegration: 3,
                bookingAppointmentSystem: 10,
                liveChat: 5,
                multiLanguageSupport: 8,
                searchFunctionality: 2.5,
                imageGallery: 2,
                videoIntegration: 4,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            GBP: {
                staticSetup: 50,
                staticMonthly: 4,
                dynamicSetup: 100,
                dynamicMonthly: 6,
                ecommerceSetup: 150,
                ecommerceMonthly: 9,
                extraPage: 3,
                extraProduct: 0.2,
                paymentGateway: 5,
                emailAccount: 2,
                contactForms: 2,
                newsletterSignup: 2.5,
                socialMediaIntegration: 4,
                googleMapsIntegration: 3,
                bookingAppointmentSystem: 10,
                liveChat: 5,
                multiLanguageSupport: 8,
                searchFunctionality: 2.5,
                imageGallery: 2,
                videoIntegration: 4,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            SAR: {
                staticSetup: 225,
                staticMonthly: 18,
                dynamicSetup: 450,
                dynamicMonthly: 27,
                ecommerceSetup: 675,
                ecommerceMonthly: 40,
                extraPage: 12,
                extraProduct: 1,
                paymentGateway: 20,
                emailAccount: 9,
                contactForms: 7,
                newsletterSignup: 9,
                socialMediaIntegration: 15,
                googleMapsIntegration: 11,
                bookingAppointmentSystem: 37,
                liveChat: 19,
                multiLanguageSupport: 30,
                searchFunctionality: 9,
                imageGallery: 7,
                videoIntegration: 15,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            AED: {
                staticSetup: 220,
                staticMonthly: 17,
                dynamicSetup: 440,
                dynamicMonthly: 26,
                ecommerceSetup: 660,
                ecommerceMonthly: 39,
                extraPage: 12,
                extraProduct: 1,
                paymentGateway: 20,
                emailAccount: 8.8,
                contactForms: 7,
                newsletterSignup: 9,
                socialMediaIntegration: 15,
                googleMapsIntegration: 11,
                bookingAppointmentSystem: 37,
                liveChat: 19,
                multiLanguageSupport: 30,
                searchFunctionality: 9,
                imageGallery: 7,
                videoIntegration: 15,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            QAR: {
                staticSetup: 220,
                staticMonthly: 17,
                dynamicSetup: 440,
                dynamicMonthly: 26,
                ecommerceSetup: 660,
                ecommerceMonthly: 39,
                extraPage: 12,
                extraProduct: 1,
                paymentGateway: 20,
                emailAccount: 8.8,
                contactForms: 7,
                newsletterSignup: 9,
                socialMediaIntegration: 15,
                googleMapsIntegration: 11,
                bookingAppointmentSystem: 37,
                liveChat: 19,
                multiLanguageSupport: 30,
                searchFunctionality: 9,
                imageGallery: 7,
                videoIntegration: 15,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            KWD: {
                staticSetup: 18.5,
                staticMonthly: 1.5,
                dynamicSetup: 37,
                dynamicMonthly: 2.2,
                ecommerceSetup: 55,
                ecommerceMonthly: 3.3,
                extraPage: 1,
                extraProduct: 0.1,
                paymentGateway: 2,
                emailAccount: 0.74,
                contactForms: 0.6,
                newsletterSignup: 0.75,
                socialMediaIntegration: 1.2,
                googleMapsIntegration: 0.9,
                bookingAppointmentSystem: 3,
                liveChat: 1.5,
                multiLanguageSupport: 2.4,
                searchFunctionality: 0.75,
                imageGallery: 0.6,
                videoIntegration: 1.2,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            BHD: {
                staticSetup: 25,
                staticMonthly: 2,
                dynamicSetup: 50,
                dynamicMonthly: 3,
                ecommerceSetup: 75,
                ecommerceMonthly: 4.5,
                extraPage: 1.5,
                extraProduct: 0.1,
                paymentGateway: 2.5,
                emailAccount: 1,
                contactForms: 0.8,
                newsletterSignup: 1,
                socialMediaIntegration: 1.6,
                googleMapsIntegration: 1.2,
                bookingAppointmentSystem: 4,
                liveChat: 2,
                multiLanguageSupport: 3.2,
                searchFunctionality: 1,
                imageGallery: 0.8,
                videoIntegration: 1.6,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            },
            OMR: {
                staticSetup: 23,
                staticMonthly: 1.8,
                dynamicSetup: 46,
                dynamicMonthly: 2.7,
                ecommerceSetup: 69,
                ecommerceMonthly: 4.1,
                extraPage: 1.2,
                extraProduct: 0.1,
                paymentGateway: 2.3,
                emailAccount: 0.9,
                contactForms: 0.7,
                newsletterSignup: 0.9,
                socialMediaIntegration: 1.4,
                googleMapsIntegration: 1.1,
                bookingAppointmentSystem: 3.5,
                liveChat: 1.8,
                multiLanguageSupport: 2.8,
                searchFunctionality: 0.9,
                imageGallery: 0.7,
                videoIntegration: 1.4,
                yearlyDiscount: 10,
                twoYearDiscount: 15,
                threeYearDiscount: 20
            }
        };

        try {
            for (const [currency, pricing] of Object.entries(initialPricing)) {
                await setDoc(doc(db, 'pricing', currency), {
                    ...pricing,
                    lastUpdated: new Date(),
                    currency: currency
                });
                console.log(`Populated pricing for ${currency}`);
            }

            // Refresh the data
            await loadAllPricingData();
            await loadPricingData(selectedCurrency);
            alert('Initial pricing data populated successfully!');
        } catch (error) {
            console.error('Error populating initial pricing:', error);
            alert('Error populating pricing: ' + error.message);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
                    <p className="text-gray-600 mt-2">Manage pricing for all supported currencies and packages.</p>
                </div>
                <button
                    onClick={populateInitialPricing}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                    Populate Initial Data
                </button>
            </div>

            {/* Currency Selector */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Currency</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {currencies.map((currency) => (
                        <button
                            key={currency.code}
                            onClick={() => setSelectedCurrency(currency.code)}
                            className={`px-4 py-3 border rounded-lg text-center transition-colors ${selectedCurrency === currency.code
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            <div className="font-medium">{currency.code}</div>
                            <div className="text-xs text-gray-500">{currency.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Pricing Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {currencies.find(c => c.code === selectedCurrency)?.name} Pricing
                    </h3>
                    <div className="text-sm text-gray-500">
                        Last updated: {pricingData.lastUpdated?.toDate?.()?.toLocaleString() || 'Never'}
                    </div>
                </div>

                {formLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading pricing data...</span>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); savePricingData(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Setup Fees */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Setup Fees</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Static Website Setup
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.staticSetup || 0}
                                            onChange={(e) => handleInputChange('staticSetup', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dynamic Website Setup
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.dynamicSetup || 0}
                                            onChange={(e) => handleInputChange('dynamicSetup', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        E-commerce Setup
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.ecommerceSetup || 0}
                                            onChange={(e) => handleInputChange('ecommerceSetup', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Fees */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Monthly Fees</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Static Monthly
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.staticMonthly || 0}
                                            onChange={(e) => handleInputChange('staticMonthly', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dynamic Monthly
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.dynamicMonthly || 0}
                                            onChange={(e) => handleInputChange('dynamicMonthly', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        E-commerce Monthly
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.ecommerceMonthly || 0}
                                            onChange={(e) => handleInputChange('ecommerceMonthly', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Add-ons */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Add-ons</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Extra Page
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.extraPage || 0}
                                            onChange={(e) => handleInputChange('extraPage', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Extra Product
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.extraProduct || 0}
                                            onChange={(e) => handleInputChange('extraProduct', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Gateway
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.paymentGateway || 0}
                                            onChange={(e) => handleInputChange('paymentGateway', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Account
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.emailAccount || 0}
                                            onChange={(e) => handleInputChange('emailAccount', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Additional Features */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Features</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Forms
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.contactForms || 0}
                                            onChange={(e) => handleInputChange('contactForms', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Newsletter Signup
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.newsletterSignup || 0}
                                            onChange={(e) => handleInputChange('newsletterSignup', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Social Media Integration
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.socialMediaIntegration || 0}
                                            onChange={(e) => handleInputChange('socialMediaIntegration', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Google Maps Integration
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.googleMapsIntegration || 0}
                                            onChange={(e) => handleInputChange('googleMapsIntegration', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Booking/Appointment System
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.bookingAppointmentSystem || 0}
                                            onChange={(e) => handleInputChange('bookingAppointmentSystem', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Live Chat
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.liveChat || 0}
                                            onChange={(e) => handleInputChange('liveChat', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Multi-language Support
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.multiLanguageSupport || 0}
                                            onChange={(e) => handleInputChange('multiLanguageSupport', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Functionality
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.searchFunctionality || 0}
                                            onChange={(e) => handleInputChange('searchFunctionality', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image Gallery
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.imageGallery || 0}
                                            onChange={(e) => handleInputChange('imageGallery', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video Integration
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            {currencies.find(c => c.code === selectedCurrency)?.symbol}
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={pricingData.videoIntegration || 0}
                                            onChange={(e) => handleInputChange('videoIntegration', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Long-term Discounts */}
                        <div className="mt-8 pt-6 border-t">
                            <h4 className="font-semibold text-gray-900 border-b pb-2 mb-4">Long-term Discounts (%)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Yearly Discount (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={pricingData.yearlyDiscount || 0}
                                            onChange={(e) => handleInputChange('yearlyDiscount', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            %
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Discount applied to yearly hosting and email plans</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        2 Year Discount (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={pricingData.twoYearDiscount || 0}
                                            onChange={(e) => handleInputChange('twoYearDiscount', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            %
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Discount applied to 2-year hosting and email plans</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        3 Year Discount (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            value={pricingData.threeYearDiscount || 0}
                                            onChange={(e) => handleInputChange('threeYearDiscount', e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            %
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Discount applied to 3-year hosting and email plans</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                            <button
                                type="button"
                                onClick={() => loadPricingData(selectedCurrency)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={loading}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Pricing'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Analytics Tab Component
function AnalyticsTab({ stats, leads, projects }) {
    const leadConversionRate = leads.length > 0 ?
        ((leads.filter(l => l.status === 'closed').length / leads.length) * 100).toFixed(1) : 0;

    const averageProjectValue = projects.length > 0 ?
        projects.reduce((sum, p) => sum + (p.quote?.finalPrice || 0), 0) / projects.length : 0;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Performance</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900">Lead Conversion Rate</h3>
                    <p className="text-3xl font-bold text-blue-600">{leadConversionRate}%</p>
                    <p className="text-sm text-blue-600 mt-2">Closed leads / Total leads</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-green-900">Average Project Value</h3>
                    <p className="text-3xl font-bold text-green-600">${averageProjectValue.toFixed(0)}</p>
                    <p className="text-sm text-green-600 mt-2">Average revenue per project</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-purple-900">Active Projects</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.activeProjects}</p>
                    <p className="text-sm text-purple-600 mt-2">Currently in development</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-orange-900">Monthly Revenue</h3>
                    <p className="text-3xl font-bold text-orange-600">${(stats.totalRevenue / 12).toFixed(0)}</p>
                    <p className="text-sm text-orange-600 mt-2">Average monthly revenue</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Sources</h3>
                    <div className="space-y-3">
                        {['website-form', 'project-builder', 'cold-call', 'referral', 'social'].map((source) => {
                            const count = leads.filter(l => l.source === source).length;
                            const percentage = leads.length > 0 ? ((count / leads.length) * 100).toFixed(1) : 0;
                            return (
                                <div key={source} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 capitalize">{source.replace('-', ' ')}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Industry Distribution</h3>
                    <div className="space-y-3">
                        {['restaurant', 'retail', 'healthcare', 'real-estate', 'professional-services', 'ecommerce'].map((industry) => {
                            const count = leads.filter(l => l.industry === industry).length;
                            const percentage = leads.length > 0 ? ((count / leads.length) * 100).toFixed(1) : 0;
                            return (
                                <div key={industry} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 capitalize">{industry.replace('-', ' ')}</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Blog Tab Component
function BlogTab({ blogPosts, onRefresh }) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        tags: '',
        status: 'draft',
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        }
    });

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                slug: formData.title.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, ''),
                publishedAt: formData.status === 'published' ? new Date() : null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await addDoc(collection(db, 'blog'), postData);

            setFormData({
                title: '',
                content: '',
                excerpt: '',
                tags: '',
                status: 'draft',
                seo: {
                    metaTitle: '',
                    metaDescription: '',
                    keywords: ''
                }
            });
            setShowCreateForm(false);
            onRefresh();
            alert('Blog post created successfully!');
        } catch (error) {
            console.error('Error creating blog post:', error);
            alert('Error creating blog post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                updatedAt: new Date()
            };

            if (formData.status === 'published' && !editingPost.publishedAt) {
                postData.publishedAt = new Date();
            }

            await updateDoc(doc(db, 'blog', editingPost.id), postData);

            setEditingPost(null);
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                tags: '',
                status: 'draft',
                seo: {
                    metaTitle: '',
                    metaDescription: '',
                    keywords: ''
                }
            });
            onRefresh();
            alert('Blog post updated successfully!');
        } catch (error) {
            console.error('Error updating blog post:', error);
            alert('Error updating blog post: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            tags: post.tags.join(', '),
            status: post.status,
            seo: post.seo || {
                metaTitle: '',
                metaDescription: '',
                keywords: ''
            }
        });
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            await deleteDoc(doc(db, 'blog', postId));
            onRefresh();
            alert('Blog post deleted successfully!');
        } catch (error) {
            console.error('Error deleting blog post:', error);
            alert('Error deleting blog post: ' + error.message);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create New Post
                </button>
            </div>

            {/* Blog Posts List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">All Posts ({blogPosts.length})</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {post.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {post.tags?.length || 0} tags
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditPost(post)}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {blogPosts.length === 0 && (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No blog posts found. Create your first post!
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Form Modal */}
            {(showCreateForm || editingPost) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingPost ? 'Edit Post' : 'Create New Post'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingPost(null);
                                    setFormData({
                                        title: '',
                                        content: '',
                                        excerpt: '',
                                        tags: '',
                                        status: 'draft',
                                        seo: {
                                            metaTitle: '',
                                            metaDescription: '',
                                            keywords: ''
                                        }
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter post title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Excerpt
                                            </label>
                                            <textarea
                                                value={formData.excerpt}
                                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="3"
                                                placeholder="Brief description of the post"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Content *
                                            </label>
                                            <textarea
                                                required
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="15"
                                                placeholder="Write your blog post content (markdown supported)"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tags
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="tag1, tag2, tag3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SEO Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.seo.metaTitle}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                seo: { ...formData.seo, metaTitle: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="SEO title (optional)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SEO Meta Description
                                        </label>
                                        <textarea
                                            value={formData.seo.metaDescription}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                seo: { ...formData.seo, metaDescription: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="3"
                                            placeholder="SEO description (optional)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SEO Keywords
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.seo.keywords}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                seo: { ...formData.seo, keywords: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingPost(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 