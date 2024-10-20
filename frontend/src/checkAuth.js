export const isAuthenticated = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        // Decode the token to get the expiration time
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;

        // Check if the token has expired
        if (exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

// Function to check if the user is not authenticated
export const isNotAuthenticated = () => {
    return !isAuthenticated();
};