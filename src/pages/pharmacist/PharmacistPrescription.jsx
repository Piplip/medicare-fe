import '../../styles/pharmacist-prescription-styles.css'
import {Stack} from "@mui/joy";
import CircleIcon from '@mui/icons-material/Circle';
import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import dayjs from "dayjs";
import { Client } from '@stomp/stompjs';
import {webSocketAxios} from "../../config/axiosConfig.jsx";
import {useLoaderData} from "react-router";
import {getCookie} from "../../components/Utilities.jsx";
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import {useTranslation} from "react-i18next";
import {useReactToPrint} from "react-to-print";

function PharmacistPrescription(){
    const [open, setOpen] = useState(false);
    const loaderData = useLoaderData().data
    const [prescriptions, setPrescriptions] = useState(loaderData || [])
    const prescriptionRef = useRef(prescriptions || [])
    const [currentPrescription, setCurrentPrescription] = useState(null)
    const [viewingPharmacistName, setViewingPharmacistName] = useState(Array(prescriptions.length).fill(''))

    const medicationHeader = ['m-name', 'dosage', 'frequency', 'm-start-date', 'm-end-date', "m-doctor-note"]
    const [timeGap, setTimeGap] = useState(Array(prescriptions.length).fill(0))

    const {t} = useTranslation('common')
    const printRef = useRef(null)
    const handlePrint = useReactToPrint({
        contentRef: printRef
    })

    useEffect(() => {
        const interval = setInterval(() => {
            timeGapTracker(prescriptions)
        }, 60000)

        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        sortPrescription(prescriptions)
        timeGapTracker(prescriptions)
    }, []);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
                stompClient.subscribe('/prescriptions',  async (message) => {
                    if(message.body){
                        const body = JSON.parse(message.body)
                        if(body.signalID === 'CP-100'){
                            if(prescriptionRef.current.every(item => item.appointmentID.toString() !== body.data['prescription'].appointmentID.toString())) {
                                 setPrescriptions(prev => [...prev, body.data['prescription']])
                                 prescriptionRef.current = [...prescriptionRef.current, body.data['prescription']]
                                viewingPharmacistName.push('')
                             }
                             else{
                                const prescriptions = prescriptionRef.current.map(((item, index) => {
                                    if(item.appointmentID.toString() === body.data['prescription'].appointmentID.toString()){
                                        if(viewingPharmacistName[index] !== ''){
                                            body.data['prescription']['status'] = 'IN-PROGRESS'
                                        }
                                        return body.data['prescription']
                                    }
                                    return item
                                }))
                                setPrescriptions(prescriptions)
                                prescriptionRef.current = prescriptions
                             }
                        }
                         else if(body.signalID === 'PH_01'){
                            if(getCookie('STAFF-ID').toString() === body.data['staffID'])
                                setOpen(false)
                            let changeIndex
                            let _prescriptions = prescriptionRef.current.map(((item, index) => {
                                if(item['prescribedID'] === body.data['prescribedID']) {
                                    item['status'] = 'DONE'
                                    changeIndex = index
                                }
                                return item
                            }))
                            setPrescriptions(_prescriptions)
                            timeGapTracker(prescriptions)
                            setTimeout(() => {
                                prescriptions.splice(changeIndex, 1)
                                setPrescriptions(prescriptions)
                            }, 5000)
                            prescriptionRef.current = _prescriptions
                         }
                         else if(body.signalID === 'MC-1001'){
                             let changeIndex;
                            const prescriptions = prescriptionRef.current.map(((item, index) => {
                                if(item['prescribedID'] === body.data['prescribedID']) {
                                    item['status'] = 'IN-PROGRESS'
                                    changeIndex = index
                                }
                                return item
                            }))
                            if(getCookie('STAFF-ID') !== body.data['viewPersonID']){
                                viewingPharmacistName[changeIndex] = body.data['name']
                                setViewingPharmacistName(viewingPharmacistName)
                            }
                            setPrescriptions(prescriptions)
                            prescriptionRef.current = prescriptions
                        }
                        else if(body.signalID === 'MC-1002'){
                            let changeIndex
                            const prescriptions = prescriptionRef.current.map(((item, index) => {
                                if(item['prescribedID'] === body.data['prescribedID']) {
                                    item['status'] = 'PENDING'
                                    changeIndex = index
                                }
                                return item
                            }))
                            if(getCookie('STAFF-ID') !== body.data['viewPersonID']){
                                viewingPharmacistName[changeIndex] = ''
                                setViewingPharmacistName(viewingPharmacistName)
                            }
                            setPrescriptions(prescriptions)
                            prescriptionRef.current = prescriptions
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        })
        stompClient.activate()

        return () => {
            stompClient.deactivate();
        };
    }, []);

    function timeGapTracker(appointments){
        setTimeGap(appointments.map((item) => {
            return determineTimeGap(item['prescribedTime'])
        }))
    }

    function sortPrescription(prescriptions){
        return prescriptions.sort((a, b) => {
            return new Date(a['prescribedTime']) >= new Date(b['prescribedTime']) ? a : b
        })
    }

    function determineProgress(index){
        switch (prescriptions[index].status){
            case 'PENDING':
                return ['Pending', '#ffeb3b']
            case 'IN-PROGRESS':
                return ['IN-PROGRESS', '#ff9800']
            case 'DONE':
                return ['DONE', '#4caf50']
        }
    }

    function determineTimeGap(time){
        return dayjs().diff(dayjs(time, "HH:mm DD:MM:YYYY"), 'minutes')
    }

    console.log(prescriptions)

    return(
        <div className={'pharmacist-medication-container'}>
            <Typography variant={'h4'} fontFamily={"monospace"} textAlign={'center'} marginBottom={'.25rem'}>
                {t('pharmacist.prescription.title', {count: prescriptions?.length})}
            </Typography>
            <div>
                {prescriptions &&
                    <div className={'newest-indicator-wrapper'}>
                        <p>{t('pharmacist.prescription.older')}</p>
                        <Stack direction={'row'}>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                            <PlayArrowOutlinedIcon className={'slide-left-icon'}/>
                        </Stack>
                        <p>{t('pharmacist.prescription.newer')}</p>
                    </div>
                }
                <div className={'prescription-card-container'}>
                    {prescriptions ? prescriptions.map((item, index) => {
                            return (
                                <div className={'prescription-card'} key={index}
                                     style={{opacity: item && item['status'] === 'DONE' ? 0.5 : 1}}>
                                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}
                                           sx={{backgroundColor: '#e0f7fa'}} padding={1}>
                                        <p>
                                            <span className={'prescription-order-indicator'}>{(index + 1).toString().padStart(2, '0')}</span>
                                            &emsp;{t('pharmacist.prescription.card.wait-for')}
                                            <span style={{color: parseInt(timeGap[index], 10) >= 30 ? '#e50d0d' : 'black', fontStyle: 'italic', fontWeight: 'bold'}}>
                                                {` ${timeGap[index]} `}
                                            </span>{t('pharmacist.prescription.card.min')}
                                        </p>
                                        <Tooltip title={determineProgress(index)[0]} placement={'top'}>
                                        <CircleIcon sx={{color: determineProgress(index)[1]}}/>
                                        </Tooltip>
                                    </Stack>
                                    <Stack className={'prescription-card-main'} padding={'0.25rem .5rem'} rowGap={'5px'}>
                                        <p>{t('pharmacist.prescription.card.name')}: <b>{item.name}</b></p>
                                        <p>{t('pharmacist.prescription.card.p-doctor')}: <b>{item['doctorName']}</b></p>
                                        <p>{t('pharmacist.prescription.card.p-time')}: <b>{item['prescribedTime']}</b></p>
                                        <p>{t('pharmacist.prescription.card.total')}: <b>{item['medicationList'].length}</b></p>
                                    </Stack>
                                    <Stack alignContent={'center'}>
                                        <Button sx={{backgroundColor: '#2196f3', fontSize: '12px'}} variant={'contained'}
                                                disabled={item['status'] === 'DONE'}
                                                onClick={() => {
                                                    webSocketAxios.post('/view/prescription?' + new URLSearchParams({
                                                        prescribedID: item['prescribedID']
                                                        ,
                                                        name: localStorage.getItem('firstName') + " " + localStorage.getItem('lastName')
                                                        ,
                                                        id: getCookie('STAFF-ID')
                                                    }))
                                                    setCurrentPrescription(index)
                                                    setOpen(true)
                                                }}
                                        >{t('pharmacist.prescription.card.view')}</Button>
                                    </Stack>
                                    {item['status'] === 'IN-PROGRESS' && viewingPharmacistName &&
                                        <div className={'viewing-prescription-panel'}>
                                            <p>{t('pharmacist.prescription.select-by-other', {name: viewingPharmacistName[index]})}</p>
                                        </div>
                                    }
                                </div>
                            )
                        })
                        :
                        <Stack sx={{width: '100%', textAlign: 'center', backgroundColor: 'white'}}>
                            <Typography variant={'h6'}>No prescription available</Typography>
                        </Stack>
                    }
                </div>
            </div>
            <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit"
                            onClick={() => {
                                webSocketAxios.post('/leave/prescription?' + new URLSearchParams({
                                    prescribedID: prescriptions[currentPrescription]['prescribedID']
                                    , name: localStorage.getItem('firstName') + " " + localStorage.getItem('lastName')
                                    , id: getCookie('STAFF-ID')
                                }))
                                setOpen(false)
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1, fontSize: '20px', fontWeight: 'bold'}}>
                            {t('prescription.title')}
                        </Typography>
                        <Stack direction={'row'} columnGap={1}>
                            <Button variant="contained" color={'primary'} startIcon={<LocalPrintshopIcon/>} onClick={handlePrint}>
                                {t('prescription.btn.print')}
                            </Button>
                            <Button variant="contained" color={'secondary'} startIcon={<TaskAltIcon/>}
                                    onClick={() => {
                                        webSocketAxios.post('/complete/prescription?' + new URLSearchParams({
                                            prescribedID: prescriptions[currentPrescription]['prescribedID'],
                                            staffID: getCookie('STAFF-ID')
                                        }))
                                            .then(r => {
                                                console.log(r)
                                            })
                                            .catch(err => console.log(err))
                                    }}
                            >
                                {t('prescription.btn.complete')}
                            </Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
                {currentPrescription !== null &&
                    <Stack sx={{paddingBlock: '20px'}} rowGap={1} ref={printRef}>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>
                                {t('prescription.patient-info.title')}
                            </p>
                            <div className={'prescription-detail-patient-info'}>
                                <p>{t('prescription.patient-info.name')}: <b>{prescriptions[currentPrescription]['name']}</b></p>
                                <p>{t('prescription.patient-info.dob')}: <b>{prescriptions[currentPrescription]['dateOfBirth']}</b></p>
                                <p>{t('prescription.patient-info.gender')}: <b>{t(`gender.${prescriptions[currentPrescription]['gender']}`)}</b></p>
                                <p>{t('prescription.patient-info.phone')}: <b>(123) 456 789</b></p>
                                <p>{t('prescription.patient-info.address')}: <b>{prescriptions[currentPrescription]['address']}</b></p>
                            </div>
                        </Stack>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>{t('prescription.detail.title')}</p>
                            <Stack>
                                <div className={'prescription-detail-doctor-info'}>
                                    <p>{t('prescription.detail.doctor')}: <b>{prescriptions[currentPrescription]['doctorName']}</b></p>
                                    <p>{t('prescription.detail.time')}: <b>{prescriptions[currentPrescription]['prescribedTime']}</b></p>
                                    <p>{t('prescription.detail.phone')}: <b>(987) 654 3210</b></p>
                                </div>
                                <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'red'}}>{t('prescription.detail.diagnosis')}
                                    <p className={'doctor-diagnosis'}>{prescriptions[currentPrescription]['diagnosis']}</p>
                                </div>
                            </Stack>
                            <Stack>
                                <p style={{color: 'red', fontWeight: 'bold', fontSize: '1.25rem'}}>
                                    {t('prescription.detail.p-medications', {total: prescriptions[currentPrescription]['medicationList'].length})}
                            </p>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                                {medicationHeader.map((item, index) =>
                                                    <TableCell sx={{color: 'white'}} key={index}>{t(`table.${item}`)}</TableCell>)}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {prescriptions[currentPrescription]['medicationList'].map((item, index) => (
                                                <TableRow key={index} sx={{
                                                    '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                                    '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                                }}>
                                                    <TableCell>{item['name']}</TableCell>
                                                    <TableCell>{item['dosage']}</TableCell>
                                                    <TableCell>{item['frequency']}</TableCell>
                                                    {/*<TableCell>{item['quantity']}</TableCell>*/}
                                                    <TableCell>{dayjs(item['startDate']).format('DD-MM-YYYY')}</TableCell>
                                                    <TableCell>{dayjs(item['endDate']).format('DD-MM-YYYY')}</TableCell>
                                                    <TableCell>{item['note']}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Stack>
                        </Stack>
                        <Stack className={'prescription-detail-section'}>
                            <p className={'prescription-detail-main-title'}>Pharmacist Notes</p>
                            <textarea style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '14px',
                                width: '100%',
                                minWidth: '100%',
                                backgroundColor: '#f9f9f9',
                                fontFamily: 'cursive, sans-serif',
                                minHeight: '5rem',
                                maxHeight: '10rem',
                                maxWidth: '100%'
                            }}
                                      placeholder={'Enter note here'}
                            />
                        </Stack>
                    </Stack>
                }
            </Dialog>
        </div>
    )
}

export default PharmacistPrescription