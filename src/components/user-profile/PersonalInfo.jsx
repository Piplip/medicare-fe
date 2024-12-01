import Typography from "@mui/joy/Typography";
import {
    Alert,
    Button, CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import {useContext, useEffect, useRef, useState} from "react";
import {useLoaderData} from "react-router";
import MailIcon from '@mui/icons-material/Mail';
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {Modal, ModalClose, ModalDialog} from "@mui/joy";
import {Form} from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Formik} from "formik";
import * as Yup from "yup";
import baseAxios from "../../config/axiosConfig.jsx";
import {UserProfileContext} from "../../App.jsx";
import Input from "@mui/material/Input";

export default function PersonalInfo() {
    const loaderData = useLoaderData()
    const {t} = useTranslation('common')
    const [changePassword, setChangePassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [otpReceive, setOTPReceive] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [invalidOTP, setInvalidOTP] = useState(false)
    const newPass = useRef('')
    const {isModify, phoneNumber, setPhoneNumber, phoneRef} = useContext(UserProfileContext)

    const changePassSchema = Yup.object().shape({
        oldPass: Yup.string()
            .min(8, t("login.error.password.too-short"))
            .max(30, t("login.error.password.too-long"))
            .required(t("Missing current password")),
        newPass: Yup.string()
            .min(8, t("login.error.password.too-short"))
            .max(30, t("login.error.password.too-long"))
            .required(t("Missing new password")),
        confirmPass: Yup.string()
            .min(8, t("login.error.password.too-short"))
            .max(30, t("login.error.password.too-long"))
            .oneOf([Yup.ref('newPass'), null], t("New password mismatch"))
            .required(t("Missing confirm new password")),
    })

    const otpRefs = useRef([]);
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));

    const handleInputChange = (index, value) => {
        if(invalidOTP) setInvalidOTP(false)
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        if (value.length === 1 && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1].focus();
        }

        if ((value.length === 0 && index > 0)) {
            otpRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        setPhoneNumber([loaderData.data[3] ? loaderData.data[3] : "", loaderData.data[4] ? loaderData.data[4] : ""])
        phoneRef.current = [loaderData.data[3] ? loaderData.data[3] : "", loaderData.data[4] ? loaderData.data[4] : ""]
    }, []);

    function resetState(){
        setOtpValues(Array(6).fill(''))
        setInvalidOTP(false)
        setOTPReceive(false)
    }

    function sendOTP(){
        setIsLoading(true)
        baseAxios.post('/change-password/verify?' + new URLSearchParams({email: loaderData.data[9], OTP: otpValues.join(''), "newPass": newPass.current}))
            .then(r => {
                if(r.data === 'OK') {
                    resetState()
                    setIsLoading(false)
                    setChangePassword(false)
                    alert(t('user_profile.change-password.success'))
                }
            })
            .catch(() => {
                setIsLoading(false)
                setInvalidOTP(true)
            })
    }

    return (
        <>
            {changePassword &&
                <Modal open={changePassword} onClose={(_, reason) => {
                    if(reason === 'closeClick') {
                        resetState()
                        setIsLoading(false)
                        setChangePassword(false)
                    }
                }}>
                    <ModalDialog>
                        <ModalClose />
                        <Typography level={'h4'}>{t('user_profile.change-password.title').toUpperCase()}</Typography>
                        {otpReceive ?
                            <Stack rowGap={2}>
                                <Typography level={'body-lg'} sx={{maxWidth: '35rem'}}>
                                    {t('user_profile.change-password.otp-guide')}
                                </Typography>
                                {invalidOTP && <Alert variant="filled" severity="error">{t('user_profile.change-password.invalid-otp')}</Alert>}
                                <Stack direction={'row'} columnGap={1}>
                                    {Array(6).fill(null).map((_, index) => (
                                        <input
                                            autoFocus={index === 0}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            key={index}
                                            type="text"
                                            placeholder="0"
                                            maxLength={1}
                                            className={"otp-input"}
                                            value={otpValues[index]}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                        />
                                    ))}
                                </Stack>
                                <Button variant={'contained'} onClick={sendOTP}>
                                    {isLoading ? <CircularProgress color={'success'}/>
                                        : t('user_profile.change-password.btn.confirm')
                                    }
                                </Button>
                            </Stack>
                            :
                            <Formik
                                initialValues={{ oldPass: '', newPass: '', confirmPass: ''}}
                                validationSchema={changePassSchema}
                                onSubmit={async (values) => {
                                    setIsLoading(true)
                                    newPass.current = values['newPass']
                                    baseAxios.post('/change-password/make?' + new URLSearchParams({email: loaderData.data[9], oldPass: values.oldPass}))
                                        .then(r => {
                                            setIsLoading(false)
                                            if(r.data === 'OK')
                                                setOTPReceive(true)
                                        })
                                        .catch(err => {
                                            setIsLoading(false)
                                            alert(err.response.data)
                                        })
                                }}
                            >
                                {({
                                      values, errors, touched,
                                      handleChange, handleBlur,
                                      handleSubmit
                                  }) => (
                                    <Form onSubmit={handleSubmit}
                                          style={{width: '100%', display: 'flex', rowGap: '1rem', flexDirection: 'column', height: 'fit-content'}}
                                    >
                                        {['oldPass', 'newPass', 'confirmPass'].map((item, index) =>
                                            <TextField key={index} placeholder={index === 0 ? t('login.placeholder.current-pass') : index === 1
                                                ? t('login.placeholder.new-pass') : t('login.placeholder.confirm-new-pass')}
                                                       type={showPassword ? 'text' : 'password'} name={item} onChange={handleChange} onBlur={handleBlur} value={values[item]}
                                                       error={touched[item] && Boolean(errors[item])}
                                                       helperText={touched[item] && errors[item]}
                                                       InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                                           endAdornment: (<InputAdornment position="end">
                                                               <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                                   {showPassword ? <VisibilityOff /> : <Visibility />}
                                                               </IconButton>
                                                           </InputAdornment>),}}
                                                       variant={'outlined'} sx={{width: '30rem'}}/>
                                        )}
                                        <Button type={'submit'} variant={'contained'}>
                                            {isLoading ? <CircularProgress color={'success'}/>
                                                : t('user_profile.change-password.btn.change')
                                            }
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        }
                    </ModalDialog>
                </Modal>
            }
            <div className={'personal-info-wrapper'}>
                <Typography color={'white'} level={'h2'}>{t('user_profile.personal-info.title')}</Typography>
                <Typography level={'body-sm'} color={'gray'}>{t('user_profile.personal-info.description')}</Typography>
                <div className={'personal-info-main'}>
                    <div className={'personal-info-comp'}>
                        <Stack>
                            <Typography color={'white'}
                                        level={'h4'}>{t('user_profile.personal-info.full_name')}</Typography>
                            <Typography color={'white'} level={'body1'}>
                                {loaderData.data[1] + " " + loaderData.data[0]}
                            </Typography>
                        </Stack>
                        <PersonIcon/>
                    </div>
                    <div className={'personal-info-comp'}>
                        <Stack>
                            <Typography color={'white'}
                                        level={'h4'}>{t('user_profile.personal-info.birthday')}</Typography>
                            <Typography color={'white'}
                                        level={'body1'}>{dayjs(loaderData.data[2]).format("DD-MM-YYYY")}</Typography>
                        </Stack>
                        <CalendarMonthIcon/>
                    </div>
                    <div className={'personal-info-comp'}>
                        <Stack>
                            <Typography color={'white'}
                                        level={'h4'}>{t('user_profile.personal-info.address')}</Typography>
                            <Typography color={'white'} level={'body1'}>
                                {`${loaderData.data[5] ? loaderData.data[5] + ', ' : ''}` + `${loaderData.data[6] ? loaderData.data[6] + ', ' : ''}`
                                    + `${loaderData.data[7] ? loaderData.data[7] + ', ' : ''}` + `${loaderData.data[8] ? loaderData.data[8] : ''}`}
                            </Typography>
                        </Stack>
                        <HomeIcon/>
                    </div>
                    <div className={'personal-info-comp personal-phone'}>
                        <Stack>
                            <Typography color={'white'}
                                        level={'h4'}>{t('user_profile.personal-info.phone')}</Typography>
                            {isModify ?
                                <TextField value={phoneNumber[0]} autoFocus error={phoneNumber[0] !== null && !/^\d{10}$/.test(phoneNumber[0])}
                                       variant={'standard'}
                                           helperText={phoneNumber[0] && !/^\d{10}$/.test(phoneNumber[0]) ? t('user_profile.personal-info.phone-error') : ''}
                                    onChange={(e) => setPhoneNumber(prev => [e.target.value, prev[1]])}
                                />
                                :
                                <Typography color={'white'} level={'body1'}>
                                    {phoneNumber[0] ? phoneNumber[0] : `${t('user_profile.personal-info.empty')}`}
                                </Typography>

                            }
                        </Stack>
                        <PhoneIcon/>
                    </div>
                    <div className={'personal-info-comp'}>
                        <Stack>
                            <Typography color={'white'}
                                        level={'h4'}>{t('user_profile.personal-info.email')}</Typography>
                            <Typography color={'white'} level={'body1'}>
                                {loaderData.data[9]}
                            </Typography>
                        </Stack>
                        <MailIcon/>
                    </div>
                    <div className={'personal-info-comp personal-phone'}>
                        <Stack>
                            <Typography color={'white'}
                                        level={'h4'}>{t('user_profile.personal-info.sec_phone')}</Typography>
                            {isModify ?
                                <TextField value={phoneNumber[1]} error={phoneNumber[1] !== null && !/^\d{10}$/.test(phoneNumber[1])}
                                           variant={'standard'}
                                           helperText={phoneNumber[1] && !/^\d{10}$/.test(phoneNumber[1]) ? t('user_profile.personal-info.phone-error') : ''}
                                       onChange={(e) => setPhoneNumber(prev => [prev[0], e.target.value])}
                                />
                                :
                                <Typography color={'white'} level={'body1'}>
                                    {phoneNumber[1] ? phoneNumber[1] : `${t('user_profile.personal-info.empty')}`}
                                </Typography>
                            }
                        </Stack>
                        <PhoneIcon/>
                    </div>
                </div>
                <Typography className={'change-password'} sx={{color: 'yellow', width: 'fit-content', alignSelf: 'end'}} onClick={() => setChangePassword(true)}
                            level={'body-sm'}>{t('user_profile.change-pass')}</Typography>
            </div>
        </>
    )
}