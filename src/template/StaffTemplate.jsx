import {Outlet, useLocation} from "react-router";
import {useEffect} from "react";
import TopNav from "../components/root/TopNav.jsx";
import SideNav from "../components/root/SideNav.jsx";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import '../styles/side-nav-style.css'
import '../styles/staff-template-style.css'
import UnauthenticatedModal from "../components/UnauthenticatedModal.jsx";
import {useTranslation} from "react-i18next";

export default function StaffTemplate(props){
    const location = useLocation()
    const {t} = useTranslation('common')

    const physicianNavData = {
        "title": "Physician",
        "pages": [
            {"name": "Dashboard", "path": "dashboard", "icon": <DashboardIcon />},
            {"name": "Statistics", "path": "statistic", "icon": <AnalyticsIcon />},
            {"name": "Appointment Scheduling", "path": "appointment-scheduling", "icon": <MeetingRoomIcon />},
        ]
    }
    const adminNavData = {
        "title": "Admin",
        "pages": [
            {"name": "User Management", "path": "users", "icon": <ManageAccountsIcon />},
            {"name": "Reporting & Analytics", "path": "report", "icon": <AnalyticsIcon />},
            {"name": "System Settings", "path": "settings", "icon": <SettingsIcon />},
            {"name": "Audit Logs", "path": "audit", "icon": <ReceiptIcon />},
        ]
    }
    const pharmacistNavData = {
        "title": "Pharmacist",
        "pages": [
            {"name": "Dashboard", "path": "dashboard", "icon": <DashboardIcon />},
            {"name": "Appointment's Medication", "path": "medication", "icon": <MeetingRoomIcon />},
        ]
    }

    function setNavData(){
        if(location.pathname.includes('/admin')){
            return adminNavData
        } else if(location.pathname.includes('/physician')){
            return physicianNavData
        } else if(location.pathname.includes('/pharmacist')){
            return pharmacistNavData
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className={'page-template'}>
            <TopNav homeLink={location.pathname.includes("/admin") ? "/admin/users"
                : location.pathname.includes("/physician") ? "/physician/dashboard" : "/pharmacist/dashboard"
            }/>
            <section className={'page-content-wrapper'}>
                {!location.pathname.includes("/login") && !location.pathname.includes("/signup") &&
                    <SideNav data={setNavData()}/>
                }
                <div className={'page-template-outlet-wrapper'}>
                    <Outlet context={[props.language, props.setLanguage]}/>
                </div>
            </section>
            <UnauthenticatedModal warn={"ACCESS DENIED"} message={"You haven't logged in! Please log in with your staff account"}/>
        </div>
    )
}