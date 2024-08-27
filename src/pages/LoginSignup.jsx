import '../styles/login-style.css'
import {Button, FormHelperText, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from '@mui/icons-material/Lock';
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router";
import {Form, Link} from "react-router-dom";
import {Formik} from "formik";
import * as Yup from "yup";
import baseAxios from "../config/axiosConfig.jsx";

export default function LoginSignUp(){
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const isSignUpPage = useLocation().pathname.includes('sign-up')
    const [awaitResponse, setAwaitResponse] = useState(false)
    const [disabledSend, setDisabledSend] = useState(false)
    const [showSuccessLogin, setShowSuccessLogin] = useState(false)

    const signUpSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Missing email'),

        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .max(30, 'Max allowed length is 30 characters')
            .required('Missing password'),

        ...(isSignUpPage ? {
            confirm: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords mismatch')
                .required('Missing confirm password')
        } : {})
    });

    function sendSignUpRequest(data){
        baseAxios.post('/sign-up', {
            email: data.email,
            password: data.password
        }).then(res => {
            setAwaitResponse(false)
            alert(res.data)

        }).catch(err => {
            setAwaitResponse(false)
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }

    function sendLoginRequest(data){
        baseAxios.post('/login', {
            email: data.email,
            password: data.password,
            sessionID: localStorage.getItem('SESSION-ID')
        }).then(res => {
            console.log(res)
            localStorage.setItem('SESSION-ID', res.data.sessionID)
            setAwaitResponse(false)
            setShowSuccessLogin(true)
            setTimeout(() => navigate('/'), 3000)
        }).catch(err => {
            setAwaitResponse(false)
            if(err.status === 400){
                alert(err.response.data)
            }
        })
    }

    return (
        <div className={'login-wrapper'}>
            <div className={'login-form'}>
                <Stack rowGap={'1rem'}>
                    <Typography variant={'h4'} marginBottom={3}>
                        {isSignUpPage ? 'Sign Up' : 'Log In'}
                    </Typography>
                    <Formik
                        initialValues={{ email: '', password: '', confirm: ''}}
                        validationSchema={signUpSchema}
                        onSubmit={async (values) => {
                            setAwaitResponse(true)
                            await (isSignUpPage ? sendSignUpRequest(values) : sendLoginRequest(values))
                            setDisabledSend(true)
                            setTimeout(() => setDisabledSend(false), 5000)
                        }}
                    >
                        {({
                              values, errors, touched,
                              handleChange, handleBlur,
                              handleSubmit
                          }) => (
                            <Form style={{width: '100%', display: 'flex', rowGap: '0.25rem', flexDirection: 'column', height: 'fit-content'}}
                                onSubmit={handleSubmit}
                            >
                                <TextField placeholder={'Enter your email'} name={'email'} onChange={handleChange} onBlur={handleBlur} value={values.email}
                                           error={touched.email && Boolean(errors.email)}
                                           helperText={touched.email && errors.email}
                                           InputProps={{startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>),}} variant="outlined"/>
                                <TextField placeholder={'Password'} type={showPassword ? 'text' : 'password'}
                                           name={'password'} onChange={handleChange} onBlur={handleBlur} value={values.password}
                                           error={touched.password && Boolean(errors.password)}
                                           helperText={touched.password && errors.password}
                                           InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                               endAdornment: (<InputAdornment position="end">
                                                   <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                       {showPassword ? <VisibilityOff /> : <Visibility />}
                                                   </IconButton>
                                               </InputAdornment>),}}
                                           variant="outlined"/>
                                {isSignUpPage &&
                                    <>
                                        <TextField placeholder={'Confirm Password'} type={showPassword ? 'text' : 'password'}
                                                   name={'confirm'} onChange={handleChange} onBlur={handleBlur} value={values.confirm}
                                                   error={touched.confirm && Boolean(errors.confirm)}
                                                   helperText={touched.confirm && errors.confirm}
                                                   InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                                       endAdornment: (<InputAdornment position="end">
                                                           <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                                               {showPassword ? <VisibilityOff /> : <Visibility />}
                                                           </IconButton>
                                                       </InputAdornment>),}}
                                                   variant="outlined"/>
                                    </>
                                }
                                {!isSignUpPage && <FormHelperText>Forgot password ?</FormHelperText>}
                                <Button variant={'contained'} type={'submit'} disabled={disabledSend}
                                        sx={{backgroundColor: '#295457', marginBlock: '1rem',
                                            color: 'white',
                                            '&:hover': {backgroundColor: '#1b3c3f'
                                        }}}
                                >
                                    {awaitResponse ? <div className={'loader'}></div> : isSignUpPage ? 'Sign Up' : 'Log In'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Stack>
                <Link to={isSignUpPage ? '/login' : '/sign-up'} style={{textDecoration: 'none', width: 'fit-content', alignSelf: 'center'}}>
                    <Typography variant={'body2'}>
                        {isSignUpPage ? 'Have an account ? Login here': 'New User ? Register here'}
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

// TODO: Have better display for showing successful account verification
