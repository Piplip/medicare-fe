import {Button, Stack} from "@mui/material";
import Typography from "@mui/joy/Typography";
import {Outlet, useLocation, useNavigate} from "react-router";
import '../../styles/user-profile-style.css'
import {NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useRef, useState} from "react";
import {UserProfileContext} from "../../App.jsx";
import baseAxios from "../../config/axiosConfig.jsx";

export default function UserProfile(props){
    const {t} = useTranslation('common')
    const location = useLocation()
    const [isModify, setIsModify] = useState(false)
    const navigate = useNavigate()
    const navData = [
        {title: t('user_profile.nav.nav1'), path: 'personal-info'},
        {title: t('user_profile.nav.nav2'), path: 'payment'},
        {title: t('user_profile.nav.nav3'), path: 'appointment-history'},
        {title: 'Feedback', path: 'feedback'}
    ]
    const [phoneNumber, setPhoneNumber] = useState(["", ""])
    const phoneRef = useRef()

    function logout(){
        props.logout()
        navigate('/login')
    }

    function handleChangeProfile(){
        if(isModify) {
            baseAxios.post('/change-profile?' + new URLSearchParams({"phone": phoneNumber[0], "subPhone": phoneNumber[1], "email": localStorage.getItem("email")}))
                .then(r => {
                    setIsModify(false)
                    alert(r.data)
                })
                .catch(err => console.log(err))
        }
        else setIsModify(true)
    }

    return (
        <div className={'user-profile-wrapper'} style={{paddingInline: location.pathname.includes('appointment-history') ? '5%' : '15%'}}>
            <Stack direction={'row'} justifyContent={'space-between'} borderBottom={'1px solid'} alignItems={'center'} paddingBottom={'1rem'}>
                {location.pathname.includes('personal-info') ?
                    <Stack direction={'row'} columnGap={1}>
                        <Button variant={'contained'} color={isModify ? 'primary' : 'error'}
                                onClick={handleChangeProfile}
                        >
                            {isModify ? t('user_profile.save-btn') : t('user_profile.edit-btn')}
                        </Button>
                        {isModify &&
                            <Button variant={'contained'} onClick={() => {
                                setIsModify(false)
                                setPhoneNumber(phoneRef.current)
                            }} color={'error'}>
                                {t('user_profile.cancel-btn')}
                            </Button>
                        }
                    </Stack> : <div></div>
                }
                <Button variant={'contained'} onClick={logout}
                        sx={{backgroundColor: '#3700a4', '&:hover': {backgroundColor: '#36007B'}}}
                >
                    {t('user_profile.logout-btn')}
                </Button>
            </Stack>
            <div className={'user-profile-main'}>
                <div className={'menu-panel'}>
                    <div className={'user-info'}>
                        <div className={'user-profile-img'}>
                            {props.currentUser.firstName[0]}
                        </div>
                        <Typography color={'white'} level={'h3'} fontWeight={'bold'}>
                            {props.currentUser.lastName + " " + props.currentUser.firstName}
                        </Typography>
                        <Typography color={'white'} level={'body1'}>{props.currentUser.email}</Typography>
                    </div>
                    <div className={'profile-navigation'}>
                        {navData.map((item, index) => {
                            return (
                                <NavLink to={item.path} key={index}
                                    style={({ isActive}) => {
                                        return {
                                            color: isActive ? 'yellow' : 'white',
                                            fontWeight: isActive ? 'bold' : 'normal'
                                        };
                                    }}
                                >
                                    {item.title}
                                </NavLink>
                            )})
                        }
                    </div>
                </div>
                <div className={'display-panel'}>
                    <UserProfileContext.Provider value={{isModify, phoneNumber, setPhoneNumber, phoneRef}}>
                        <Outlet />
                    </UserProfileContext.Provider>
                </div>
            </div>
        </div>
    )
}