import React from 'react';
import {Container, Typography, Button, Box, Link} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

export default function ErrorPage() {
    const navigate = useNavigate();
    const {t} = useTranslation('common')

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0a1929',
                color: '#e0f7fa',
                textAlign: 'center',
                padding: 4,
            }}
        >
            <Link to={'/'} className={'nav-logo'} style={{ textDecoration: 'none', fontSize: '2rem', fontWeight: 'bold', color: 'yellow'}}>
                Medicare<span style={{ color: 'orangered' }}>Plus</span>
            </Link>
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 'bold',
                    color: '#64ffda',
                    mb: 2,
                    mt: 3,
                }}
            >
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {t('404.d-1')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#b0bec5' }}>
                {t('404.d-2')}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: '#64ffda',
                        color: '#0a1929',
                        '&:hover': { backgroundColor: '#26c6da' },
                    }}
                    onClick={handleGoHome}
                >
                    {t('404.back-home')}
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    sx={{
                        borderColor: '#64ffda',
                        color: '#64ffda',
                        '&:hover': {
                            borderColor: '#26c6da',
                            color: '#26c6da',
                        },
                    }}
                    onClick={() => navigate('/schedule/none/info')}
                >
                    {t('404.booking')}
                </Button>
            </Box>
        </Container>
    )
}