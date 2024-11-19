import '../../styles/admin-audit-style.css'
import {FilledInput, FormControl, InputAdornment, InputLabel, Stack,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SelectBasic from "../../components/CustomSelect.jsx";
import TableTemplate from "../../components/root/TableTemplate.jsx";

export default function AdminAudit(){
    const tableHeader = ['Staff Name', 'Staff Email', 'Action Type', 'Data Access', 'Timestamp', 'Detail']
    const data = [
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
        {name: 'Mira Max', email: 'miramax123@gmail.com', type: 'View EHR Data', dataAccess: 'Patient EHR Data', timestamp: '2021-10-10 10:00:00', detail: 'Viewed patient EHR data'},
    ]

    return (
        <div className={'admin-audit-container'}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stack>
                    <h1>Audit Logs</h1>
                    <p>Manage all the operation within the system</p>
                </Stack>
                <FormControl size={'small'} sx={{width: '30%'}} variant="filled">
                    <InputLabel>Search by keywords...</InputLabel>
                    <FilledInput sx={{
                        backgroundColor: 'white',
                        '&:hover': {color: 'white'},
                    }}
                                 type={'text'}
                                 endAdornment={<InputAdornment position="end"><SearchIcon/></InputAdornment>}/>
                </FormControl>
            </Stack>
            <section className={'audit-log-header'}>
                <div>
                    <p className={'audit-log-header-title'}>Action</p>
                    <SelectBasic />
                </div>
                <div>
                    <p className={'audit-log-header-title'}>Specific Date</p>
                    <DatePicker sx={{
                        backgroundColor: 'white',
                    }}/>
                </div>
                <p style={{alignSelf: 'center'}}>or</p>
                <div>
                    <p className={'audit-log-header-title'}>Start Date</p>
                    <DatePicker sx={{
                        backgroundColor: 'white',
                        height: '2rem'
                    }}/>
                </div>
                <div>
                    <p className={'audit-log-header-title'}>End Date</p>
                    <DatePicker sx={{
                        backgroundColor: 'white'
                    }}/>
                </div>
            </section>
            <Stack rowGap={2}>
               <TableTemplate data={data} header={tableHeader} isPagination={true}/>
            </Stack>
        </div>
    )
}