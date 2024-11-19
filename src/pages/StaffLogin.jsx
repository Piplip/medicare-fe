import {Button, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from '@mui/icons-material/Lock';
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Form, Link} from "react-router-dom";
import {Formik} from "formik";
import * as Yup from "yup";
import baseAxios from "../config/axiosConfig.jsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

export default function StaffLogin(){
    const [showPassword, setShowPassword] = useState(false)
    const [awaitResponse, setAwaitResponse] = useState(false)
    const [disabledSend, setDisabledSend] = useState(false)
    const [showSuccessLogin, setShowSuccessLogin] = useState(false)
    const navigate = useNavigate()

    const {t} = useTranslation('common')

    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email(t("login.error.email.invalid"))
            .required(t("login.error.email.missing")),

        password: Yup.string()
            .min(8, t("login.error.password.too-short"))
            .max(100, t("login.error.password.too-long"))
            .required(t("login.error.password.missing")),
    });

    function sendLoginRequest(data){
        baseAxios.post('/staff/login', {
            email: data.email,
            password: data.password,
        }).then(async res => {
            localStorage.setItem('firstName', res.data.firstName)
            localStorage.setItem('lastName', res.data.lastName)
            localStorage.setItem('email', res.data.email)
            localStorage.setItem('imageURL', res.data.imageURL)
            localStorage.setItem('userID', res.data.userID)

            let redirectURL
            switch (res.data.accountRole){
                case 'DOCTOR':
                    redirectURL = '/physician/dashboard'
                    break
                case 'ADMIN':
                    redirectURL = '/admin/users'
                    break
                case 'PHARMACIST':
                    redirectURL = '/pharmacist/dashboard'
                    break
            }

            setShowSuccessLogin(true)
            setAwaitResponse(false)

            setTimeout(() => navigate(redirectURL), 2000)
        }).catch(err => {
            setAwaitResponse(false)
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }

    return (
        <div className={'login-wrapper'} style={{height: '100%', backgroundColor: '#295457'}}>
            <div className={'login-form'}>
                <Stack rowGap={'1rem'}>
                    <Typography variant={'h4'} marginBottom={3}>
                        {t('login.login-title')}
                    </Typography>
                    <Formik
                        initialValues={{email: '', password: '', confirm: ''}}
                        validationSchema={signUpSchema}
                        onSubmit={async (values) => {
                            setAwaitResponse(true)
                            await (sendLoginRequest(values))
                            setDisabledSend(true)
                            setTimeout(() => setDisabledSend(false), 5000)
                        }}
                    >
                        {({
                              values, errors, touched,
                              handleChange, handleBlur,
                              handleSubmit
                          }) => (
                            <Form style={{
                                width: '100%',
                                display: 'flex',
                                rowGap: '0.25rem',
                                flexDirection: 'column',
                                height: 'fit-content'
                            }}
                                  onSubmit={handleSubmit}
                            >
                                <TextField placeholder={t('login.placeholder.email')} name={'email'}
                                           onChange={handleChange} onBlur={handleBlur} value={values.email}
                                           error={touched.email && Boolean(errors.email)}
                                           helperText={touched.email && errors.email}
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start"><EmailIcon/></InputAdornment>),
                                           }} variant="outlined"/>
                                <TextField placeholder={t('login.placeholder.password')}
                                           type={showPassword ? 'text' : 'password'}
                                           name={'password'} onChange={handleChange} onBlur={handleBlur}
                                           value={values.password}
                                           error={touched.password && Boolean(errors.password)}
                                           helperText={touched.password && errors.password}
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start"><LockIcon/></InputAdornment>),
                                               endAdornment: (<InputAdornment position="end">
                                                   <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                       {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                   </IconButton>
                                               </InputAdornment>),
                                           }}
                                           variant="outlined"/>
                                <Button variant={'contained'} type={'submit'} disabled={disabledSend}
                                        sx={{
                                            backgroundColor: '#295457', marginBlock: '1rem',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#1b3c3f'
                                            }
                                        }}
                                >
                                    {awaitResponse ? <div
                                        className={'loader'}></div> : t('login.login-title')}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Stack>
                <Link to={'/forgot-password'}
                      style={{textDecoration: 'none', width: 'fit-content', alignSelf: 'center'}}>
                    <Typography variant={'body2'}>
                        {t('login.forgot-pass')}
                    </Typography>
                </Link>
                {showSuccessLogin &&
                    <div className={'success-login'}>
                        Login successfully! Redirecting to homepage....
                    </div>
                }
            </div>
        </div>
    )
}