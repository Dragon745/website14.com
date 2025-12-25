
// Premium gradients inspired by modern web design
const gradients = [
    { from: 'from-purple-600', to: 'to-blue-600', text: 'text-purple-50' },
    { from: 'from-cyan-500', to: 'to-blue-500', text: 'text-cyan-50' },
    { from: 'from-emerald-500', to: 'to-teal-500', text: 'text-emerald-50' },
    { from: 'from-rose-500', to: 'to-pink-500', text: 'text-rose-50' },
    { from: 'from-amber-500', to: 'to-orange-500', text: 'text-amber-50' },
    { from: 'from-indigo-500', to: 'to-purple-500', text: 'text-indigo-50' },
    { from: 'from-blue-600', to: 'to-indigo-600', text: 'text-blue-50' },
    { from: 'from-fuchsia-600', to: 'to-pink-600', text: 'text-fuchsia-50' },
    { from: 'from-slate-700', to: 'to-slate-900', text: 'text-slate-50' },
    { from: 'from-teal-500', to: 'to-emerald-500', text: 'text-teal-50' },
];

/**
 * Generates a deterministic gradient based on a string input (e.g., post ID or title).
 * This ensures the same post always gets the same color.
 * 
 * @param {string} seed - The string to hash (e.g., post.id)
 * @returns {object} - The gradient object { from, to, text }
 */
export function getPostGradient(seed) {
    if (!seed) return gradients[0];

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
}
