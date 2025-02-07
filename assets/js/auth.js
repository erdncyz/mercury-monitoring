class Auth {
    static checkLogin() {
        // Basit bir oturum kontrolü
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'login.html';
        }
    }

    static login(username, password) {
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            return true;
        }
        return false;
    }

    static logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
} 