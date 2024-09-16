import {useOutletContext} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import SelectedDoctor from "./SelectedDoctor.jsx";
import {Stack} from "@mui/material";
import {Radio, RadioGroup} from "@mui/joy";

export default function AppointmentConfirmation(){
    const [appointmentData, setAppointmentData] = useOutletContext()

    function pad(num){
        return num.toString().padStart(2, '0')
    }

    function handleDataChange(e){
        setAppointmentData(prev => ({...prev, [e.target.name] : e.target.value}))
    }

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>Confirm Appointment Info</Typography>
            <hr style={{width: '8rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <>
                <Typography level={'body-lg'} sx={{color: 'white'}}>
                    Please confirm the following information carefully as it will be used to schedule your appointment.
                </Typography>
                <div className={'appointment-confirmation-wrapper'}>
                    <div>
                        <Typography level={'h4'} sx={{color: '#919191'}}>Appointment For</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>{appointmentData.for}</Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: '#919191'}}>Date</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>
                            {pad(appointmentData.date['$D']) + '/' + pad(appointmentData.date['$M']) + '/' + appointmentData.date['$y']}
                        </Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: '#919191'}}>Time</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>
                            {pad(appointmentData.time['$H']) + ':' + pad(appointmentData.time['$m'])}
                        </Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: '#919191'}}>Reason</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white', overflow: 'hidden', textOverflow: 'clip'}}>{appointmentData.reason}</Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: '#919191'}}>Your Selected Doctor</Typography>
                        <SelectedDoctor appointmentData={appointmentData} />
                    </div>
                </div>
            </>
            <Typography level={'body-lg'} sx={{color: 'white'}}>
                If you feel satisfied with this information, you can now proceed to the payment step.<br/>
                (To make changes, please click the &ldquo;GO BACK&ldquo; button)
            </Typography>
            <Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={"body-lg"} sx={{color: 'white'}}>Also, would you like to receive a reminder for this appointment ?</Typography>
                    <RadioGroup name={"reminder"} orientation="horizontal" onChange={handleDataChange}>
                        <Radio style={{color: 'white'}} value="yes" label="Yes" checked={appointmentData.reminder === "yes"}/>
                        <Radio style={{color: 'white'}} value="no" label="No" checked={appointmentData.reminder === "no"}/>
                    </RadioGroup>
                </Stack>
            </Stack>
        </>
    )
}