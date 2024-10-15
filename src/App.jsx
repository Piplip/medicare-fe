import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import FindDoctor from "./pages/FindDoctor.jsx";
import Homepage from "./pages/Homepage.jsx";
import RootTemplate from "./template/RootTemplate.jsx";
import AppointmentScheduling from "./pages/physician/AppointmentScheduling.jsx";
import LoginSignUp from "./pages/LoginSignup.jsx";
import StaffTemplate from "./template/StaffTemplate.jsx";
import PhysicianDashboard from "./pages/physician/PhysicianDashboard.jsx";
import PhysicianPatientView from "./pages/physician/PhysicianPatientView.jsx";
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
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import UserProfile from "./components/UserProfile.jsx";
import PersonalInfo from "./components/user-profile/PersonalInfo.jsx";
import BillingPayment from "./components/user-profile/BillingPayment.jsx";
import AppointmentHistory from "./components/user-profile/AppointmentHistory.jsx";
import baseAxios, {adminAxios} from "./config/axiosConfig.jsx";
import AdminAudit from "./pages/admin/AdminAudit.jsx";
import AdminReport from "./pages/admin/AdminReport.jsx";
import AdminSetting from "./pages/admin/AdminSetting.jsx";
import AdminUserManagement from "./pages/admin/AdminUserManagement.jsx";
import ContextMenu from "./components/context-menu/ContextMenu.jsx";
import UserFeedback from "./components/UserFeedback.jsx";

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

    function logout(){
        setCurrentUser({
            firstName: '',
            lastName: '',
            email: ''
        })
        localStorage.clear()
    }

    const router = createBrowserRouter([
        {
            path: '/',
            element: <RootTemplate language={language} changeLanguage={changeLanguage} logout={logout}/>,
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
                {path: 'sign-up', element: <LoginSignUp />},
                {
                    path: 'profile/:ssid',
                    element: <UserProfile logout={logout} currentUser={currentUser}/>,
                    children: [
                        {
                            path: 'personal-info', element: <PersonalInfo />,
                            loader: async () => {
                                return baseAxios.get('/profile?email=' + currentUser.email)
                            },
                        },
                        {path: 'billing-payment', element: <BillingPayment />},
                        {
                            path: 'appointment-history', element: <AppointmentHistory />,
                            loader: async () => {
                                return baseAxios.get('/appointments?email=' + currentUser.email)
                            }
                        },
                        {
                            path: 'feedback', element: <UserFeedback />,
                            loader: async () => {
                                return baseAxios.get('/feedbacks?email=' + currentUser.email)
                            }
                        }
                    ]
                },
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
            path: 'admin',
            element: <StaffTemplate language={language} setLanguage={setLanguage}/>,
            children: [
                {
                    path: 'users', element: <AdminUserManagement />,
                    loader: async () => {
                        return adminAxios.get('/staff', {
                            params: {
                                name: "",
                                department: "",
                                "primary-language": "",
                                specialization: "",
                                gender: "",
                                "page-size": 10,
                                "page-number": 1,
                                "staff-type": "",
                                "staff-status": "default"
                            }
                        })
                    }
                },
                {path: 'settings', element: <AdminSetting />},
                {path: 'audit', element: <AdminAudit />},
                {path: 'report', element: <AdminReport />},
            ]
        },
        {path: '/verify/success', element: <Verification />},
        {path: '/verify/fail', element: <Verification />},
        {path: '/payment/success', element: <PaymentSuccess />},
        {path: '/dev', element: <ContextMenu />}
    ])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UserContext.Provider value={{currentUser: currentUser, setCurrentUser: setCurrentUser}}>
                <RouterProvider router={router}/>
            </UserContext.Provider>
        </LocalizationProvider>
    )
}

export default App
