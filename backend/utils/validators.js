const extractHashtags = (content) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map((tag) => tag.toLowerCase()) : [];
};

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const sanitizeText = (text) =>
    text.replace(/<script.*?>.*?<\/script>/gi, '').trim();

module.exports = { extractHashtags, isValidEmail, sanitizeText };