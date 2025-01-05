import './App.css';
import { AuthProvider } from './AuthContext';
import AppRouter from './routes';

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;
