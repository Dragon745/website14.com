// Global Footer Component
class GlobalFooter {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createFooter();
            });
        } else {
            // DOM is already ready
            this.createFooter();
        }
    }

    createFooter() {
        try {
            // Check if footer already exists
            const existingFooter = document.querySelector('footer');
            if (existingFooter) {
                console.log('Footer already exists, skipping creation');
                return;
            }

            const footer = document.createElement('footer');
            footer.className = 'bg-white border-t border-gray-200 py-8 mt-auto';
            footer.innerHTML = `
                <div class="max-w-6xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div class="font-jetbrains text-xl font-bold text-black">Website14</div>
                    <ul class="flex gap-8 text-sm">
                        <li>
                            <a href="/services.html" class="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="/about.html" class="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contact.html" class="text-gray-500 hover:text-black transition-colors duration-300 font-inter">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            `;

            // Insert footer at the end of the body
            document.body.appendChild(footer);
            console.log('Global footer created successfully');
        } catch (error) {
            console.error('Error creating footer:', error);
        }
    }
}

// Auto-initialize footer
new GlobalFooter();