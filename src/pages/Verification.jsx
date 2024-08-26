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
    }

    const path = useLocation();
    const [isWaiting, setIsWaiting] = useState(false)
    const [response, setResponse] = useState({
        content: convertErrorToMessage(path.search.substring(7)),
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

    function sendRenewTokenRequest(){
        setIsWaiting(true)
        baseAxios.post('/token/renew?account=' + path.search.charAt(path.search.length - 1))
            .then(res => {
                console.log(res)
                setResponse({
                    content: res.data,
                    type: 'success'
                })
            })
            .catch(err => {
                console.log(err)
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
                    <p style={{fontSize: '4rem', color: 'orange', marginBlock: '4rem'}}>MedicarePlus</p>
                    <h1 style={{color: 'lightgreen'}}>VERIFIED SUCCESSFULLY</h1>
                    <p style={{color: 'white'}}>You can now close this page or head to <Link style={{color: 'yellow'}} to={'/login'}>login page.</Link></p>
                </Stack>
                :
                <Stack rowGap={1} alignItems={'center'}>
                    <p style={{fontSize: '4rem', color: 'orange', marginBlock: '4rem'}}>MedicarePlus</p>
                    {response.content ?
                        <p style={{color: response.type === 'success' ? 'greenyellow' : 'red'}}>
                            {response.content}
                        </p> :
                        <Stack rowGap={'1rem'} alignItems={'center'}>
                            <h1 style={{color: 'red'}}>VERIFICATION FAILED</h1>
                            <p style={{color: 'white'}}>Invalid token or token is expired. Click the button below to generate new token</p>
                            <Button sx={{width: 'fit-content'}} variant="contained"
                                    onClick={sendRenewTokenRequest}
                            >
                                {isWaiting ? <CircularProgress sx={{color: 'red', marginInline: '2rem'}} size={'1.5rem'}/> : "GENERATE"}
                            </Button>
                        </Stack>
                    }
                </Stack>
            }
        </div>
    )
}