import {Button, CircularProgress, Stack} from "@mui/material";
import '../styles/verification-styles.css'
import {useLocation} from "react-router";
import {Link} from "react-router-dom";
import baseAxios from "../config/axiosConfig.jsx";
import {useState} from "react";

export default function Verification(){
    const errorRef = {
        'ERR-1001': 'Account not found',
        'ERR-1002': 'Account already activated',
        'ERR-1003': 'Invalid token or token expired'
    }

    const path = useLocation();
    const [isWaiting, setIsWaiting] = useState(false)
    const [response, setResponse] = useState({
        content: convertErrorToMessage(path.search.substring(7)) || "Token is expired! Please generate new token",
        type: null
    })

    function convertErrorToMessage(error){
        if(errorRef[error]){
            return errorRef[error]
        }
        else{
            return null
        }
    }

    async function sendRenewTokenRequest(){
        await setIsWaiting(true)
        baseAxios.post('/token/renew?account=' + path.search.substring(path.search.length - 3))
            .then(res => {
                console.log(res)
                setIsWaiting(false)
                setResponse({
                    content: res.data,
                    type: 'success'
                })
            })
            .catch(err => {
                console.log(err)
                setIsWaiting(false)
                setResponse({
                    content: err.response.data,
                    type: 'error'
                })
            })
    }

    return (
        <div className={'verification-wrapper'}>
            {path.pathname === "/verify/success" ?
                <Stack rowGap={1}>
                    <p style={{fontSize: '3.5rem', color: 'yellow', marginBlock: '4rem'}}>Medicare<span style={{color: 'orangered'}}>Plus</span></p>
                    <h1 style={{color: 'lightgreen'}}>VERIFIED SUCCESSFULLY</h1>
                    <p style={{color: 'white'}}>You can now close this page or head to <Link style={{color: 'yellow'}} to={'/login'}>login page.</Link></p>
                </Stack>
                :
                <Stack rowGap={1} alignItems={'center'}>
                    <p style={{fontSize: '3.5rem', color: 'yellow', marginBlock: '4rem'}}>Medicare<span
                        style={{color: 'orangered'}}>Plus</span></p>
                    <Stack rowGap={'1rem'} alignItems={'center'}>
                        <h1 style={{color: 'red'}}>VERIFICATION FAILED</h1>
                        <p style={{color: 'white'}}>{response.content}</p>
                        <Button sx={{width: 'fit-content'}} variant="contained" onClick={sendRenewTokenRequest}>
                            {isWaiting ? <CircularProgress sx={{color: 'red', marginInline: '2rem'}} size={'1.5rem'}/> : "GENERATE NEW TOKEN"}
                        </Button>
                    </Stack>
                </Stack>
            }
        </div>
    )
}