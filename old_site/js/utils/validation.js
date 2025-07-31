// Validation Utilities
export class ValidationUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return "Please enter your email address";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return null;
    }

    static validateRequired(value, fieldName) {
        if (!value.trim()) return `Please enter your ${fieldName}`;
        return null;
    }

    static validatePhone(phone) {
        if (!phone.trim()) return "Please enter your phone number";
        // Basic phone validation - can be enhanced
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return "Please enter a valid phone number";
        }
        return null;
    }

    static validateName(name) {
        if (!name.trim()) return "Please enter your name";
        if (name.trim().length < 2) return "Name must be at least 2 characters long";
        return null;
    }

    static validateMessage(message) {
        if (!message.trim()) return "Please describe your inquiry";
        if (message.trim().length < 10) return "Please provide more details about your inquiry";
        return null;
    }
} 