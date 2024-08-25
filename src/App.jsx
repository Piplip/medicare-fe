import {createBrowserRouter, Link, RouterProvider} from "react-router-dom";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import FindProvider from "./pages/FindDoctor.jsx";
import Homepage from "./pages/Homepage.jsx";
import RootTemplate from "./Template/RootTemplate.jsx";
import AppointmentScheduling from "./pages/AppointmentScheduling.jsx";
import LoginSignUp from "./pages/LoginSignup.jsx";
import StaffTemplate from "./Template/StaffTemplate.jsx";
import PhysicianDashboard from "./pages/PhysicianDashboard.jsx";
import PhysicianPatientView from "./pages/PhysicianPatientView.jsx";

function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootTemplate />,
            children: [
                {index: true, element: <Homepage />},
                {path: 'find-a-doctor', element: <FindProvider />},
                {path: 'schedule', element: <AppointmentScheduling />},
                {path: 'login', element: <LoginSignUp />},
                {path: 'sign-up', element: <LoginSignUp />}
            ]
        },
        {
            path: 'physician',
            element: <StaffTemplate />,
            children: [
                {path: 'dashboard', element: <PhysicianDashboard />},
                {path: 'appointment-scheduling', element: <AppointmentScheduling />},
                {path: 'patient-view', element: <PhysicianPatientView />},
            ]
        },
        {
            path: '/verify/success',
            element: <div style={{width: '100%', height: '100dvh', backgroundColor: 'black', padding: '2rem', textAlign: 'center'}}>
                <p style={{fontSize: '4rem', color: 'orange', marginBlock: '4rem'}}>EIDA</p>
                <h1 style={{color: 'lightgreen'}}>VERIFIED SUCCESSFULLY</h1>
                <p style={{color: 'white'}}>You can now close this page or head to <Link style={{color: 'yellow'}} to={'/login'}>login page.</Link></p>
            </div>
        },
    ])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
        </LocalizationProvider>
    )
}

export default App
