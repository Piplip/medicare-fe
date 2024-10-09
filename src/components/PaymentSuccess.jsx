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

export default function PaymentSuccess(){
    const [open, setOpen] = useState(false)
    const [feedbackData, setFeedbackData] = useState({rating: 0, content: ''})

    function showFeedbackDialog(rating){
        setFeedbackData({...feedbackData, rating: rating})
        setOpen(true)
    }

    const ratings = [
        {icon: terribleIcon, text: 'Rât tệ'}, {icon: badIcon, text: 'Tệ'}, {icon: okayIcon, text: 'Bình thường'},
        {icon: goodIcon, text: 'Tốt'}, {icon: amazingIcon, text: 'Rất tốt'}
    ]

    async function submitFeedback(){
        setOpen(false)
        await baseAxios.post(`/feedback?email=${localStorage.getItem('email')}`,
            {
                category: 'scheduling',
                content: feedbackData.content,
                level: ratings[feedbackData.rating]['text'].toLowerCase()
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
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Stack sx={{ maxWidth: 750, backgroundColor: '#F0F4F8', padding: '1rem 3rem', boxShadow: '1rem 1rem darkgray'}} rowGap={'1rem'}>
                    <Stack>
                        <Typography level={'h4'}>Đánh giả chất lượng dịch vụ</Typography>
                        <Typography level={'body-md'}>
                            Bạn có trải nghiệm tốt với dịch vụ của chúng tôi?<br/>Hãy chia sẻ suy nghĩ của bạn!
                        </Typography>
                    </Stack>
                    <div className={'ratings-wrapper'}>
                        {ratings.map((item, index) => {
                            return (
                                <Stack key={index} direction={'column'} alignItems={'center'} onClick={() => setFeedbackData({...feedbackData, rating: index + 1})}
                                       className={`ratings-item ${feedbackData.rating === index + 1 ? 'ratings-item-active' : ''}`}>
                                    <img className={'rating-icon'} src={item.icon} alt={item.text}/>
                                    <Typography level={'body-md'}>{item.text}</Typography>
                                </Stack>
                            )
                        })}
                    </div>
                    <Stack rowGap={0.5}>
                        <Typography level={'h4'}>Nêu suy nghĩ của bạn nhằm cải thiện dịch vụ</Typography>
                        <textarea style={{padding: '0.25rem 0.5rem', fontSize: '1rem', width: '100%', minWidth: '37.5rem'
                            , minHeight: '5rem', maxHeight: '15rem', maxWidth: '100%'}}
                            value={feedbackData.reason} onChange={(e) => setFeedbackData({...feedbackData, content: e.target.value})}
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
                        >GỬI</Button>
                        <Button variant={'contained'} onClick={() => setOpen(false)}
                                sx={{
                                    backgroundColor: 'white', color: 'black',
                                    '&:hover': {
                                        backgroundColor: '#dedede',
                                        opacity: 0.8
                                    }
                                }}
                        >HỦY</Button>
                    </Stack>
                </Stack>
            </Modal>
            <Stack rowGap={1} alignItems={'center'} justifyContent={'center'}>
                <Typography level={'h1'} sx={{color: 'greenyellow'}}>Payment Success</Typography>
                <p>Thank you for your payment!</p>
                <Button sx={{marginTop: 2}} variant={'contained'} color={'success'}
                        onClick={() => window.location.href='/'}>Back to Homepage</Button>
            </Stack>
            <div className={'share-your-thoughts'}>
                <Stack>
                    <Typography level={'h4'}>How is your experience with our service ?</Typography>
                    <Typography level={'body-md'}>Share your thoughts with us!</Typography>
                </Stack>
                <Stack direction={'row'} columnGap={'1rem'}>
                    <img onClick={() => showFeedbackDialog(1)} className={'rating-icon'} src={terribleIcon} alt={'terrible'}/>
                    <img onClick={() => showFeedbackDialog(2)} className={'rating-icon'} src={badIcon} alt={'bad'}/>
                    <img onClick={() => showFeedbackDialog(3)} className={'rating-icon'} src={okayIcon} alt={'okay'}/>
                    <img onClick={() => showFeedbackDialog(4)} className={'rating-icon'} src={goodIcon} alt={'good'}/>
                    <img onClick={() => showFeedbackDialog(5)} className={'rating-icon'} src={amazingIcon} alt={'amazing'}/>
                </Stack>
            </div>
        </div>
    )
}