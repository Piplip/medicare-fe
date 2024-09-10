import Stepper from '@mui/joy/Stepper';
import Step, { stepClasses } from '@mui/joy/Step';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Typography, { typographyClasses } from '@mui/joy/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import '../styles/request-appointment-style.css'
import {Button, Stack} from "@mui/material";
import React, {useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router";

export const AppointmentContext = React.createContext({})

export default function RequestAppointment(){
    const location = useLocation()
    const noSelected = location.pathname.includes("none")
    const steps = [
        {title: 'Info', link: 'info'},
        {title: 'Request For', link: 'request-for'},
        ...(noSelected ? [{ title: 'Select a Doctor', link: 'find-a-doctor' }] : []),
        {title: 'Appointment Detail', link: 'appointment-detail'},
        {title: 'AppointmentConfirmation', link: 'confirmation'},
        {title: 'Payment', link: 'payment'}
    ]
    const refStep = {'info': 0, "request-for": 1, "find-a-doctor": 2
        , "appointment-detail": noSelected ? 3:2, confirmation: noSelected?4:3, payment: noSelected?5:4}
    const [currentStep, setCurrentStep] = useState(refStep[location.pathname.split('/')[3].split('?')[0]])
    const navigate = useNavigate()
    const [appointmentData, setAppointmentData] = useState({
        for: '',
        date: null,
        time: null,
        reason: '',
        isReferred: "no",
        doctor: {
            doctorID: location.pathname.split('/')[2],
            name: '',
            phone: '',
            department: '',
            specialization: '',
            'specialization-detail': '',
            language: '',
            image: ''
        }
    })

    console.log("appointment data", appointmentData)

    function goPreviousStep(){
        if(currentStep === 0) return
        setCurrentStep(prev => prev - 1)
        navigate(steps[currentStep - 1].link)
    }

    function goNextStep(){
        if(currentStep === steps.length - 1) return
        setCurrentStep(prev => prev + 1)
        navigate(steps[currentStep + 1].link)
    }

    return (
        <div className={'request-appointment-wrapper'}>
            <Stepper orientation="horizontal"
                sx={(theme) => ({
                    '--Stepper-verticalGap': '2.5rem',
                    '--StepIndicator-size': '2.5rem',
                    '--Step-gap': '1rem',
                    '--Step-connectorInset': '0.5rem',
                    '--Step-connectorRadius': '1rem',
                    '--Step-connectorThickness': '4px',
                    '--joy-palette-success-solidBg': 'green',
                    color: 'white',
                    [`& .${stepClasses.completed}`]: {
                        '&::after': { bgcolor: 'greenyellow' },
                    },
                    [`& .${stepClasses.active}`]: {
                        [`& .${stepIndicatorClasses.root}`]: {
                            border: '4px solid',
                            borderColor: '#fff',
                            boxShadow: `0 0 0 1px ${theme.vars.palette.primary[500]}`,
                        },
                    },
                    [`& .${stepClasses.disabled} *`]: {
                        color: 'neutral.softDisabledColor',
                    },
                    [`& .${typographyClasses['title-sm']}`]: {
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '10px',
                    },
                })}>
                {steps.map((label, index) => {
                    return (
                        <Step key={index} active={currentStep === index} completed={currentStep > index}
                            indicator={
                                <StepIndicator variant="solid"
                                               color={currentStep === index ? "primary" : currentStep > index ? "success" : "neutral"}
                                >
                                    {
                                        currentStep === index ?
                                            <AppRegistrationRoundedIcon />
                                            : currentStep < index ?
                                            index + 1
                                            : <CheckRoundedIcon />
                                    }
                                </StepIndicator>
                            }>
                            <div>
                                <Typography color={'white'} level="title-sm">Step {index + 1}</Typography>
                                {label.title}
                            </div>
                        </Step>
                    )
                })}
            </Stepper>
            <AppointmentContext.Provider value={{goNextStep: goNextStep}}>
                <Outlet context={[appointmentData, setAppointmentData]}/>
            </AppointmentContext.Provider>
            <Stack direction={'row'} columnGap={2}>
                <Button variant={'outlined'} sx={{borderColor: 'white', color: 'white'}} onClick={goPreviousStep}>Go Back</Button>
                {!location.pathname.includes('/request-for') &&
                    <Button variant={'contained'} onClick={goNextStep}>Continue</Button>
                }
            </Stack>
        </div>
    )
}