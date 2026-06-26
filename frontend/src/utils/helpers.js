export const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const truncate = (str, max = 100) =>
    str?.length > max ? str.slice(0, max) + '...' : str;

export const getAvatarUrl = (avatar, name) =>
    avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=166534&color=f0fdf4&bold=true`;

export const highlightHashtags = (text) =>
    text.replace(/(#\w+)/g, '<span class="text-brand-400 font-medium">$1</span>');

export const debounce = (fn, delay = 400) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};