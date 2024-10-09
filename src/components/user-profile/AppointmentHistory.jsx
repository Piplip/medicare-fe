import Typography from "@mui/joy/Typography";
import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import {useState} from "react";
import {Modal, ModalClose, Sheet} from "@mui/joy";
import {useLoaderData} from "react-router";

export default function AppointmentHistory(){
    const loaderData = useLoaderData()
    console.log(loaderData.data)

    const tableHeader = ['ID', 'Date & Time', 'Department', 'Provider', 'Status']
    const [showModal, setShowModal] = useState(false)
    const [currentAppointment, setCurrentAppointment] = useState({})

    function showDetail(appointmentID){
        setShowModal(true)
    }

    return (
        <>
            <Modal aria-labelledby="modal-title"
                open={showModal} onClose={() => setShowModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Sheet variant="outlined" sx={{minWidth: '30%', maxWidth: '50%', borderRadius: 'md', p: 3}}>
                    <Stack borderBottom={'1px solid'} marginBottom={'1rem'}>
                        <ModalClose variant="plain" sx={{ m: 1 }} />
                        <Typography level="h4" sx={{ fontWeight: 'lg', mb: 1 }}>
                            Appointment Detail
                        </Typography>
                    </Stack>
                    <div className={'appointment-basic-info'}>
                        <Typography level="body1">Appointment ID: {currentAppointment.id}</Typography>
                        <Typography level="body1">Date & Time: {currentAppointment.date}</Typography>
                        <Typography level="body1">Department: {currentAppointment.department}</Typography>
                        <Typography level="body1">Provider: {currentAppointment.provider}</Typography>
                        <Typography level="body1">Status: {currentAppointment.status}</Typography>
                    </div>
                    <Stack marginTop={'1rem'} paddingTop={'1rem'} borderTop={'1px solid'}>
                        <Typography level="h4">Prescribed Medication</Typography>

                    </Stack>
                </Sheet>
            </Modal>
            <Stack rowGap={'1rem'}>
                <Typography color={'white'} level={'h2'}>Appointment History</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                {tableHeader.map((item, index) =>
                                    <TableCell sx={{color: 'white'}} key={index}>{item}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loaderData.data.records.map((item, index) => (
                                <Tooltip title={"Click to view detail"} key={index} followCursor>
                                    <TableRow onClick={() => showDetail(item[0])} sx={{
                                        '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                        '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                    }}>
                                        <TableCell>{item[0]}</TableCell>
                                        <TableCell>{item[2] + " " + item[1]}</TableCell>
                                        <TableCell>{item[6]}</TableCell>
                                        <TableCell>{item[7] + " " + item[8]}</TableCell>
                                        <TableCell>{item[4]}</TableCell>
                                    </TableRow>
                                </Tooltip>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    )
}