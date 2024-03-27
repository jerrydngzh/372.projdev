import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateAccountPage from './createAccount/page'; 
import User from './user/page';
import Profile from './profile/page'; 
import Lens from './lens/page';
import Dashboard from './dashboard/page'; 
import CreateMemo from './CreateMemo/page'; 
import "./App.css";
import { useNavigate } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/user" element={<User />} />
        <Route path="/createAccount" element={<CreateAccountPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lens" element={<Lens />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createMemo" element={<CreateMemo />} />
      </Routes>
    </Router>
  );
}

function Page() {
  const navigate = useNavigate();

  const handleNavigation = (destination: number) => {
    if (destination === 1) {
      navigate('/user');
    } else {
      navigate('/createAccount');
    }
  };

  return (
    <main className='Title'>
      <div className="text-center mt-20 m-auto w-1/3 pt-10 pb-10 bg-blue-200 border-2 border-blue-800 rounded-3xl">
        <h1 className="font-bold mb-1 text-blue-800">Moments</h1>
        <p className="text-blue-800 font-sm italic mb-4">A Spatial Journalling App</p>
        <button onClick={() => handleNavigation(1)} className='bg-blue-100 text-blue-800 border-2 border-blue-800 mr-2'>Login</button>
        <button onClick={() => handleNavigation(2)} className='bg-blue-100 text-blue-800 border-2 border-blue-800'>Create Account</button>
      </div>
    </main>
  );
}
