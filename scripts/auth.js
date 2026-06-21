const AuthAPI = {
    USERS_KEY: 'users',
    SESSION_KEY: 'currentUser',

    init() {
        const users = this.getUsers();
        if (!users.some(u => u.username === 'admin')) {
            users.push({ username: 'admin', password: 'admin123', role: 'admin', email: 'admin@techgamers.com' });
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    },

    register(username, password, email) {
        const users = this.getUsers();
        if (users.some(u => u.username === username)) {
            return { success: false, message: 'El nombre de usuario ya existe.' };
        }
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'El correo electrónico ya está registrado.' };
        }
        users.push({ username, password, email, role: 'client' });
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return { success: true, message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.' };
    },

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return { success: false, message: 'Credenciales incorrectas.' };
        }
        const session = { username: user.username, role: user.role, email: user.email };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        return { success: true, user: session };
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.SESSION_KEY));
    },

    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    isClient() {
        const user = this.getCurrentUser();
        return user && user.role === 'client';
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    requireLogin(redirectUrl) {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl || 'login.html';
            return false;
        }
        return true;
    }
};

AuthAPI.init();
