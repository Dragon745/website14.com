import { db } from '../../js/modules/firebase-config.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, query, orderBy, getDocs, doc, updateDoc, where, limit, startAfter, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { PerformanceMonitor } from './performance-monitor.js';

class AdminDashboard {
    constructor() {
        this.auth = getAuth();
        this.messages = [];
        this.filteredMessages = [];
        this.lastDoc = null; // For pagination
        this.isLoading = false;
        this.hasMoreMessages = true;
        this.cache = new Map(); // Client-side cache
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
        this.performanceMonitor = new PerformanceMonitor();

        this.initializeAuth();
        this.setupEventListeners();
        this.loadMessages();
    }

    initializeAuth() {
        onAuthStateChanged(this.auth, (user) => {
            if (!user || user.email !== 'contact@syedqutubuddin.in') {
                // Redirect to login if not authenticated
                window.location.href = 'index.html';
                return;
            }

            // Display admin info
            const adminName = localStorage.getItem('adminName') || user.displayName || user.email;
            document.getElementById('admin-email').textContent = adminName;
        });
    }

    setupEventListeners() {
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshMessages());
        document.getElementById('filter-status').addEventListener('change', (e) => this.filterMessages(e.target.value));

        // Add scroll listener for infinite loading
        window.addEventListener('scroll', () => this.handleScroll());
    }

    async handleLogout() {
        try {
            await signOut(this.auth);
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminEmail');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    // Check if data is cached and not expired
    isCached(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        return Date.now() - cached.timestamp < this.cacheTimeout;
    }

    // Get cached data
    getCached(key) {
        const cached = this.cache.get(key);
        return cached ? cached.data : null;
    }

    // Set cached data
    setCached(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    async loadMessages(loadMore = false) {
        if (this.isLoading) return;

        const loading = document.getElementById('loading');
        const noMessages = document.getElementById('no-messages');
        const tbody = document.getElementById('messages-tbody');

        if (!loadMore) {
            loading.classList.remove('hidden');
            noMessages.classList.add('hidden');
            tbody.innerHTML = '';
            this.messages = [];
            this.lastDoc = null;
            this.hasMoreMessages = true;
        }

        this.isLoading = true;

        try {
            // Check cache first for initial load
            if (!loadMore) {
                const cachedData = this.getCached('messages');
                if (cachedData) {
                    this.performanceMonitor.trackCacheHit();
                    this.messages = cachedData;
                    this.filteredMessages = [...this.messages];
                    this.renderMessages();
                    this.updateStats();
                    loading.classList.add('hidden');
                    this.isLoading = false;
                    return;
                } else {
                    this.performanceMonitor.trackCacheMiss();
                }
            }

            // Build query with pagination
            let q = query(
                collection(db, 'contacts'),
                orderBy('timestamp', 'desc'),
                limit(20) // Load 20 messages at a time
            );

            // Add startAfter for pagination
            if (loadMore && this.lastDoc) {
                q = query(
                    collection(db, 'contacts'),
                    orderBy('timestamp', 'desc'),
                    startAfter(this.lastDoc),
                    limit(20)
                );
            }

            const querySnapshot = await getDocs(q);

            // Track the read operation
            this.performanceMonitor.trackRead('loadMessages', querySnapshot.docs.length);

            const newMessages = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                newMessages.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
                });
            });

            // Update last document for pagination
            if (querySnapshot.docs.length > 0) {
                this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            }

            // Check if we have more messages
            this.hasMoreMessages = querySnapshot.docs.length === 20;

            if (loadMore) {
                this.messages.push(...newMessages);
            } else {
                this.messages = newMessages;
                // Cache the results
                this.setCached('messages', this.messages);
            }

            this.filteredMessages = [...this.messages];
            this.renderMessages();
            this.updateStats();

        } catch (error) {
            console.error('Error loading messages:', error);
            if (!loadMore) {
                loading.classList.add('hidden');
                noMessages.classList.remove('hidden');
            }
        } finally {
            this.isLoading = false;
            if (!loadMore) {
                loading.classList.add('hidden');
            }
        }
    }

    // Handle infinite scroll
    handleScroll() {
        if (this.isLoading || !this.hasMoreMessages) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 100) {
            this.loadMessages(true);
        }
    }

    // Refresh messages (clear cache and reload)
    async refreshMessages() {
        this.cache.clear();
        await this.loadMessages();
    }

    renderMessages() {
        const tbody = document.getElementById('messages-tbody');
        const loading = document.getElementById('loading');
        const noMessages = document.getElementById('no-messages');

        loading.classList.add('hidden');

        if (this.filteredMessages.length === 0) {
            noMessages.classList.remove('hidden');
            return;
        }

        noMessages.classList.add('hidden');

        // Only clear tbody if not loading more
        if (!this.isLoading) {
            tbody.innerHTML = '';
        }

        this.filteredMessages.forEach((message) => {
            const row = this.createMessageRow(message);
            tbody.appendChild(row);
        });

        // Show loading indicator for more messages
        if (this.hasMoreMessages && !this.isLoading) {
            this.showLoadMoreIndicator();
        }
    }

    showLoadMoreIndicator() {
        const tbody = document.getElementById('messages-tbody');
        const loadMoreRow = document.createElement('tr');
        loadMoreRow.id = 'load-more-row';
        loadMoreRow.innerHTML = `
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Loading more messages...
                </div>
            </td>
        `;
        tbody.appendChild(loadMoreRow);
    }

    createMessageRow(message) {
        const row = document.createElement('tr');
        row.className = message.status === 'unread' ? 'bg-yellow-50' : '';

        const status = message.status || 'new';
        const statusClass = status === 'read' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

        const date = message.timestamp ? message.timestamp.toLocaleDateString() : 'N/A';
        const time = message.timestamp ? message.timestamp.toLocaleTimeString() : '';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${statusClass}">
                    ${status === 'read' ? 'Read' : 'Unread'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${message.name || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${message.email || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${message.phone || 'N/A'}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
                <div class="max-w-xs truncate" title="${message.message || ''}">
                    ${message.message || 'N/A'}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${date}<br><span class="text-xs">${time}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                    onclick="window.adminDashboard.toggleMessageStatus('${message.id}', '${status}')"
                    class="text-gray-600 hover:text-gray-900 mr-3"
                >
                    ${status === 'read' ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button 
                    onclick="window.adminDashboard.viewMessage('${message.id}')"
                    class="text-blue-600 hover:text-blue-900"
                >
                    View
                </button>
            </td>
        `;

        return row;
    }

    async toggleMessageStatus(messageId, currentStatus) {
        try {
            const newStatus = currentStatus === 'read' ? 'unread' : 'read';
            const messageRef = doc(db, 'contacts', messageId);
            await updateDoc(messageRef, { status: newStatus });

            // Update local data
            const messageIndex = this.messages.findIndex(m => m.id === messageId);
            if (messageIndex !== -1) {
                this.messages[messageIndex].status = newStatus;
            }

            // Clear cache since data changed
            this.cache.clear();

            this.renderMessages();
            this.updateStats();

        } catch (error) {
            console.error('Error updating message status:', error);
            alert('Error updating message status. Please try again.');
        }
    }

    viewMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        const modal = this.createMessageModal(message);
        document.body.appendChild(modal);
    }

    createMessageModal(message) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';

        const date = message.timestamp ? message.timestamp.toLocaleDateString() : 'N/A';
        const time = message.timestamp ? message.timestamp.toLocaleTimeString() : '';

        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-medium text-gray-900">Message Details</h3>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Name</label>
                            <p class="text-sm text-gray-900">${message.name || 'N/A'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <p class="text-sm text-gray-900">${message.email || 'N/A'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Phone</label>
                            <p class="text-sm text-gray-900">${message.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Message</label>
                            <p class="text-sm text-gray-900 whitespace-pre-wrap">${message.message || 'N/A'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Date & Time</label>
                            <p class="text-sm text-gray-900">${date} at ${time}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <p class="text-sm text-gray-900">${message.status || 'new'}</p>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end space-x-3">
                        <button 
                            onclick="window.adminDashboard.toggleMessageStatus('${message.id}', '${message.status || 'new'}')"
                            class="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
                        >
                            ${(message.status || 'new') === 'read' ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button 
                            onclick="this.closest('.fixed').remove()"
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    filterMessages(status) {
        if (status === 'all') {
            this.filteredMessages = [...this.messages];
        } else {
            this.filteredMessages = this.messages.filter(message => message.status === status);
        }
        this.renderMessages();
    }

    updateStats() {
        const total = this.messages.length;
        const read = this.messages.filter(m => m.status === 'read').length;
        const unread = this.messages.filter(m => m.status !== 'read').length;

        const today = new Date();
        const todayMessages = this.messages.filter(m => {
            if (!m.timestamp) return false;
            const messageDate = new Date(m.timestamp);
            return messageDate.toDateString() === today.toDateString();
        }).length;

        document.getElementById('total-messages').textContent = total;
        document.getElementById('read-messages').textContent = read;
        document.getElementById('unread-messages').textContent = unread;
        document.getElementById('today-messages').textContent = todayMessages;
    }
}

// Initialize dashboard and make it globally accessible
window.adminDashboard = new AdminDashboard(); 