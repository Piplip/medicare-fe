import '../../styles/physician-dashboard-style.css'
import {useEffect, useState} from "react";
import TableTemplate from "../../components/TableTemplate.jsx";
import {
    Alert,
    Button,
    FilledInput,
    FormControl, FormControlLabel,
    InputAdornment,
    InputLabel,
    Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Tooltip,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import {useLoaderData} from "react-router";
import UnauthenticatedModal from "../../components/UnauthenticatedModal.jsx";
import Input from "@mui/joy/Input";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import Checkbox from "@mui/joy/Checkbox";
import dayjs from "dayjs";

export default function PhysicianDashboard(){
    const loaderData = useLoaderData()
    const appointments = loaderData === null ? null : loaderData.data.records
    const [filterAppointments, setFilterAppointments] = useState([])
    const todayAppointments = appointments && appointments.filter(item => compareDate(item[3]))
    const [currentAppointment, setCurrentAppointment] = useState(null)
    const [filter, setFilter] = useState({
        query: "",
        startDate: null,
        endDate: null,
        status: [1,1,1,1]
    })
    const refStatus = {"DONE": 0, "CANCELLED": 1, "SCHEDULED": 2, "CONFIRMED": 3}
    const statusBadgeBgColor = {"SCHEDULED": "brown", "CONFIRMED": "green", "CANCELLED": "#ff0000", "DONE": "blue"}
    const statusBadgeTextColor = {"SCHEDULED": "white", "CONFIRMED": "white", "CANCELLED": "white", "DONE": "white"}
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        setFilterAppointments(appointments)
    }, [loaderData]);

    useEffect(() => {
        if(appointments !== null){
            setFilterAppointments(appointments.filter(item => {
                const fullName = item[6] + " " + item[5]
                if(filter.query !== "" && !fullName.toLowerCase().match(filter.query.toLowerCase())) return false
                if(filter.startDate !== null && dayjs(filter.startDate).isAfter(new Date(item[3]))) return false
                if(filter.endDate !== null && dayjs(filter.endDate).isBefore(new Date(item[3]))) return false
                if(filter.status[refStatus[item[14]]] !== 1) return false
                return item
            }))
        }
    }, [filter]);

    const header2 = ['Patient Name', 'Current Treatment Plan', 'Last Appointment Date', 'Admitting Status', 'EHR', 'Primary Diagnosis']
    const data2 = [
        {
            "Patient Name": "John Doe",
            "Current Treatment Plan": "Monitor blood pressure and adjust medication as needed.",
            "Last Appointment Date": "2024-06-15", // YYYY-MM-DD format
            "Admitting Status": "Outpatient",
            "EHR": "1234567890", // Replace with your Electronic Health Record system identifier format
            "Primary Diagnosis": "Hypertension"
        },
        {
            "Patient Name": "Jane Smith",
            "Current Treatment Plan": "Continue medication for flu symptoms and monitor for improvement.",
            "Last Appointment Date": "2024-06-17",
            "Admitting Status": "Outpatient",
            "EHR": "9876543210",
            "Primary Diagnosis": "Influenza"
        },
        {
            "Patient Name": "David Lee",
            "Current Treatment Plan": "Rest, ice, compression for sprained ankle. Referral to Ortho specialist for further evaluation.",
            "Last Appointment Date": "2024-06-18",
            "Admitting Status": "Outpatient",
            "EHR": "0123456789",
            "Primary Diagnosis": "Ankle Sprain"
        },
        // ... add more patient data objects as needed
    ];

    function compareDate(date){
        const _date = new Date(date)
        const now = new Date()
        return now.getDay() === _date.getDay() && now.getMonth() === _date.getMonth() && now.getFullYear() === _date.getFullYear()
    }

    const header = ['Appointment ID', 'Patient Name', 'Address', 'Appointment Time', 'Reason', 'Status']

    function handleChangeStatus(index){
        const prevStatus = [...filter.status]
        if(prevStatus.reduce((a, b) => a + b) === 1 && prevStatus[index] === 1){
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
            return
        }
        prevStatus[index] ^= 1
        setFilter(prev => ({...prev, status: prevStatus}))
    }

    console.log(filter.status)

    return (
        <div className={'physician-dashboard'}>
            <UnauthenticatedModal />
            <div style={{backgroundColor: 'white'}}>
                <p className={'physician-panel-title'}>Appointments</p>
                <Stack columnGap={1} rowGap={.5} padding={'1rem'}>
                    <div style={{borderBottom: '2px solid', paddingBottom: '.5rem'}}>
                       <Typography variant={'h6'}>Upcoming Appointments ({todayAppointments && todayAppointments.length})</Typography>
                        <Stack direction={'row'} gap={1} sx={{flexWrap: 'wrap'}}>
                            {todayAppointments && todayAppointments.map((item, index) => {
                                return (
                                    compareDate(item[3]) &&
                                    <Stack key={index} className={'simple-appointment-card'}
                                           onClick={() => setCurrentAppointment(index)}>
                                        <Stack direction={'row'} justifyContent={'space-between'}>
                                            <p>{item[6] + " " + item[5]}</p>
                                            <p>{item[4]}</p>
                                        </Stack>
                                        <p style={{marginTop: '0.5rem'}}>{item[2]}</p>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </div>
                    {appointments && appointments[currentAppointment] &&
                        <Stack sx={{border: '5px solid', padding: '0.5rem 1rem'}}>
                            <Typography variant={'h5'} textAlign={'center'}>DETAIL</Typography>
                            <div className={'detail-appointment-view'}>
                                <p>Patient Name: {appointments[currentAppointment][6]} {appointments[currentAppointment][5]}</p>
                                <p>Birthday: {appointments[currentAppointment][7]}</p>
                                <p>Address: {appointments[currentAppointment][9]}, {appointments[currentAppointment][10]}, {appointments[currentAppointment][11]}, {appointments[currentAppointment][12]}</p>
                                <p>Gender: {appointments[currentAppointment][8]}</p>
                                <p>Appointment Time: {appointments[currentAppointment][4]} {appointments[currentAppointment][3]}</p>
                                <p>Appointment Description: {appointments[currentAppointment][2]}</p>
                            </div>
                            <Button sx={{alignSelf: 'end', width: 'fit-content'}} variant={'contained'}
                                onClick={() => setCurrentAppointment(null)}
                            >Close</Button>
                        </Stack>
                    }
                    <Stack>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} paddingBottom={1}>
                            <Input autoFocus placeholder={'Search by name...'}
                                   sx={{minWidth: '25rem'}} value={filter.query}
                                   onChange={(e) => {
                                        setFilter(prev => {
                                            return {...prev, query: e.target.value}
                                        })
                                    }}
                            />
                            <Stack direction={'row'} columnGap={'1rem'}>
                                <Stack rowGap={1}>
                                    <Stack direction={'row'} alignItems={'center'} columnGap={1}>
                                        <p>Status</p>
                                        {showAlert &&
                                            <Alert severity="warning"
                                                   sx={{fontSize: '0.9rem', padding: '0rem 1rem', width: 'fit-content'}}
                                            >
                                                At least 1 must be selected
                                            </Alert>
                                        }
                                    </Stack>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem'}}>
                                        <FormControlLabel control={<Checkbox sx={{marginRight: 1}} onChange={() => setFilter(prev => ({...prev, status: [1,1,1,1]}))}
                                                                             checked={filter.status.every(val => val === 1)}/>} label="ALL"
                                            disabled={filter.status.every(val => val === 1)}
                                        />
                                        <FormControlLabel
                                            control={<Checkbox sx={{marginRight: 1}} onChange={() => handleChangeStatus(0)}
                                                               checked={filter.status.every(val => val === 1) || filter.status[0] === 1}/>} label="DONE" />
                                        <FormControlLabel
                                            control={<Checkbox sx={{marginRight: 1}} onChange={() => handleChangeStatus(1)}
                                                               checked={filter.status.every(val => val === 1) || filter.status[1] === 1}/>} label="CANCELLED" />
                                        <FormControlLabel
                                            control={<Checkbox sx={{marginRight: 1}} onChange={() => handleChangeStatus(2)}
                                                               checked={filter.status.every(val => val === 1) || filter.status[2] === 1}/>} label="SCHEDULED" />
                                        <FormControlLabel
                                            control={<Checkbox sx={{marginRight: 1}} onChange={() => handleChangeStatus(3)}
                                                               checked={filter.status.every(val => val === 1) || filter.status[3] === 1}/>} label="CONFIRMED" />
                                    </div>
                                </Stack>
                                <Stack direction={'row'} alignItems={'center'} columnGap={'1rem'}>
                                    <DatePicker format={"DD-MM-YYYY"} label={"Start Date"}
                                                onChange={(date) => setFilter(prev => ({...prev, startDate: date}))}
                                                sx={{width: '200px'}}
                                                slotProps={{
                                                    field: { clearable: true, onClear: () => setFilter(prev => ({...prev, startDate: null}))},
                                                }}
                                    />
                                    <DatePicker format={"DD-MM-YYYY"} label={"End Date"} sx={{width: '200px'}}
                                                onChange={(date) => setFilter(prev => ({...prev, endDate: date}))}
                                                slotProps={{
                                                    field: { clearable: true, onClear: () => setFilter(prev => ({...prev, endDate: null}))},
                                                }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: '#36007B'}}>
                                        {header.map((item, index) =>
                                            <TableCell sx={{color: 'white'}} key={index}>{item}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterAppointments && filterAppointments.map((item, index) => (
                                        <Tooltip title={"Click to view detail"} key={index} followCursor>
                                            <TableRow sx={{
                                                '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                                '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                            }}>
                                                <TableCell>{item[0]}</TableCell>
                                                <TableCell>{item[6] + " " + item[5]}</TableCell>
                                                <TableCell>{item[9]} {item[10]}, {item[11]}, {item[12]}</TableCell>
                                                <TableCell>{item[4]} {item[3]}</TableCell>
                                                <TableCell>{item[2]}</TableCell>
                                                <TableCell>
                                                    <p style={{padding: '0.25rem .5rem',
                                                        backgroundColor: statusBadgeBgColor[item[14]],
                                                        color: statusBadgeTextColor[item[14]],
                                                        width: 'fit-content',
                                                        borderRadius: '0.3rem', fontSize: '0.6rem'
                                                    }}
                                                    >
                                                        {item[14]}
                                                    </p>
                                                </TableCell>
                                            </TableRow>
                                        </Tooltip>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </Stack>
            </div>
            <Stack spacing={1} style={{backgroundColor: 'white'}}>
                <p className={'physician-panel-title'}>My Patients</p>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'}
                       paddingInline={1} paddingBlock={0.5}
                       className={'table-filters'}>
                    <FormControl size={'small'} sx={{width: '30%'}} variant="filled">
                        <InputLabel>Search by first name, last name, department,...</InputLabel>
                        <FilledInput sx={{
                            height: '2.75rem'
                        }}
                                     type={'text'}
                                     endAdornment={<InputAdornment position="end"><SearchIcon/></InputAdornment>}/>
                    </FormControl>
                    <Stack direction={'row'} spacing={1.5} className={'table-filters-btn'}>
                        <Button variant="contained" startIcon={<FilterAltIcon/>}>Filter</Button>
                        <Button variant="contained" startIcon={<SortIcon/>}>Sort</Button>
                    </Stack>
                </Stack>
                <TableTemplate header={header2} data={data2} isPagination={false}/>
            </Stack>
        </div>
    )
}