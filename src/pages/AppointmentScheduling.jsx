import '../styles/patient-scheduling-style.css'
import {
    Button,
    FormControlLabel,
    InputAdornment,
    Stack, TextField,
    Typography
} from "@mui/material";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import {yellow} from "@mui/material/colors";
import {useState} from "react";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import NotesIcon from '@mui/icons-material/Notes';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import CheckIcon from '@mui/icons-material/Check';

export default function AppointmentScheduling(){
    const scheduleData = [
        {
            time: '09:00 AM - 10:00 AM',
            data: ['Available', 'Unavailable', 'Unavailable', 'Unavailable', 'Available']
        },
        {
            time: '10:00 AM - 11:00 AM',
            data: ['Available', 'Unavailable', 'Available', 'Available', 'Available']
        },
        {
            time: '11:00 AM - 12:00 PM',
            data: ['Available', 'Available', 'Available', 'Unavailable', 'Available']
        },
        {
            time: '01:00 PM - 02:00 PM',
            data: ['Unavailable', 'Available', 'Available', 'Available', 'Available']
        },
        {
            time: '02:00 PM - 03:00 PM',
            data: ['Available', 'Available', 'Unavailable', 'Available', 'Available']
        },
        {
            time: '03:00 PM - 04:00 PM',
            data: ['Available', 'Available', 'Available', 'Unavailable', 'Available']
        },
        {
            time: '04:00 PM - 05:00 PM',
            data: ['Available', 'Available', 'Available', 'Available', 'Unavailable']
        }
    ];
    const  [showAvailable, setShowAvailable] = useState(true)
    const [showUnavailable, setShowUnavailable] = useState(false)
    function checkExactMatch(str, subString) {
        let regex = new RegExp(`\\b${subString.replace(/\|/g, "\\|")}\\b`);
        return regex.test(str);
    }

    return (
        <div className={'patient-scheduling'}>
            <Typography variant={'h5'} fontWeight={'bold'}>Schedule Selection</Typography>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'row'} alignItems={'center'} columnGap={3} width={'60%'}>
                    <Input
                        sx={{
                            backgroundColor: 'white',
                            padding: '0.25rem .75rem',
                            width: '50%'
                        }}
                        placeholder={'Find a Provider'} fullWidth/>
                    <Typography variant={'h5'}>Viewing scheduling for <b>Dr. Smith</b></Typography>
                </Stack>
                <Stack direction={'row'}>
                    <FormControlLabel
                        value="start"
                        control={<Checkbox  sx={{
                            color: yellow[800],
                            '&.Mui-checked': {
                                color: yellow[600],
                            },
                        }} checked={showAvailable} onClick={() => setShowAvailable(prev => !prev)}/>}
                        label="Available"
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        value="start"
                        control={<Checkbox sx={{
                            color: yellow[800],
                            '&.Mui-checked': {
                                color: yellow[600],
                            },
                        }} checked={showUnavailable} onClick={() => setShowUnavailable(prev => !prev)}/>
                        }
                        label="Unavailable"
                        labelPlacement="start"
                    />
                </Stack>
            </Stack>
            <div className={'schedule-table'}>
                <div className={'schedule-table-header'}>
                    <p className={'schedule-table-cell'}>Time</p>
                    <p className={'schedule-table-cell'}>Monday</p>
                    <p className={'schedule-table-cell'}>Tuesday</p>
                    <p className={'schedule-table-cell'}>Wednesday</p>
                    <p className={'schedule-table-cell'}>Thursday</p>
                    <p className={'schedule-table-cell'}>Friday</p>
                </div>
                <div className={'schedule-table-content'}>
                    {scheduleData.map((item, index) => (
                        <div key={index} className={'schedule-table-row'}>
                            <p className={'schedule-table-cell'}>{item.time}</p>
                            {item.data.map((item, index) => (
                                <p key={index} className={'schedule-table-cell'}
                                   style={{color: checkExactMatch(item, 'Available') ? 'lightgreen' : 'red'}}>
                                    {checkExactMatch(item, 'Available') ? showAvailable ? item : '' : showUnavailable ? item : ''}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className={'schedule-preview'}>
                <Typography variant={'h5'} fontWeight={'bold'}>Selected Schedule Preview</Typography>
                <Stack rowGap={1.25}>
                    <p>Provider: <b>Dr. John Doe</b></p>
                    <p>Time: <b>09:00 AM - 10:00 AM</b></p>
                    <p>Date: <b>Monday, 20th September 2024</b></p>
                    <p>Location: <b>124, Seoul, South Korea</b></p>
                    <Button variant={'contained'} style={{width: 'fit-content', alignSelf: 'center', backgroundColor: '#295457'}}>
                        Proceed with this schedule
                    </Button>
                </Stack>
            </div>
            <div className={'appointment-form'}>
                <Typography variant={'h5'} fontWeight={'bold'} textAlign={'center'}>
                    In order to proceed with the schedule, please fill out the form below
                </Typography>
                <Stack rowGap={1.5}>
                    <TextField placeholder={'Full Name'}
                               InputProps={{startAdornment: (<InputAdornment position="start"><PersonIcon /></InputAdornment>),}} variant="outlined"/>
                    <TextField placeholder={'Email'}
                               InputProps={{startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>),}} variant="outlined"/>
                    <TextField placeholder={'Phone Number'}
                               InputProps={{startAdornment: (<InputAdornment position="start"><LocalPhoneIcon /></InputAdornment>),}} variant="outlined"/>
                    <DatePicker sx={{display: 'flex'}} label={'Date of Birth'}/>
                    <TextField placeholder={'Additional Note (Optional)'}
                               InputProps={{startAdornment: (<InputAdornment position="start"><NotesIcon /></InputAdornment>),}} variant="outlined"/>
                    <Button variant={'contained'} style={{width: 'fit-content', alignSelf: 'center', backgroundColor: '#295457'}} startIcon={<CheckIcon />}>
                        CONFIRM APPOINTMENT
                    </Button>
                </Stack>
            </div>
        </div>
    )
}