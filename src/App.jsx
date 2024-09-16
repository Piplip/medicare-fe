import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import FindDoctor from "./pages/FindDoctor.jsx";
import Homepage from "./pages/Homepage.jsx";
import RootTemplate from "./template/RootTemplate.jsx";
import AppointmentScheduling from "./pages/AppointmentScheduling.jsx";
import LoginSignUp from "./pages/LoginSignup.jsx";
import StaffTemplate from "./template/StaffTemplate.jsx";
import PhysicianDashboard from "./pages/PhysicianDashboard.jsx";
import PhysicianPatientView from "./pages/PhysicianPatientView.jsx";
import Verification from "./pages/Verification.jsx";
import i18next from './config/i18nConfig.jsx'
import {useEffect, useState} from "react";
import RequestAppointment from "./pages/RequestAppointment.jsx";
import NeedToKnowInfo from "./components/request-appointment/NeedToKnowInfo.jsx"
import RequestAppointmentFor from "./components/request-appointment/AppointmentFor.jsx";
import AppointmentConfirmation from "./components/request-appointment/AppointmentConfirmation.jsx";
import Payment from "./components/request-appointment/Payment.jsx";
import Detail from "./components/request-appointment/Detail.jsx";
import React from "react";
import AppointmentFindDoctor from "./components/request-appointment/AppointmentFindDoctor.jsx";

export const UserContext  = React.createContext({})

function App() {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'vi');
    useEffect(() => {
        if(localStorage.getItem('language') === null) localStorage.setItem('language', 'vi');
        i18next.changeLanguage(language)
    }, []);
    const [currentUser, setCurrentUser] = useState({
        firstName: localStorage.getItem('firstName') || '',
        lastName: localStorage.getItem('lastName') || '',
        email: localStorage.getItem('email') || '',
    })

    function changeLanguage(newLanguage){
        i18next.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        setLanguage(newLanguage);
    }

    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootTemplate language={language} changeLanguage={changeLanguage} currentUser={currentUser} setCurrentUser={setCurrentUser}/>,
            children: [
                {index: true, element: <Homepage />},
                {
                    path: 'find-a-doctor',
                    element: <FindDoctor language={language}/>
                },
                {
                    path: 'schedule/:id',
                    element: <RequestAppointment currentUser={currentUser}/>,
                    children: [
                        {path: 'info', element: <NeedToKnowInfo />},
                        {path: 'request-for', element: <RequestAppointmentFor />},
                        {path: 'find-a-doctor', element: <AppointmentFindDoctor />},
                        {path: 'appointment-detail', element: <Detail />},
                        {path: 'confirmation', element: <AppointmentConfirmation />},
                        {path: 'payment', element: <Payment />}
                    ]
                },
                {path: 'login', element: <LoginSignUp setCurrentUser={setCurrentUser}/>},
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
            <UserContext.Provider value={{currentUser: currentUser, setCurrentUser: setCurrentUser}}>
                <RouterProvider router={router} />
            </UserContext.Provider>
        </LocalizationProvider>
    )
}

export default App
