import {
    Button,
    FormControl, IconButton,
    InputAdornment, InputBase,
    Stack,
    Typography
} from "@mui/material";
import TempLogo from '../assets/tempLogo.png'
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {Outlet, useLocation, useNavigate} from "react-router";
import {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import '../styles/root-template-style.css'
import {useTranslation} from "react-i18next";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {UserContext} from "../App.jsx";

export default function RootTemplate(props){
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const {t} = useTranslation('common')

    const {currentUser, _} = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <>
            <div className={'root-container'}>
                <div className={'root-nav'}>
                    <Link to={'/'} className={'nav-logo'}>
                        Medicare<span style={{color: 'orangered'}}>Plus</span>
                    </Link>
                    <div className={'root-nav-links'}>
                        <Link className={'nav-links'} to={'/find-a-doctor'}>
                            <p>{t('header.nav.nav1')}</p>
                        </Link>
                        <Link className={'nav-links'} to={'/schedule/none/info'}>
                            <p>{t('header.nav.nav2')}</p>
                        </Link>
                        <Link className={'nav-links'} to={'/visitor'}>
                            <p>{t('header.nav.nav3')}</p>
                        </Link>
                        {localStorage.getItem('SESSION-ID') &&
                            <div className={'profile'}>
                                <IconButton className={'profile-btn'}>
                                    <PersonIcon sx={{
                                        color: 'white',
                                        width: '2.25rem',
                                        height: '2.25rem',
                                        border: '2px solid white', borderRadius: '50%', padding: '0.25rem',
                                        '&:hover': {
                                            backgroundColor: 'yellow',
                                            color: 'black'
                                        }
                                    }}/>
                                </IconButton>
                                <div className={'profile-menu'}>
                                    <p>{currentUser.lastName + " " + currentUser.firstName}</p>
                                    <Link className={'profile-nav-links'} to={`/profile/${localStorage.getItem('SESSION-ID')}/personal-info`}>
                                        {t('header.nav.nav4')}</Link>
                                    <Link className={'profile-nav-links'} to={'/settings'}>{t('header.nav.nav5')}</Link>
                                    <div className={'profile-nav-links'} onClick={() => {
                                        props.logout()
                                        navigate('/login')
                                    }}>{t('header.nav.nav6')}</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <Outlet />
                <section className={'root-footer'}>
                    <Stack direction={'row'} alignItems={'center'} columnGap={2}>
                        <img style={{width: '3rem'}} src={TempLogo} alt={'logo'}/>
                        <Typography variant={'h3'} color={'yellow'}>Medicare<span
                            style={{color: 'orangered'}}>Plus</span></Typography>
                    </Stack>
                    {currentUser.email === '' &&
                        <div className={'footer-subscribe-form'}>
                            <Typography variant={'h5'} width={'50%'}>{t('footer.subscribe.title')}</Typography>
                            <FormControl variant="standard">
                                <Stack direction={'row'} alignItems={'center'}>
                                    <InputBase style={{padding: '0.25rem 1rem', backgroundColor: '#e7e7e7'}}
                                               placeholder={t('footer.subscribe.placeholder')}
                                               startAdornment={
                                                   <InputAdornment position="start">
                                                       <EmailIcon/>
                                                   </InputAdornment>
                                               }
                                    />
                                    <Button sx={{
                                        height: '100%', borderRadius: 0
                                    }} variant={'contained'}>{t('footer.subscribe.button')}</Button>
                                </Stack>
                            </FormControl>
                        </div>
                    }
                    <Stack direction={'row'} marginTop={10} width={props.language === 'vi' ? '80%' : '55%'}
                           justifyContent={'space-between'}>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>{t('footer.legal.title')}</Typography>
                            <p>{t('footer.legal.link1')}</p>
                            <p>{t('footer.legal.link2')}</p>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>{t('footer.about.title')}</Typography>
                            <p>{t('footer.about.link1')}</p>
                            <p>{t('footer.about.link2')}</p>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>{t('footer.contact.title')}</Typography>
                            <p>{import.meta.env.VITE_ADDRESS}</p>
                            <p>{import.meta.env.VITE_PHONE}</p>
                            <p>{import.meta.env.VITE_EMAIL}</p>
                            <p>Share your thoughts</p>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>{t('footer.career.title')}</Typography>
                            <p>{t('footer.career.link1')}</p>
                            <p>{t('footer.career.link2')}</p>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} width={'80%'} marginBlock={'5rem 1rem'}>
                        <Select value={props.language}>
                            <Option value={"vi"} onClick={() => props.changeLanguage('vi')}>Tiếng Việt</Option>
                            <Option value={"en"} onClick={() => props.changeLanguage('en')}>English</Option>
                        </Select>
                        <p className={'footer-copyright'}>&copy; 2023 MedicarePlus, Inc</p>
                        <Stack direction={'row'} columnGap={1}>
                            <FacebookIcon/>
                            <LinkedInIcon/>
                            <XIcon/>
                        </Stack>
                    </Stack>
                </section>
            </div>
            <div className={'chat-btn'}>
                <ChatIcon />
            </div>
        </>
    )
}