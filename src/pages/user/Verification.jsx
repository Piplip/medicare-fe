import {Button, CircularProgress, Stack} from "@mui/material";
import '../../styles/verification-styles.css'
import {useLocation} from "react-router";
import baseAxios from "../../config/axiosConfig.jsx";
import {useState} from "react";
import Typography from "@mui/joy/Typography";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../config/FirebaseConfig.jsx";
import { getStorage, ref, getDownloadURL, uploadBytes} from "firebase/storage";
import {useTranslation} from "react-i18next";

export default function Verification(){
    initializeApp(firebaseConfig);
    const storage = getStorage()
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isScanning, setIsScanning] = useState(false)
    const {t} = useTranslation('common')

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

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (file.size > 1024 * 1024) {
            alert('File size exceeds the maximum limit (1MB).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
    }

    async function sendAuthenticateRequest(){
        if(!selectedFile){
            alert('Please select an image to authenticate')
        }
        else{
            setIsScanning(true)
            const storageRef = ref(storage, `/cccd/${selectedFile.name}`)
            const uploadTask = await uploadBytes(storageRef, selectedFile)
            const downloadURL = await getDownloadURL(uploadTask.ref);

            const encodedURL = encodeURIComponent(downloadURL);
            const targetURL = `/check-identity?accountID=${path.search.substring(11)}&url=${encodedURL}`
            baseAxios.post(targetURL)
                .then(async r => {
                    await setIsScanning(false)
                    alert(`${r.data}\nYou will be automatically redirected to login page.`)
                    window.location.href = '/login'
                })
                .catch(e => console.log(e))
        }
    }

    return (
        <div className={'verification-wrapper'}>
            {path.pathname === "/verify/success" ?
                <Stack rowGap={1} alignItems={'center'}>
                    <p style={{fontSize: '3rem', color: 'yellow', marginBlock: '0.5rem'}}>Medicare<span style={{color: 'orangered'}}>Plus</span></p>
                    <>
                        <h1 style={{color: 'lightgreen'}}>{t('verification.success.title')}</h1>
                        <Typography level={'h4'} color={'white'}>
                            {t('verification.success.message')}
                        </Typography>
                        <Typography level={'body-md'} color={'white'}>
                            {t('verification.success.guarantee')}
                        </Typography>
                        {/*<p style={{color: 'white'}}>You can now close this page or head to <Link style={{color: 'yellow'}} to={'/login'}>login page.</Link></p>*/}
                        <div className={'image-receiver'}>
                            <div>
                                <input className={'image-file-select'} type={"file"} onChange={handleFileSelect}/>
                                {response.type === 'success' &&
                                    <p>{t('verification.success.title')}</p>
                                }
                            </div>
                            <div className={'image-shower'}>
                                {isScanning &&
                                    <div className={'image-shower is-scanning'}>
                                        {isScanning ?
                                            <p className={'twinkling-scanning'}>Authenticating! Please wait</p> :
                                            <Typography level={'h1'} sx={{color: 'greenyellow'}}>SUCCESS</Typography>
                                        }
                                    </div>
                                }
                                {previewUrl ?
                                    <img src={previewUrl} alt={'preview'} className={'image-preview'}/>
                                    : <p>{t('verification.success.appear-image')}</p>
                                }
                            </div>
                        </div>
                        <Button sx={{width: 'fit-content', marginTop: 1}} variant={'contained'} disabled={isScanning}
                                onClick={sendAuthenticateRequest}>
                            {t('verification.success.button')}
                        </Button>
                    </>
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