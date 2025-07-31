// Global Header Component
class GlobalHeader {
    constructor() {
        this.init();
    }

    init() {
        this.createHeader();
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'bg-white shadow-sm border-b sticky top-0 z-50';
        header.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="/index.html" class="text-xl font-bold text-gray-900">Website14</a>
                    </div>
                    <div class="flex items-center space-x-8">
                        <a href="/services.html" class="text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                        <a href="/contact.html" class="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertBefore(header, document.body.firstChild);
    }
}

// Auto-initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GlobalHeader();
});