import NotificationsIcon from '@mui/icons-material/Notifications';
import '../../styles/top-nav-style.css'
import {Link} from "react-router-dom";

export default function TopNav(props){
    return (
        <nav id={'top-nav'}>
            <Link to={props.homeLink} className={'nav-logo'}>
                Medicare<span style={{color: 'orangered'}}>Plus</span>
            </Link>
            <div id={'nav-cmd'}>
                <p>Help</p>
                <NotificationsIcon fontSize={'large'}/>
            </div>
        </nav>
    )
}