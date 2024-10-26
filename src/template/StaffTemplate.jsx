import {Outlet, useLocation} from "react-router";
import {useEffect} from "react";
import TopNav from "../components/TopNav.jsx";
import SideNav from "../components/SideNav.jsx";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import '../styles/side-nav-style.css'
import '../styles/staff-template-style.css'
import UnauthenticatedModal from "../components/UnauthenticatedModal.jsx";

export default function StaffTemplate(props){
    const location = useLocation()

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className={'page-template'}>
            <TopNav homeLink={location.pathname.includes("/admin") ?
                "/admin/users" : "/physician/dashboard"
            }/>
            <section className={'page-content-wrapper'} style={{flexGrow: 1}}>
                {!location.pathname.includes("/login") && !location.pathname.includes("/signup") &&
                    <SideNav data={location.pathname.includes('/admin') ? adminNavData : physicianNavData}/>
                }
                <div className={'page-template-outlet-wrapper'}>
                    <Outlet context={[props.language, props.setLanguage]}/>
                </div>
            </section>
            <UnauthenticatedModal />
        </div>
    )
}