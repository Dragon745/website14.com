// Admin Header Component
class AdminHeader {
    constructor() {
        this.init();
    }

    init() {
        this.createHeader();
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'bg-white border-b border-gray-200 shadow-sm';
        header.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center space-x-3">
                        <h1 class="font-jetbrains text-xl font-bold text-black">Website14 Admin</h1>
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div id="performance-stats" class="text-xs text-gray-500"></div>
                        <span id="admin-email" class="text-sm text-gray-600"></span>
                        <button id="logout-btn" class="text-gray-500 hover:text-black transition-colors duration-300 text-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertBefore(header, document.body.firstChild);
    }
}

// Auto-initialize admin header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminHeader();
});