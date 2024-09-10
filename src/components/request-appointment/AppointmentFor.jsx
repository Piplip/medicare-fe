import {Stack} from "@mui/material";
import Me from '../../assets/me.png'
import Other from '../../assets/other.png'
import {useContext} from "react";
import {AppointmentContext} from "../../pages/RequestAppointment.jsx";
import Typography from "@mui/joy/Typography";
import {useOutletContext} from "react-router-dom";
import {UserContext} from "../../App.jsx";

export default function RequestAppointmentFor(){
    const currentUser = useContext(UserContext).currentUser
    const [_, setAppointmentData] = useOutletContext()
    const props = useContext(AppointmentContext)
    function nextStep(type){
        if(type === "me"){
            setAppointmentData(prev => ({
                ...prev,
                for: currentUser.lastName + ' ' + currentUser.firstName
            }))
        }
        props.goNextStep()
    }

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>Who is this Request For ?</Typography>
            <hr style={{width: '4.75rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <Stack direction={'row'} columnGap={'3rem'}>
                <Stack textAlign={'center'} fontSize={'1.5rem'} rowGap={1}>
                    <div className={'appointment-holder-wrapper'} onClick={() => nextStep("me")}>
                        <img className={'appointment-holder'} src={Me} alt={'Request Appointment For Me'}/>
                    </div>
                    <p>Me</p>
                </Stack>
                <Stack textAlign={'center'} fontSize={'1.5rem'} rowGap={1}>
                    <div className={'appointment-holder-wrapper'} onClick={() => nextStep("other")}>
                        <img className={'appointment-holder'} src={Other} alt={'Request Appointment For Me'}/>
                    </div>
                    <p>Someone else</p>
                </Stack>
            </Stack>
        </>
    )
}