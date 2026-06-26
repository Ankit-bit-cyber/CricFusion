export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const isStrongPassword = (pw) => pw.length >= 6;

export const validateRegister = ({ name, email, password }) => {
    const errors = {};
    if (!name?.trim()) errors.name = 'Name is required';
    if (!isValidEmail(email)) errors.email = 'Valid email is required';
    if (!isStrongPassword(password)) errors.password = 'Password must be at least 6 characters';
    return errors;
};

export const validateLogin = ({ email, password }) => {
    const errors = {};
    if (!isValidEmail(email)) errors.email = 'Valid email is required';
    if (!password) errors.password = 'Password is required';
    return errors;
};