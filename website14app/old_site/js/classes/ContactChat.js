import { db } from '../modules/firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export class ContactChat {
    constructor() {
        this.currentStep = 0;
        this.userData = {};
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.newChatBtn = document.getElementById('new-chat-btn');

        this.steps = [
            {
                question: "Hi! I'm here to help you get in touch with our team. What's your name?",
                field: "name",
                validation: (value) => value.trim().length > 0 ? null : "Please enter your name"
            },
            {
                question: "Great! What's your phone number?",
                field: "phone",
                validation: (value) => value.trim().length > 0 ? null : "Please enter your phone number"
            },
            {
                question: "Perfect! What's your email address?",
                field: "email",
                validation: (value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!value.trim()) return "Please enter your email address";
                    if (!emailRegex.test(value)) return "Please enter a valid email address";
                    return null;
                }
            },
            {
                question: "Finally, what would you like to contact us about? Please describe your project or inquiry.",
                field: "message",
                validation: (value) => value.trim().length > 0 ? null : "Please describe your inquiry"
            }
        ];

        this.initializeEventListeners();
        this.start();
    }

    initializeEventListeners() {
        this.sendBtn.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });
        this.newChatBtn.addEventListener('click', () => this.resetChat());
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

        const messageBubble = document.createElement('div');
        messageBubble.className = `max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${isUser
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-800'
            }`;
        messageBubble.textContent = text;

        messageDiv.appendChild(messageBubble);
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showCurrentStep() {
        if (this.currentStep < this.steps.length) {
            this.addMessage(this.steps[this.currentStep].question);
            this.userInput.disabled = false;
            this.sendBtn.disabled = false;
            this.userInput.focus();
        }
    }

    async handleUserInput() {
        const input = this.userInput.value.trim();
        if (!input) return;

        // Add user message to chat
        this.addMessage(input, true);
        this.userInput.value = '';

        // Validate input
        const currentStepData = this.steps[this.currentStep];
        const validationError = currentStepData.validation(input);

        if (validationError) {
            this.addMessage(validationError);
            return;
        }

        // Store user data
        this.userData[currentStepData.field] = input;
        this.currentStep++;

        // Disable input while processing
        this.userInput.disabled = true;
        this.sendBtn.disabled = true;

        // If we've collected all data, submit to Firestore
        if (this.currentStep >= this.steps.length) {
            await this.submitToFirestore();
        } else {
            // Show next step
            setTimeout(() => {
                this.showCurrentStep();
            }, 500);
        }
    }

    async submitToFirestore() {
        try {
            this.addMessage("Thank you! I'm submitting your information to our team...");

            const contactData = {
                ...this.userData,
                timestamp: serverTimestamp(),
                status: 'new'
            };

            await addDoc(collection(db, 'contacts'), contactData);

            this.addMessage("Perfect! Your message has been sent to our team. We'll get back to you within 24 hours.");

            // Show new chat button
            this.newChatBtn.style.display = 'block';

        } catch (error) {
            console.error('Error submitting to Firestore:', error);
            this.addMessage("Sorry, there was an error submitting your message. Please try again or contact us directly.");
            // Re-enable input on error
            this.userInput.disabled = false;
            this.sendBtn.disabled = false;
        }
    }

    resetChat() {
        this.chatMessages.innerHTML = '';
        this.currentStep = 0;
        Object.keys(this.userData).forEach(key => delete this.userData[key]);
        this.userInput.disabled = false;
        this.sendBtn.disabled = false;
        this.newChatBtn.style.display = 'none';
        this.showCurrentStep();
    }

    start() {
        this.showCurrentStep();
    }
} 