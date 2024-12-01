import {Box, Button, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

export default function PaymentFailed(){
    const navigate = useNavigate()
    const {t} = useTranslation('common')

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#295457',
                padding: '20px',
                textAlign: 'center',
            }}
        >
            <Box sx={{ marginBottom: '5rem' }}>
                <Link to={'/'} className={'nav-logo'} style={{fontSize: '3rem'}}>
                    Medicare<span style={{ color: 'orangered' }}>Plus</span>
                </Link>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    padding: '30px',
                    maxWidth: '600px',
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#36007B',
                    textAlign: 'center',
                    borderRadius: '12px',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    {t('payment.cancel.title').toUpperCase()}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    {t('payment.cancel.description')}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#36007B',
                        color: '#ffffff',
                        '&:hover': { backgroundColor: '#4a1093' },
                    }}
                    onClick={() => navigate('/')}
                >
                    {t('payment.cancel.button')}
                </Button>
            </Paper>
        </Box>
    )
}