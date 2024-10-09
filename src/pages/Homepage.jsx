import '../styles/homepage-style.css'
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography} from "@mui/material";
import MapLocation from "../assets/location.png";
import Cardiology from "../assets/cardiology.png";
import Emergency from "../assets/emergency.png";
import Neurology from "../assets/neurology.png";
import Orthopedics from "../assets/orthopedics.png";
import Pediatrics from "../assets/pediatrics.png";
import Oncology from "../assets/oncology.png";
import Insurance from "../assets/insurance.png";
import ParkingInfo from "../assets/parking-info.png";
import PatientRight from "../assets/patient-rights.png";
import VisitingHour from "../assets/visiting-hours.png";
import CloseIcon from "@mui/icons-material/Close";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import {useContext, useEffect, useState} from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import {Link} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {UserContext} from "../App.jsx";
import FirstTimeImg from '../assets/first-time-image.jpg'

export default function Homepage(){
    const [open, setOpen] = useState(true)
    const [showDialogAfter, setShowDialogAfter] = useState(false);

    const currentUser = useContext(UserContext).currentUser

    console.log(currentUser)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowDialogAfter(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);
    if(open === false && localStorage.getItem('isVisited') === null){
        localStorage.setItem('isVisited', 'true')
    }

    const servicesData = [Cardiology, Emergency, Neurology, Orthopedics, Pediatrics, Oncology]
    const patientVisitorData = [Insurance, ParkingInfo, PatientRight, VisitingHour]
    const callToActionsData = [
        {icon: <PersonAddAlt1Icon sx={{fontSize: '2.5rem', color: 'white'}}/>, btnLink: 'login'},
        {icon: <EditCalendarIcon sx={{fontSize: '2.5rem', color: 'white'}}/>, btnLink: 'schedule/none/info'},
        {icon: <PersonSearchIcon sx={{fontSize: '2.5rem', color: 'white'}}/>, btnLink: 'find-a-doctor'},
        {icon: <NewspaperIcon sx={{ fontSize: '2.5rem', color: 'white' }} />, btnLink: "news"}
    ]

    const {t} = useTranslation("homepage")

    return (
        <>
            {showDialogAfter && localStorage.getItem('email') == null &&
                <Dialog open={open && localStorage.getItem('isVisited') !== 'true'}>
                    <DialogTitle sx={{m: 0, p: '1 3', color: 'yellow', fontWeight: 'bold', backgroundColor: '#000000'}}>
                        Medicare<span style={{color: 'orangered'}}>Plus</span>
                    </DialogTitle>
                    <IconButton onClick={() => setOpen(false)}
                        aria-label="close"
                        sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],}}>
                        <CloseIcon />
                    </IconButton>
                    <DialogContent sx={{display: 'flex', flexDirection: 'column', rowGap: 2}}>
                        <Stack direction={'row'} columnGap={1}>
                            <Stack rowGap={1}>
                                <Typography variant={'h5'} fontWeight={'bold'}>Make the most of your
                                    Medicare</Typography>
                                <Typography variant={'body1'}>
                                    Sign up to get important reminders & information about Medicare and your healthcare
                                </Typography>
                            </Stack>
                            <img style={{width: '40%'}}
                                 src={FirstTimeImg}
                                 alt={'medicare-plus'}/>
                        </Stack>
                        <Stack rowGap={1}>
                            <Typography variant={'h6'} fontWeight={'bold'}>Get Started with Email Address</Typography>
                            <Typography variant={'body2'}>We will never share your email with other</Typography>
                            <Input/>
                            <Stack direction={'row'} alignItems={'center'}>
                                <Checkbox/>
                                <p>By checking this box, you consent to our privacy policy</p>
                            </Stack>
                            <Button variant={'contained'}>Continue</Button>
                        </Stack>
                    </DialogContent>
                </Dialog>
            }
            <section className={'homepage-hero'}>
                <div className={'hero-main-wrapper'}>
                    <div className={'hero-main-intro-text'}>
                        <div>
                            <Typography variant={'h3'} color={'white'}>{t('hero-main')}<span
                                style={{color: 'yellow'}}>Medicare</span><span
                                style={{color: 'orangered'}}>Plus</span>
                            </Typography>
                            <Typography variant={'h5'}>{t("hero-sub")}</Typography>
                        </div>
                    </div>
                    <div className={'call-to-action-container'}>
                        {callToActionsData.map((item, index) => {
                            if(index === 0 && localStorage.getItem('SESSION-ID')) return
                            return (
                                <div className={'call-to-action-item'} key={index}>
                                    <div className={'call-to-action-icon-wrapper'}>
                                        {item.icon}
                                    </div>
                                    <div className={'call-to-action-main'}>
                                        <Stack>
                                            <Typography variant={'h5'}>{t(`call-to-action.item${index+1}.title`)}</Typography>
                                            <Typography variant={'body2'}>{t(`call-to-action.item${index+1}.description`)}</Typography>
                                        </Stack>
                                        <Link to={item.btnLink}>
                                            <button className={'call-to-action-btn'}>{t(`call-to-action.item${index+1}.button`)}</button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <section className={'homepage-service-wrapper'}>
                <Typography variant={'h4'} textAlign={'center'} fontWeight={'bold'}>
                    {t('service.title')}
                </Typography>
                <div className={'homepage-service'}>
                    {servicesData.map((item, index) => {
                        return (
                            <div key={index} className={'service-item-container'}>
                                <div className={'service-item'}>
                                    <img src={item} alt={'service'}/>
                                    <Typography variant={'h6'} fontWeight={'bold'}>{t(`service.service${index+1}.name`)}</Typography>
                                    <Typography variant={'body2'}>{t(`service.service${index+1}.description`)}</Typography>
                                    <Button size={'small'} className={'service-item-btn'}
                                            sx={{
                                                width: '100%',
                                                backgroundColor: '#3a6e6e',
                                                color: 'white',
                                                paddingBlock: 1,
                                                '&:hover': {
                                                    backgroundColor: '#254646',
                                                },
                                            }}
                                            variant={'outlined'}
                                    >
                                        {t('service.button')}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
            <section className={'homepage-about-wrapper'}>
                <div className={'homepage-about'}>
                    <Stack borderBottom={'2px solid white'} rowGap={2} paddingBottom={'1rem'}>
                        <Typography variant={'h4'} fontWeight={'bold'}>{t('contact.title')}</Typography>
                        <p>{t('contact.address-title')}<span className={'about-info'}>{import.meta.env.VITE_ADDRESS}</span></p>
                        <p>{t('contact.phone')}<span className={'about-info'}>{import.meta.env.VITE_PHONE}</span></p>
                        <p>Email<span className={'about-info'}>{import.meta.env.VITE_EMAIL}</span></p>
                        <p>{t('contact.regular-hours')}<span className={'about-info'}>{t('contact.working-hours')}</span></p>
                    </Stack>
                    <Stack rowGap={3}>
                        <Typography variant={'h4'} fontWeight={'bold'}>{t('contact.emergency-contact')}</Typography>
                        <p>{t('contact.emergency-hours')}<span className={'about-info'}>24/7</span></p>
                        <p>{t('contact.emergency-phone')}<span className={'about-info'}>{import.meta.env.VITE_EMERGENCY_PHONE}</span></p>
                        <p>{t('contact.emergency-address')}<span className={'about-info'}>{t('emergency_address', {ns: 'common'})}</span></p>
                    </Stack>
                </div>
                <img src={MapLocation} alt={'map-location'}/>
            </section>
            <section className={'patient-visitor-information'}>
                <Typography textAlign={'center'} fontWeight={'bold'} variant={'h4'}>{t('visitor-info.title')}</Typography>
                <div className={'patient-visitor'}>
                    {patientVisitorData.map((item, index) => {
                        return (
                            <div key={index} className={'patient-visitor-item'}>
                                <Stack style={{maxWidth: '50%'}} rowGap={1}>
                                    <Typography color={'yellow'} variant={'h5'}>{t(`visitor-info.item${index+1}.title`)}</Typography>
                                    <Typography variant={'body2'}>{t(`visitor-info.item${index+1}.description`)}</Typography>
                                    <Button
                                        sx={{
                                            width: '100%',
                                            backgroundColor: '#3a6e6e',
                                            color: 'white',
                                            paddingBlock: 0.5,
                                            '&:hover': {
                                                backgroundColor: '#254646',
                                            },
                                        }}
                                        variant={'outlined'} size={'small'} style={{width: 'fit-content'}}>{t('visitor-info.button')}</Button>
                                </Stack>
                                <img src={item} alt={'visitor information'}/>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}