import {useOutletContext} from "react-router-dom";
import Typography from "@mui/joy/Typography";
import SelectedDoctor from "./SelectedDoctor.jsx";

export default function AppointmentConfirmation(){
    const [appointmentData, _] = useOutletContext()

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
                        <Typography level={'h4'} sx={{color: 'white'}}>Appointment For</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>{appointmentData.for}</Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: 'white'}}>Date</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>
                            {appointmentData.date['$D'] + '/' + appointmentData.date['$M'] + '/' + appointmentData.date['$y']}
                        </Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: 'white'}}>Time</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>
                            {appointmentData.time['$H'] + ':' + appointmentData.time['$m']}
                        </Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: 'white'}}>Reason</Typography>
                        <Typography level={'body-lg'} sx={{color: 'white'}}>{appointmentData.reason}</Typography>
                    </div>
                    <div>
                        <Typography level={'h4'} sx={{color: 'white'}}>Your Selected Doctor</Typography>
                        <SelectedDoctor appointmentData={appointmentData} />
                    </div>
                </div>
            </>
        </>
    )
}