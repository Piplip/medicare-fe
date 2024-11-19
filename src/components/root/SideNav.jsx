import "../../styles/side-nav-style.css"
import {NavLink} from "react-router-dom";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {useEffect, useState} from "react";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {Link} from "@mui/material";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../config/FirebaseConfig.jsx";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import DefaultImage from '../../assets/default.jpg'
import {staffAxios} from "../../config/axiosConfig.jsx";

export default function SideNav(props){
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [ppImage, setPPImage] = useState(localStorage.getItem('imageURL') || null)

    useEffect(() => {
        if(localStorage.getItem('email') !== null){
            staffAxios.get('/fetch')
                .then(res => {
                    localStorage.setItem('imageURL', res.data)
                    setPPImage(res.data)
                }).catch(err => {
                    console.log(err)
                })
        }
    }, []);

    useEffect(() => {
        if(ppImage !== null){
           let storageRef = ref(storage, ppImage)
           getDownloadURL(storageRef)
               .then(url => setPPImage(url))
               .catch((err) => {
                   console.log(err)
                   setPPImage(null)
               })
       }
    }, [ppImage]);

    return (
        <nav className={'side-nav'} style={{position: isCollapsed ? '' : 'fixed', zIndex: 10}}>
            {!isCollapsed &&
                <section id={`profile-wrapper`}>
                    <Link to={'profile'}>
                        <img
                            src={ppImage === null ? DefaultImage : ppImage}
                            alt={"profile-picture"}/>
                    </Link>
                    <div id={'profile-info'}>
                        <p>{localStorage.getItem('firstName') + " " + localStorage.getItem('lastName')}</p>
                        <p>{localStorage.getItem('email')}</p>
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