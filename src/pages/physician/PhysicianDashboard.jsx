import '../../styles/physician-dashboard-style.css'
import {useEffect, useRef} from "react";
import React from "react";
import TableTemplate from "../../components/TableTemplate.jsx";
import {Button, FilledInput, FormControl, InputAdornment, InputLabel, Stack} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";

export default function PhysicianDashboard(){
    const hours = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]
    const timelineRef = useRef(null)
    const [width, setWidth] = React.useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (timelineRef.current) {
                setWidth(timelineRef.current.offsetWidth)
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize()
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const timelineData = [
        { start: 8, end: 9, title: 'John Doe - General Checkup' },
        { start: 9, end: 10.5, title: 'Jane Smith - Follow-up' },
        { start: 10, end: 11.75, title: 'Mary Johnson - Consultation' },
        { start: 11, end: 12.75, title: 'James Brown - Physical Therapy' },
        { start: 13, end: 15.5, title: 'Patricia Williams - New Patient' },
        { start: 14, end: 16.5, title: 'Michael Miller - Routine Checkup' },
        { start: 15, end: 17.75, title: 'Linda Davis - Specialist Referral' },
        { start: 16, end: 19.5, title: 'Barbara Wilson - Follow-up' },
        { start: 17, end: 20, title: 'David Taylor - Final Consultation' },
    ];

    const convertAndFormatHour = (hour) => {
        const date = new Date(0, 0, 0, Math.floor(hour), (hour % 1) * 60);
        return date.toLocaleTimeString(['vi-VN'], { hour: '2-digit', minute: '2-digit' });
    };

    const header = ['Patient Name', 'Reason', 'Location', 'Time', 'Duration', 'Status', 'Notes']
    const data = [
        {
            "Patient Name": "John Doe",
            "Reason": "Annual Checkup",
            "Location": "Exam Room 2",
            "Time": "10:00",
            "Duration": "30m",
            "Status": "Completed",
            "Notes": "Blood pressure slightly elevated, follow-up appointment recommended."
        },
        {
            "Patient Name": "Jane Smith",
            "Reason": "Follow-up for Flu",
            "Location": "Exam Room 1",
            "Time": "11:15",
            "Duration": "15m",
            "Status": "Pending",
            "Notes": "Symptoms improving, continue medication."
        },
        {
            "Patient Name": "David Lee",
            "Reason": "Sprained Ankle",
            "Location": "X-Ray Room",
            "Time": "13:00",
            "Duration": "45m",
            "Status": "Scheduled",
            "Notes": "Needs X-ray and referral to Ortho specialist."
        },
        {
            "Patient Name": "David Lee",
            "Reason": "Sprained Ankle",
            "Location": "X-Ray Room",
            "Time": "13:00",
            "Duration": "45m",
            "Status": "Scheduled",
            "Notes": "Needs X-ray and referral to Ortho specialist."
        },
    ];

    const header2 = ['Patient Name', 'Current Treatment Plan', 'Last Appointmnet Date', 'Admitting Status', 'EHR', 'Primary Diagnosis']
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

    return (
        <div className={'physician-dashboard'}>
            <div className={'appointment-timeline-view'}>
                <p className={'physician-panel-title'}>{`Today's Appointment`}</p>
                <div style={{padding: '1rem'}}>
                    <section style={{display: 'flex', flexDirection: 'column', marginLeft: '20px', marginBottom: '1rem'}}>
                        {timelineData.map((item, index) => {
                            const startHour = item.start;
                            const endHour = item.end;
                            const eventWidth = (endHour - startHour) * (width / 15);
                            const marginLeft = (startHour - 8) * (width / 15);
                            return (
                                <div
                                    key={index}
                                    className="timeline-data-item"
                                    style={{
                                        width: `${eventWidth}px`,
                                        marginLeft: `${marginLeft}px`,
                                    }}
                                >
                                    {convertAndFormatHour(item.start)} - {convertAndFormatHour(item.end)} | <b>{item.title}</b>
                                </div>
                            );
                        })}
                    </section>
                    <div ref={timelineRef} className={'timeline-bar'}>
                        {hours.map(hour => {
                            return (
                                <p className={'timeline-hour-indicator'}
                                   key={hour}>{hour >= 10 ? hour : `0${hour}`}:00</p>
                            )
                        })}
                    </div>
                </div>
                <TableTemplate header={header} data={data} isPagination={false}/>
            </div>
            <Stack spacing={1} style={{backgroundColor: 'white'}}>
                <p className={'physician-panel-title'}>My Patients</p>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'} paddingInline={1} paddingBlock={0.5}
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