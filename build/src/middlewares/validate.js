export const validateInput = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({ message: 'Invalid username' });
    }
    if (!email || typeof email !== 'string' || !validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({ message: 'Invalid password' });
    }
    next();
};
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
