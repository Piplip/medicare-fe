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
import {useEffect, useState} from "react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import {Link} from 'react-router-dom';

export default function Homepage(){
    const [open, setOpen] = useState(true)
    const [showDialogAfter, setShowDialogAfter] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowDialogAfter(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);
    if(open === false && localStorage.getItem('isVisited') === null){
        localStorage.setItem('isVisited', 'true')
    }

    const servicesData = [
        {title: 'Cardiology', description: 'Comprehensive heart care for all ages', image: Cardiology},
        {title: 'Emergency', description: '24/7 emergency care for critical conditions', image: Emergency},
        {title: 'Neurology', description: 'Expert neurological care for complex conditions', image: Neurology},
        {title: 'Orthopedics', description: 'Advanced care for bone and joint conditions', image: Orthopedics},
        {title: 'Pediatrics', description: 'Specialized care for children and adolescents', image: Pediatrics},
        {title: 'Oncology', description: 'Comprehensive cancer treatment', image: Oncology}
    ]
    const patientVisitorData = [
        {title: 'Insurance Plans', description: 'See a list of accepted insurance plans and how to use them', image: Insurance},
        {title: 'Parking Information', description: 'Find out where to park and get directions to our facilities', image: ParkingInfo},
        {title: 'Patient Rights', description: 'Understand your rights and responsibility as a patient', image: PatientRight},
        {title: 'Visiting Hours', description: 'Learn about our visiting hours and guidelines to make your visit smooth and enjoyable.', image: VisitingHour}
    ]
    const callToActionsData = [
        {title: 'Log in or create an account', description: 'Access your information anytime, anywhere', icon: <PersonAddAlt1Icon sx={{fontSize: '2.5rem', color: 'white'}}/>, btnText: 'Login/Create account', btnLink: 'login'},
        {title: 'Schedule an appointment', description: 'Book an appointment with a healthcare provider of your choice', icon: <EditCalendarIcon sx={{fontSize: '2.5rem', color: 'white'}}/>, btnText: 'Schedule Now', btnLink: 'schedule'},
        {title: 'Find a Doctor suit your needs', description: 'Search for a healthcare provider based on your preferences', icon: <PersonSearchIcon sx={{fontSize: '2.5rem', color: 'white'}}/>, btnText: 'Find a Doctor', btnLink: 'find-a-doctor'},
        {title: "News and Updates", description: "Stay informed about the latest happenings and news.", icon: <NewspaperIcon sx={{ fontSize: '2.5rem', color: 'white' }} />, btnText: "Learn More", btnLink: "/news"}
    ]

    return (
        <>
            {showDialogAfter &&
                <Dialog open={open && localStorage.getItem('isVisited') !== 'true'}>
                    <DialogTitle sx={{m: 0, p: '1 3'}}>
                        <Typography variant={'h5'}>Medicare.<span>Plus</span></Typography>
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],}}>
                        <CloseIcon onClick={() => setOpen(false)}/>
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
                                 src={'https://cdn.tuoitre.vn/471584752817336320/2023/5/10/iu6-1683694373791472731774.png'}
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
                            <Typography variant={'h3'} color={'white'}>Welcome to <span
                                style={{color: 'yellow'}}>Medicare</span><span
                                style={{color: 'orangered'}}>Plus</span>
                            </Typography>
                            <Typography variant={'h5'}>A comprehensive healthcare solution for all your
                                needs</Typography>
                        </div>
                    </div>
                    <div className={'call-to-action-container'}>
                        {callToActionsData.map((item, index) => {
                            return (
                                <div className={'call-to-action-item'} key={index}>
                                    <div className={'call-to-action-icon-wrapper'}>
                                        {item.icon}
                                    </div>
                                    <div className={'call-to-action-main'}>
                                        <Stack>
                                            <Typography variant={'h5'}>{item.title}</Typography>
                                            <Typography variant={'body2'}>{item.description}</Typography>
                                        </Stack>
                                        <Link to={item.btnLink}>
                                            <button className={'call-to-action-btn'}>{item.btnText}</button>
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
                    Our Services
                </Typography>
                <div className={'homepage-service'}>
                    {servicesData.map((item, index) => {
                        return (
                            <div key={index}
                                 style={{padding: '1rem', border: '1px solid white', borderRadius: '.5rem',}}>
                                <div className={'service-item'}>
                                    <img src={item.image} alt={item.title}/>
                                    <Typography variant={'h6'} fontWeight={'bold'}>{item.title}</Typography>
                                    <Typography variant={'body2'}>{item.description}</Typography>
                                    <Button size={'small'}
                                            sx={{
                                                width: '100%',
                                                backgroundColor: '#3a6e6e',
                                                color: 'white',
                                                paddingBlock: 1,
                                                '&:hover': {
                                                    backgroundColor: '#254646', // or your desired hover color
                                                },
                                            }}
                                            variant={'outlined'}
                                    >
                                        Learn more
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
                        <Typography variant={'h4'} fontWeight={'bold'}>Contact Us</Typography>
                        <p>Hospital Address<span className={'about-info'}>1234 Health St, Wellness City</span></p>
                        <p>Phone<span className={'about-info'}>123-456-7890</span></p>
                        <p>Email<span className={'about-info'}>medicareplus@gmail.com</span></p>
                        <p>Regular Hours<span className={'about-info'}>Mon - Fri, 8 AM - 6 PM</span></p>
                        <p>Emergency Hours<span className={'about-info'}>24/7</span></p>
                    </Stack>
                    <Stack rowGap={3}>
                        <Typography variant={'h4'} fontWeight={'bold'}>Emergency Contact</Typography>
                        <p>Emergency Number<span className={'about-info'}>123-456-7890</span></p>
                        <p>Emergency Hours<span className={'about-info'}>24/7</span></p>
                    </Stack>
                </div>
                <img src={MapLocation} alt={'map-location'}/>
            </section>
            <section className={'patient-visitor-information'}>
                <Typography textAlign={'center'} fontWeight={'bold'} variant={'h4'}>Patient & Visitor
                    Information</Typography>
                <div className={'patient-visitor'}>
                    {patientVisitorData.map((item, index) => {
                        return (
                            <div key={index} className={'patient-visitor-item'}>
                                <Stack style={{maxWidth: '50%'}} rowGap={1}>
                                    <Typography color={'yellow'} variant={'h5'}>{item.title}</Typography>
                                    <Typography variant={'body2'}>{item.description}</Typography>
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
                                        variant={'outlined'} size={'small'} style={{width: 'fit-content'}}>Learn
                                        More</Button>
                                </Stack>
                                <img src={item.image} alt={item.title}/>
                            </div>
                        )
                    })}
                </div>
            </section>
        </>
    )
}