import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {TimePicker} from "@mui/x-date-pickers";
import {Radio, RadioGroup, Textarea} from "@mui/joy";
import {useOutletContext} from "react-router-dom";
import SelectedDoctor from "./SelectedDoctor.jsx";

export default function Detail(){
    const [appointmentData, setAppointmentData] = useOutletContext()

    function handleDataChange(e){
        setAppointmentData(prev => ({...prev, [e.target.name] : e.target.value}))
    }

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>Appointment Detail</Typography>
            <hr style={{width: '13.5rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <Stack rowGap={4}>
                <Stack>
                    <Typography level={'h4'} sx={{color: 'white'}}>Current Selected Doctor</Typography>
                    <SelectedDoctor appointmentData={appointmentData}/>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={'h4'} sx={{color: 'white'}}>Date & Time</Typography>
                    <Stack direction={'row'} alignItems={'center'} columnGap={2}>
                        <DatePicker disablePast={true} format={"DD/MM/YYYY"}
                            value={appointmentData.date}
                            onChange={(date) => setAppointmentData(prev => ({...prev, date}))}
                            slotProps={{
                                openPickerIcon: {sx: {color: 'white'}},
                                textField: {
                                    sx: {
                                        '& input': {
                                            backgroundColor: 'white',
                                        },
                                    },
                                },
                            }}/>
                        <TimePicker orientation={'landscape'} format={"HH:mm"} value={appointmentData.time} ampm={false}
                            onChange={(time) => setAppointmentData(prev => ({...prev, time}))}
                            slotProps={{
                                openPickerIcon: {sx: {color: 'white', borderColor: 'white'}},
                                textField: {
                                    sx: {
                                        '& input': {
                                            backgroundColor: 'white',
                                        },
                                    },
                                },
                        }}/>
                    </Stack>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={'h4'} sx={{color: 'white'}}>Reason for appointment</Typography>
                    <Textarea name={'reason'} value={appointmentData.reason}
                              onChange={handleDataChange} minRows={2} placeholder={"Provide brief reason why you want to make this appointment"}/>
                </Stack>
                <Stack rowGap={1} className={'appointment-detail-component'}>
                    <Typography level={'h4'} sx={{color: 'white'}}>Are you being referred by a doctor ?</Typography>
                    <RadioGroup name={"isReferred"} orientation="horizontal" onChange={handleDataChange}>
                        <Radio style={{color: 'white'}} value="yes" label="Yes" checked={appointmentData.isReferred === "yes"}/>
                        <Radio style={{color: 'white'}} value="no" label="No" checked={appointmentData.isReferred === "no"}/>
                    </RadioGroup>
                </Stack>
            </Stack>
        </>
    )
}