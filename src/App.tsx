import './App.css';
import { AuthProvider } from './managers/AuthContext';
import AppRouter from './managers/routes';

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;
