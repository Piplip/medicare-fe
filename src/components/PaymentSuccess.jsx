import {Modal, Stack, Typography} from "@mui/joy";
import {Button} from "@mui/material";
import '../styles/payment-success-style.css'
import terribleIcon from '../assets/terrible.png'
import badIcon from '../assets/bad.png'
import okayIcon from '../assets/okay.png'
import goodIcon from '../assets/good.png'
import amazingIcon from '../assets/amazing.png'
import {useState} from "react";
import baseAxios from "../config/axiosConfig.jsx";
import {Trans, useTranslation} from "react-i18next";

export default function PaymentSuccess() {
    const {t} = useTranslation('common')
    const [open, setOpen] = useState(false)
    const [feedbackData, setFeedbackData] = useState({rating: 0, content: ''})

    function showFeedbackDialog(rating) {
        setFeedbackData({...feedbackData, rating: rating})
        setOpen(true)
    }

    const ratings = [
        {icon: terribleIcon, text: 'terrible'}, {icon: badIcon, text: 'bad'}
        , {icon: okayIcon, text: 'okay'},
        {icon: goodIcon, text: 'good'}, {icon: amazingIcon, text: 'amazing'}
    ]

    async function submitFeedback() {
        setOpen(false)
        await baseAxios.post(`/feedback?email=${localStorage.getItem('email')}`,
            {
                category: 'scheduling',
                content: feedbackData.content,
                level: ratings[feedbackData.rating - 1].text.toLowerCase()
            })
            .then(r => console.log(r))
            .catch(err => console.log(err))
        alert("Thank you for your feedback!")
    }

    console.log(feedbackData)

    return (
        <div className={'payment-success'}>
            <Modal aria-labelledby="modal-title" aria-describedby="modal-desc"
                   open={open}
                   sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Stack sx={{
                    maxWidth: 750,
                    backgroundColor: '#F0F4F8',
                    padding: '1rem 3rem',
                    boxShadow: '1rem 1rem darkgray'
                }} rowGap={'1rem'}>
                    <Stack>
                        <Typography level={'h4'}>{t('feedback.appointment.title-1')}</Typography>
                        <Typography level={'body-md'}>
                            <Trans i18nKey={'feedback.appointment.title-2'}/>
                        </Typography>
                    </Stack>
                    <div className={'ratings-wrapper'}>
                        {ratings.map((item, index) => {
                            return (
                                <Stack key={index} direction={'column'} alignItems={'center'}
                                       onClick={() => setFeedbackData({...feedbackData, rating: index + 1})}
                                       className={`ratings-item ${feedbackData.rating === index + 1 ? 'ratings-item-active' : ''}`}>
                                    <img className={'rating-icon'} src={item.icon} alt={item.text}/>
                                    <Typography level={'body-md'}>
                                        {t(`feedback.appointment.rating-level.${item.text}`)}
                                    </Typography>
                                </Stack>
                            )
                        })}
                    </div>
                    <Stack rowGap={0.5}>
                        <Typography level={'h4'}>
                            <Trans i18nKey={feedbackData.rating < 3 ?
                                t('feedback.appointment.negative') :
                                t('feedback.appointment.positive')}/>
                        </Typography>
                        <textarea style={{
                            padding: '0.25rem 0.5rem', fontSize: '1rem', width: '100%', minWidth: '37.5rem'
                            , minHeight: '15rem', maxHeight: '20rem', maxWidth: '100%'
                        }}
                                  value={feedbackData.reason}
                                  onChange={(e) => setFeedbackData({...feedbackData, content: e.target.value})}
                        />
                    </Stack>
                    <Stack alignSelf={'flex-end'} direction={'row'} columnGap={'1rem'}>
                        <Button variant={'contained'} onClick={submitFeedback}
                                sx={{
                                    backgroundColor: '#c567ff', color: 'black',
                                    '&:hover': {
                                        backgroundColor: '#a81bff',
                                    }
                                }}
                        >{t('feedback.button.send')}</Button>
                        <Button variant={'contained'} onClick={() => setOpen(false)}
                                sx={{
                                    backgroundColor: 'white', color: 'black',
                                    '&:hover': {
                                        backgroundColor: '#dedede',
                                        opacity: 0.8
                                    }
                                }}
                        >{t('feedback.button.cancel')}</Button>
                    </Stack>
                </Stack>
            </Modal>
            <Stack rowGap={1} alignItems={'center'} justifyContent={'center'}>
                <Typography level={'h1'} sx={{color: 'greenyellow'}}>{t('payment.title')}</Typography>
                <p>{t('payment.description')}</p>
                <Button sx={{marginTop: 2}} variant={'contained'} color={'success'}
                        onClick={() => window.location.href = '/'}>{t('payment.button')}</Button>
            </Stack>
            <div className={'share-your-thoughts'}>
                <Stack>
                    <Typography level={'h4'}>{t('feedback.appointment.cta.title')}</Typography>
                    <Typography level={'body-md'}>{t('feedback.appointment.cta.title-2')}</Typography>
                </Stack>
                <Stack direction={'row'} columnGap={'1rem'} alignSelf={'center'}>
                    <img onClick={() => showFeedbackDialog(1)} className={'rating-icon'} src={terribleIcon}
                         alt={'terrible'}/>
                    <img onClick={() => showFeedbackDialog(2)} className={'rating-icon'} src={badIcon} alt={'bad'}/>
                    <img onClick={() => showFeedbackDialog(3)} className={'rating-icon'} src={okayIcon} alt={'okay'}/>
                    <img onClick={() => showFeedbackDialog(4)} className={'rating-icon'} src={goodIcon} alt={'good'}/>
                    <img onClick={() => showFeedbackDialog(5)} className={'rating-icon'} src={amazingIcon}
                         alt={'amazing'}/>
                </Stack>
            </div>
        </div>
    )
}