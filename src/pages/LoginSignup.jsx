import '../styles/login-style.css'
import {Button, FormHelperText, IconButton, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from '@mui/icons-material/Lock';
import {useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useLocation} from "react-router";
import {Link} from "react-router-dom";

export default function LoginSignUp(){
    const [showPassword, setShowPassword] = useState(false)
    const isSignUpPage = useLocation().pathname.includes('sign-up')

    return (
        <div className={'login-wrapper'}>
            <div className={'login-form'}>
                <Stack rowGap={'1rem'}>
                    <Typography variant={'h4'} marginBottom={3}>Log In</Typography>
                    <TextField placeholder={'Email'}
                               InputProps={{startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>),}} variant="outlined"/>
                    <TextField placeholder={'Password'} type={showPassword ? 'text' : 'password'}
                               InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                   endAdornment: (<InputAdornment position="end">
                                       <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                           {showPassword ? <VisibilityOff /> : <Visibility />}
                                       </IconButton>
                                   </InputAdornment>),}}
                               variant="outlined"/>
                    {isSignUpPage &&
                        <TextField placeholder={'Confirm Password'} type={showPassword ? 'text' : 'password'}
                                   InputProps={{startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>),
                                       endAdornment: (<InputAdornment position="end">
                                           <IconButton onClick={() => setShowPassword(prev => !prev)}>
                                               {showPassword ? <VisibilityOff /> : <Visibility />}
                                           </IconButton>
                                       </InputAdornment>),}}
                                   variant="outlined"/>
                    }
                    {!isSignUpPage && <FormHelperText>Forgot password ?</FormHelperText>}
                    <Button variant={'contained'}
                            sx={{backgroundColor: '#295457',
                                color: 'white',
                                '&:hover': {backgroundColor: '#1b3c3f'
                                }}}
                    >
                        {isSignUpPage ? 'Sign Up' : 'Log In'}
                    </Button>
                </Stack>
                <Link to={isSignUpPage ? '/login' : '/sign-up'} style={{textDecoration: 'none', width: 'fit-content', alignSelf: 'center'}}>
                    <Typography variant={'body2'}>
                        {isSignUpPage ? 'Have an account ? Login here': 'New User ? Register here'}
                    </Typography>
                </Link>
            </div>
        </div>
    )
}