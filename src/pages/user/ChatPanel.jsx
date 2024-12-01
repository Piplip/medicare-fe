import '../../styles/chat-panel.css'
import CloseIcon from '@mui/icons-material/Close';
import {
    Button, Skeleton,
    Stack,
    TextField, Typography
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import baseAxios from "../../config/axiosConfig.jsx";
import LinearProgress from '@mui/material/LinearProgress';
import {getCookie} from "../../components/Utilities.jsx";
import Cookies from 'js-cookie'
import {useTranslation} from "react-i18next";
import parse from 'html-react-parser';

ChatPanel.propTypes = {
    onClose: PropTypes.func
}

function ChatPanel(props){
    const {t} = useTranslation('common')
    const [chatData, setChatData] = useState([t('chatbot.first-message')])
    const [inp, setInp] = useState('')
    const [blockSend, setBlockSend] = useState(false)
    const [isInit, setIsInit] = useState(true)
    const conversationRef = useRef()
    const sampleQuestions = [t('chatbot.sample-1'), t('chatbot.sample-2'), t('chatbot.sample-3')]

    useEffect(() => {
        if(!getCookie("USER-CHAT-THREAD-ID")){
            baseAxios.post('/chatbot')
                .then(r => {
                    setIsInit(false)
                })
                .catch(err => console.log(err))
        }
    }, []);

    useEffect(() => {
        if(conversationRef.current)
            conversationRef.current.scrollTop = conversationRef.current['scrollHeight']
    }, [chatData, inp]);

    function handleSend(){
        if(inp !== ''){
            const newChatData = [...chatData, inp]
            setChatData([...newChatData, ''])
            setBlockSend(true)
            setInp('')
            baseAxios.get('/chatbot?message=' + inp)
                .then(res => {
                    setChatData([...newChatData, res.data])
                    setBlockSend(false)
                }).catch(err => console.log(err))
        }
    }

    return (
        <Stack className={'chat-panel'}>
            <Stack className={'chat-header'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant={'h6'}>{t('chatbot.title')}</Typography>
                <CloseIcon onClick={() => {
                    props.onClose()
                    Cookies.remove('USER-CHAT-THREAD-ID')
                }}/>
            </Stack>
            {!isInit ?
                <div className={'chat-body'} ref={conversationRef}>
                    <div style={{flexGrow: 1}}></div>
                    {chatData.map((item, index) => {
                        return (
                            <div key={index} style={{
                                alignSelf: index % 2 == 0 ? 'flex-start' : 'flex-end',
                                color: index % 2 == 0 ? '#000' : '#fff',
                                backgroundColor: index % 2 == 0 ? 'white' : '#4eadbd'
                            }} className={'chat-bubble'}>
                                <div>
                                    {item ?
                                        <>
                                            <p className={'chat-bubble-owner'}>{index % 2 == 0 ? t('chatbot.bot-name') : t('chatbot.username')}</p>
                                            <div className={'chat-content'}>{parse(item)}</div>
                                        </>
                                        :
                                        <>
                                            <Skeleton variant={'text'} width={'16rem'}/>
                                            <Skeleton variant={'text'} width={'7.5rem'}/>
                                            <Skeleton variant={'text'} width={'12.5rem'}/>
                                        </>
                                    }
                                </div>
                                {index === 0 &&
                                    <Stack rowGap={.5} fontSize={'.8rem'}>
                                        <p>{t('chatbot.sample-question')}</p>
                                        {sampleQuestions.map((q, i) =>
                                            <p key={i} className={'sample-question'}
                                               onClick={() => setInp(q)}
                                            >{q}</p>
                                        )}
                                    </Stack>
                                }
                            </div>
                        )
                    })}
                </div>
                :
                <div className={'init-panel'} style={{flexGrow: 1}}>
                    <p>{t('chatbot.loading-label')}</p>
                    <LinearProgress sx={{width: '100%', height: '0.5rem'}}/>
                </div>
            }
            <div className={'chat-input-wrapper'}>
                <TextField value={inp} onChange={(e) => setInp(e.target.value)}
                           className={'chat-inp'}
                           onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                   handleSend()
                                   e.preventDefault()
                               }
                           }}
                           placeholder={t('chatbot.input-placeholder')}
                           multiline
                           maxRows={4} autoFocus
                />
                <Button variant={'contained'} className={'send-btn'} onClick={handleSend} disabled={blockSend}>
                    <SendIcon/>
                </Button>
            </div>
        </Stack>
    )
}

export default ChatPanel