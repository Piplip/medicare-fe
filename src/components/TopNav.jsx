import NotificationsIcon from '@mui/icons-material/Notifications';
import '../styles/top-nav-style.css'

export default function TopNav(){
    return (
        <nav id={'top-nav'}>
            <img className={'logo'} src={'https://cdn.worldvectorlogo.com/logos/chocopie.svg'} alt={'logo'} />
            <div id={'nav-cmd'}>
                <p>Help</p>
                <NotificationsIcon fontSize={'large'}/>
            </div>
        </nav>
    )
}