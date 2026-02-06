

import { Outlet } from 'react-router-dom';
import ToastContainer from './components/ToastContainer';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Outlet />
      <ToastContainer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
