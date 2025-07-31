import { db } from '../../js/modules/firebase-config.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class AdminAuth {
    constructor() {
        this.auth = getAuth();
        this.provider = new GoogleAuthProvider();
        this.loginBtn = document.getElementById('google-login-btn');
        this.errorMessage = document.getElementById('error-message');

        this.initializeAuth();
        this.setupEventListeners();
    }

    initializeAuth() {
        // Check if user is already logged in
        onAuthStateChanged(this.auth, (user) => {
            if (user && user.email === 'contact@syedqutubuddin.in') {
                // Redirect to admin dashboard
                window.location.href = 'dashboard.html';
            }
        });
    }

    setupEventListeners() {
        this.loginBtn.addEventListener('click', () => this.handleGoogleLogin());
    }

    async handleGoogleLogin() {
        // Clear previous error
        this.hideError();

        try {
            // Show loading state
            this.loginBtn.disabled = true;
            this.loginBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
            `;

            // Attempt Google sign in
            const result = await signInWithPopup(this.auth, this.provider);
            const user = result.user;

            // Check if email is authorized
            if (user.email === 'contact@syedqutubuddin.in') {
                // Store admin session
                localStorage.setItem('adminAuthenticated', 'true');
                localStorage.setItem('adminEmail', user.email);
                localStorage.setItem('adminName', user.displayName || user.email);

                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Sign out unauthorized user
                await signOut(this.auth);
                this.showError('Access denied. Only contact@syedqutubuddin.in can access admin panel.');
            }

        } catch (error) {
            console.error('Google login error:', error);

            let errorMessage = 'Login failed. Please try again.';

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelled. Please try again.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup blocked. Please allow popups for this site.';
                    break;
                case 'auth/unauthorized-domain':
                    errorMessage = 'This domain is not authorized for Google sign-in.';
                    break;
                case 'auth/account-exists-with-different-credential':
                    errorMessage = 'An account already exists with this email using a different sign-in method.';
                    break;
            }

            this.showError(errorMessage);
        } finally {
            // Reset button state
            this.loginBtn.disabled = false;
            this.loginBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
            `;
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }
}

// Initialize admin authentication
new AdminAuth(); 