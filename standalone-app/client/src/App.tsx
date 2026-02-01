import { useState } from 'react';
import LoginForm from './components/LoginForm';
import TestContainer from './components/TestContainer';

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="App">
            {!user ? (
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            ) : (
                <TestContainer user={user} onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
