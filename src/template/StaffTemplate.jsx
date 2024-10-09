import {Outlet, useLocation} from "react-router";
import {useEffect} from "react";
import TopNav from "../components/TopNav.jsx";
import SideNav from "../components/SideNav.jsx";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ScienceIcon from '@mui/icons-material/Science';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import '../styles/side-nav-style.css'
import '../styles/staff-template-style.css'

export default function StaffTemplate(props){
    const physicianNavData = {
        "title": "Physician",
        "pages": [
            {"name": "Dashboard", "path": "dashboard", "icon": <DashboardIcon />},
            {"name": "Patient Management", "path": "patient-view", "icon": <ManageAccountsIcon />},
            {"name": "Appointment Scheduling", "path": "appointment-scheduling", "icon": <MeetingRoomIcon />},
            {"name": "Labs & Tests", "path": "labs-tests", "icon": <ScienceIcon />},
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

    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className={'page-template'}>
            <TopNav/>
            <section className={'page-content-wrapper'}>
                <SideNav data={location.pathname.includes('/admin') ? adminNavData : physicianNavData}/>
                <div className={'page-template-outlet-wrapper'}>
                    <Outlet context={[props.language, props.setLanguage]}/>
                </div>
            </section>
        </div>
    )
}