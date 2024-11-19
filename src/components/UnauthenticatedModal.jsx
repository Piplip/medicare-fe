import {Modal, ModalDialog, Stack} from "@mui/joy";
import {Button, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {getCookie} from "./Utilities.jsx";

export default function UnauthenticatedModal(props){
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const staffID = getCookie('STAFF-ID')
        if(staffID === null && !location.pathname.includes("/login")){
            setOpen(true)
        }
    }, []);

    return (
        <Modal open={open}>
            <ModalDialog>
                <Typography variant={'h4'} color={'red'}>{props.warn}</Typography>
                <Typography variant={'h6'}>
                    {props.message}
                </Typography>
                <Stack>
                    <Button variant={'contained'} color={'primary'} onClick={() => {
                        setOpen(false)
                        navigate('/staff/login')
                    }}>LOG IN / SWITCH ACCOUNT</Button>
                </Stack>
            </ModalDialog>
        </Modal>
    )
}