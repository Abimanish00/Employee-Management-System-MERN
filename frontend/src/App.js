
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/pages/navbar';
import Home from './components/pages/home';
import Signup from './components/pages/signup';
import Login from './components/pages/login';
import Dashboard from './components/pages/dashboard';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import AddEmployee from './components/pages/addEmployee';
import EditEmployee from './components/pages/editEmployee';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (

    
    <BrowserRouter>
    <Navbar/>
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        
        
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/addemployee"
  element={
    <PrivateRoute>
      <AddEmployee />
    </PrivateRoute>
  }
/>

<Route
  path="/editemployee"
  element={
    <PrivateRoute>
      <EditEmployee />
    </PrivateRoute>
  }
/>


      </Routes>
  <ToastContainer position="top-center" />
  </BrowserRouter>
  )
}

export default App;
