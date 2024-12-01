import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import FindDoctor from "./pages/user/FindDoctor.jsx";
import Homepage from "./pages/Homepage.jsx";
import RootTemplate from "./template/RootTemplate.jsx";
import LoginSignUp from "./pages/LoginSignup.jsx";
import StaffTemplate from "./template/StaffTemplate.jsx";
import PhysicianDashboard from "./pages/physician/PhysicianDashboard.jsx";
import PhysicianStatistic from "./pages/physician/PhysicianStatistic.jsx";
import Verification from "./pages/user/Verification.jsx";
import i18next from './config/i18nConfig.jsx'
import {useEffect, useState} from "react";
import RequestAppointment from "./pages/user/RequestAppointment.jsx";
import NeedToKnowInfo from "./components/request-appointment/NeedToKnowInfo.jsx"
import RequestAppointmentFor from "./components/request-appointment/AppointmentFor.jsx";
import AppointmentConfirmation from "./components/request-appointment/AppointmentConfirmation.jsx";
import Payment from "./components/request-appointment/Payment.jsx";
import Detail from "./components/request-appointment/Detail.jsx";
import React from "react";
import AppointmentFindDoctor from "./components/request-appointment/AppointmentFindDoctor.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import UserProfile from "./components/user-profile/UserProfile.jsx";
import PersonalInfo from "./components/user-profile/PersonalInfo.jsx";
import AppointmentHistory from "./components/user-profile/AppointmentHistory.jsx";
import baseAxios, {adminAxios, staffAxios} from "./config/axiosConfig.jsx";
import AdminReport from "./pages/admin/AdminReport.jsx";
import AdminSetting from "./pages/admin/AdminSetting.jsx";
import AdminUserManagement from "./pages/admin/AdminUserManagement.jsx";
import UserFeedback from "./components/root/UserFeedback.jsx";
import StaffLogin from "./pages/StaffLogin.jsx";
import {getCookie} from "./components/Utilities.jsx";
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard.jsx";
import PharmacistPrescription from "./pages/pharmacist/PharmacistPrescription.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import PaymentHistory from "./components/user-profile/PaymentHistory.jsx";
import PaymentFailed from "./components/PaymentFailed.jsx";
import AddMedicineModal from "./components/AddMedicineModal.jsx";

export const UserContext  = React.createContext({})
export const UserProfileContext  = React.createContext({})

export const deparment = ["Anesthesia", "Cardiology", "Dermatology", "ENT", "Emergency", "Gastroenterology", "Lab", "Nephrology", "Neurology", "Occupational Therapy", "Oncology", "Orthopedics", "Pharmacy", "Physical Therapy", "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Speech Therapy", "Surgery", "Main Hospital Building"]
export const specialties = [
    "Allergy and Immunology", "Anesthesiology", "Cardio thoracic Surgery", "Cardiology", "Cardiovascular Disease",
    "Colon and Rectal Surgery", "Dermatology", "Emergency Medicine", "Endocrinology", "ENT (Ear, Nose, and Throat)", "Gastroenterology", "Geriatrics",
    "Hematology/Oncology", "Infectious Diseases", "Internal Medicine", "Nephrology", "Neurology", "Neurosurgery", "Obstetrics and Gynecology", "Oncology",
    "Orthopedic Surgery", "Orthopedics", "Pathology", "Pediatrics", "Physical Medicine and Rehabilitation",
    "Plastic Surgery", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Sports Medicine", "Surgery", "Urology", "Vascular Surgery"
]

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
            errorElement: <ErrorPage />,
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
                            path: 'personal-info', element: <PersonalInfo logout={logout}/>,
                            loader: async () => {
                                return baseAxios.get('/profile?email=' + currentUser.email)
                            },
                        },
                        {
                            path: 'payment', element: <PaymentHistory />,
                            loader: async () => {
                                return baseAxios.get('/payment/payment-history?email=' + currentUser.email)
                            }
                        },
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
            path: 'staff',
            errorElement: <ErrorPage />,
            element: <StaffTemplate language={language} changeLanguage={changeLanguage}/>,
            children: [
                {path: 'login', element: <StaffLogin />},
            ]
        },
        {
            path: 'physician',
            errorElement: <ErrorPage />,
            element: <StaffTemplate />,
            children: [
                {path: 'dashboard', element: <PhysicianDashboard />,
                    loader: () => {
                        if(getCookie('STAFF-ID') == null) return null
                        return staffAxios.get('/fetch/appointments')
                    }
                },
                {path: 'statistic', element: <PhysicianStatistic />,
                    loader: () => {
                        if(getCookie('STAFF-ID') == null) return null
                        return staffAxios.get('/fetch/statistic?view=w')
                    }
                },
            ]
        },
        {
            path: 'admin',
            errorElement: <ErrorPage />,
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
                                "staff-status": "default",
                                "staff-id": getCookie('STAFF-ID')
                            }
                        }).then(res => {
                            return res
                        }).catch(() => {
                            return null
                        })
                    }
                },
                {path: 'settings', element: <AdminSetting />},
                {path: 'report', element: <AdminReport />},
            ]
        },
        {
            path: 'pharmacist',
            element: <StaffTemplate />,
            children: [
                {path: 'dashboard', element: <PharmacistDashboard /> },
                {path: 'medication', element: <PharmacistPrescription />,
                    loader: () => {
                        if(getCookie('STAFF-ID') == null) return null
                        return staffAxios.get('/get/prescription/all')
                    }
                }

            ]
        },
        {path: '/verify/success', element: <Verification />},
        {path: '/verify/fail', element: <Verification />},
        {path: '/payment/success', element: <PaymentSuccess />},
        {path: '/payment/failed', element: <PaymentFailed />},
        {path: '/dev', element: <AddMedicineModal />}
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
