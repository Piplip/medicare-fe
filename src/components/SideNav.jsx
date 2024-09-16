import "../styles/side-nav-style.css"
import {NavLink} from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {useState} from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {Link} from "@mui/material";

export default function SideNav(props){
    const [isCollapsed, setIsCollapsed] = useState(true)
    return (
        <nav className={'side-nav'}>
            {!isCollapsed &&
                <section id={`profile-wrapper`}>
                    <Link to={'profile'}>
                        <img
                            src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzKZ6mH6XAVIT487Fk0t-r6VOeCSbeqwTUNw&s"}
                            alt={"profile-picture"}/>
                    </Link>
                    <div id={'profile-info'}>
                        <p>Dwayne Johnson</p>
                        <p>Welcome</p>
                    </div>
                </section>
            }
            <section className={'side-nav-main-wrapper'}>
                {!isCollapsed && <p>{props.data.title} Menu</p>}
                <div id={'side-nav-main'}>
                    {props.data.pages.map((page, index) => {
                        return (
                            <NavLink style={({isActive}) => {
                                return {
                                    backgroundColor: isActive ? '#7eff95' : '',
                                    color: isActive ? 'black' : ''
                                }
                            }}
                                     to={page.path} key={index} className={`side-nav-item ${isCollapsed ? 'side-nav-item-collapsed' : ''}`}>
                                {page.icon}
                                {!isCollapsed && <p className={'side-nav-item-des'}>{page.name}</p>}
                            </NavLink>
                        )})}
                </div>
            </section>
            {!isCollapsed ?
                <KeyboardArrowLeftIcon onClick={() => setIsCollapsed(isCollapsed => !isCollapsed)}
                                       fontSize={'large'} id={'collapse-nav-btn'}/>
                :
                <KeyboardArrowRightIcon onClick={() => setIsCollapsed(isCollapsed => !isCollapsed)}
                                        fontSize={'large'} id={'collapse-nav-btn'}/>
            }
        </nav>
    )
}