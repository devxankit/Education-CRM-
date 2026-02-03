

import { Outlet } from 'react-router-dom';
import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  )
}

export default App
