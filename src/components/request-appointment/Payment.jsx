import Typography from "@mui/joy/Typography";
import {useOutletContext} from "react-router-dom";
import AppointmentSummary from "./AppointmentSummary.jsx";
import {Button, Stack} from "@mui/material";
import MomoLogo from "../../assets/momo-logo.png"
import NapasLogo from "../../assets/napas-logo.png"
import PayLogo from "../../assets/9pay-logo.png"
import {useTranslation} from "react-i18next";
import baseAxios from "../../config/axiosConfig.jsx";
import VNPay from "../../assets/VNPay.webp"
import {useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";

export default function Payment(){
    const [appointmentData, _] = useOutletContext()
    const {t} = useTranslation('appointmentRequest')
    const payURL = useRef(null);
    const isApiCalled = useRef(false);

    useEffect( () => {
        if (!isApiCalled.current) {
            isApiCalled.current = true;
            baseAxios.get(`payment/vn-pay?appointmentID=${appointmentData.appointmentID}&amount=165000&bankCode=NCB&email=${localStorage.getItem('email')}`)
                .then(r => {
                    payURL.current = r.data;
                })
                .catch(err => console.log(err));
        }
    }, []);

    return (
        <>
            <Typography level={'h1'} sx={{color: 'white'}}>{t('component.payment.title.payment')}</Typography>
            <hr style={{width: '9rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <div>
                <p>{t('component.payment.note')}</p>
            </div>
            <Stack rowGap={'1rem'}>
                <Typography level={'h1'} sx={{color: 'white'}}>{t('component.payment.title.receipt')}</Typography>
                <div style={{display: 'flex', columnGap: '1rem'}}>
                    <AppointmentSummary appointmentData={appointmentData} />
                    <div className={'payment-info-wrapper'}>
                       <div className={'payment-method-fees'}>
                           <Typography level={'h3'} sx={{color: 'yellow'}} textAlign={'center'}
                                   style={{background: 'linear-gradient(to right, transparent, purple, transparent)'}}>
                               {t('component.payment.fees.title')}
                           </Typography>
                           <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                               <Typography level={'body-lg'} sx={{color: 'white'}}>{t('component.payment.fees.doctor_fee')}</Typography>
                               <p>100.000đ</p>
                           </Stack>
                           <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                               <Typography level={'body-lg'} sx={{color: 'white'}}>{t('component.payment.fees.service_fee')}</Typography>
                               <p>50.000đ</p>
                           </Stack>
                           <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                               <Typography level={'body-lg'} sx={{color: 'white'}}>{t('component.payment.fees.tax')}</Typography>
                               <p>+10% * tổng số tiền = 15.000đ</p>
                           </Stack>
                           <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                               <Typography level={'body-lg'} sx={{color: 'white'}}>{t('component.payment.fees.total')}</Typography>
                               <p>165.000đ</p>
                           </Stack>
                       </div>
                        <Stack rowGap={'2rem'}>
                            <Typography level={'h3'} sx={{color: 'yellow'}} textAlign={'center'}
                                        style={{background: 'linear-gradient(to right, transparent, purple, transparent)'}}>
                                {t('component.payment.payment_method.title')}
                            </Typography>
                            <Stack className={'payment-wrapper'} direction={'row'} justifyContent={'space-between'} columnGap={'2rem'}>
                                <Stack className={'payment-method-wrapper'} textAlign={'center'}>
                                    <img className={'payment-method-logo'} src={MomoLogo} alt={'momo-logo'}/>
                                    <p>MOMO</p>
                                </Stack>
                                <Stack className={'payment-method-wrapper'} textAlign={'center'}>
                                    <img className={'payment-method-logo'} src={NapasLogo} alt={'napas-logo'}/>
                                    <p>NAPAS</p>
                                </Stack>
                                <Stack className={'payment-method-wrapper'} textAlign={'center'}>
                                    <img className={'payment-method-logo'} src={PayLogo} alt={'9pay-logo'}/>
                                    <p>9PAY</p>
                                </Stack>
                                <Stack className={'payment-method-wrapper'} textAlign={'center'}
                                    onClick={() => {
                                        if(payURL.current) {
                                            window.location.href = payURL.current
                                        }
                                    }}
                                >
                                    <img className={'payment-method-logo'} src={VNPay} alt={'vnpay-logo'}/>
                                    <p>VNPay</p>
                                </Stack>
                            </Stack>
                            <Stack rowGap={'1rem'}>
                                <p style={{textAlign: 'center'}}>{t('component.payment.payment_method.or')}</p>
                                <Button variant={'contained'} sx={{width: 'fit-content', alignSelf: 'center'}}
                                >{t('component.payment.payment_method.continue_button')}</Button>
                            </Stack>
                        </Stack>
                    </div>
                </div>
            </Stack>
        </>
    )
}