import {createBrowserRouter, RouterProvider} from "react-router-dom";
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
import Verification from "./pages/Verification.jsx";

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
            element: <Verification />
        },
        {
            path: '/verify/fail',
            element: <Verification />
        }
    ])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <RouterProvider router={router} />
        </LocalizationProvider>
    )
}

export default App
