import {
    Button,
    FormControl,
    InputAdornment, InputBase,
    Stack,
    Typography
} from "@mui/material";
import TempLogo from '../assets/tempLogo.png'
import EmailIcon from '@mui/icons-material/Email';
import SelectBasic from "../components/CustomSelect.jsx";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {Outlet, useLocation} from "react-router";
import {useEffect} from "react";
import {Link} from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';

export default function RootTemplate(){
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    return (
        <>
            <div className={'root-container'}>
                <div className={'root-nav'}>
                    <Link to={'/'} className={'nav-logo'}>
                        Medicare<span style={{color: 'orangered'}}>Plus</span>
                    </Link>
                    <div className={'root-nav-links'}>
                        <Stack alignItems={'center'} direction={'row'} columnGap={2}>
                            <p>Find a Doctor</p>
                            <p>Appointments</p>
                            <p>Patients & Visitor</p>
                        </Stack>
                    </div>
                </div>
                <Outlet/>
                <section className={'root-footer'}>
                    <Stack direction={'row'} alignItems={'center'} columnGap={2}>
                        <img style={{width: '3rem'}} src={TempLogo} alt={'logo'}/>
                        <Typography variant={'h3'} color={'yellow'}>Medicare<span
                            style={{color: 'orangered'}}>Plus</span></Typography>
                    </Stack>
                    <div className={'footer-subscribe-form'}>
                        <Typography variant={'h5'} width={'50%'}>Subscribe to our newsletter</Typography>
                        <FormControl variant="standard">
                            <Stack direction={'row'} alignItems={'center'}>
                                <InputBase style={{padding: '0.25rem 1rem', backgroundColor: '#e7e7e7'}}
                                           placeholder={'Enter your email'}
                                           startAdornment={
                                               <InputAdornment position="start">
                                                   <EmailIcon/>
                                               </InputAdornment>
                                           }
                                />
                                <Button sx={{
                                    height: '100%', borderRadius: 0
                                }} variant={'contained'}>SUBSCRIBE</Button>
                            </Stack>
                        </FormControl>
                    </div>
                    <Stack direction={'row'} marginTop={10} width={'55%'} justifyContent={'space-between'}>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>Legal</Typography>
                            <p>Privacy Policy</p>
                            <p>Terms of Use</p>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>About Us</Typography>
                            <p>Our Team</p>
                            <p>Our Story</p>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>Contact Us</Typography>
                            <p>1234 Health St, Wellness City</p>
                            <p>123-456-7890</p>
                            <p>medicareplus@gmail.com</p>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h5'}>Career</Typography>
                            <p>Join Our Team</p>
                            <p>Internship</p>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} width={'80%'} marginBlock={'5rem 1rem'}>
                        <SelectBasic/>
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
                <ChatIcon/>
            </div>
        </>
    )
}