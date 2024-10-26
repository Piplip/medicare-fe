import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import {useState} from "react";
import {useLoaderData} from "react-router";
import MailIcon from '@mui/icons-material/Mail';
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

export default function PersonalInfo() {
    const loaderData = useLoaderData()
    const [isModify, setIsModify] = useState(false)
    const {t} = useTranslation('common')

    console.log(loaderData)

    return (
        <div className={'personal-info-wrapper'}>
            <Typography color={'white'} level={'h2'}>{t('user_profile.personal-info.title')}</Typography>
            <Typography level={'body-sm'} color={'gray'}>{t('user_profile.personal-info.description')}</Typography>
            <div className={'personal-info-main'}>
                <div className={'personal-info-comp'} onDoubleClickCapture={() => setIsModify(true)}>
                    <Stack>
                        <Typography color={'white'}
                                    level={'h4'}>{t('user_profile.personal-info.full_name')}</Typography>
                        {
                            isModify ?
                                <input className={'personal-info-input'} type={'text'} placeholder={'Full Name'}
                                       autoFocus value={loaderData.data[1] + " " + loaderData.data[0]}
                                       onKeyDown={(e) => {
                                           if (e.key === 'Enter') setIsModify(false)
                                       }}/>
                                : <Typography color={'white'} level={'body1'}>
                                    {loaderData.data[1] + " " + loaderData.data[0]}
                                </Typography>
                        }
                    </Stack>
                    <PersonIcon/>
                </div>
                <div className={'personal-info-comp'}>
                    <Stack>
                        <Typography color={'white'} level={'h4'}>{t('user_profile.personal-info.birthday')}</Typography>
                        <Typography color={'white'}
                                    level={'body1'}>{dayjs(loaderData.data[2]).format("DD-MM-YYYY")}</Typography>
                    </Stack>
                    <CalendarMonthIcon/>
                </div>
                <div className={'personal-info-comp'}>
                    <Stack>
                        <Typography color={'white'} level={'h4'}>{t('user_profile.personal-info.address')}</Typography>
                        <Typography color={'white'} level={'body1'}>
                            {`${loaderData.data[4] ? loaderData.data[4] + ', ' : ''}` + `${loaderData.data[5] ? loaderData.data[5] + ', ' : ''}`
                                + `${loaderData.data[6] ? loaderData.data[6] + ', ' : ''}` + `${loaderData.data[7] ? loaderData.data[7] : ''}`}
                        </Typography>
                    </Stack>
                    <HomeIcon/>
                </div>
                <div className={'personal-info-comp'}>
                    <Stack>
                        <Typography color={'white'} level={'h4'}>{t('user_profile.personal-info.phone')}</Typography>
                        <Typography color={'white'} level={'body1'}>
                            {loaderData.data[3] ? loaderData.data[3] : `${t('user_profile.personal-info.empty')}`}
                        </Typography>
                    </Stack>
                    <PhoneIcon/>
                </div>
                <div className={'personal-info-comp'}>
                    <Stack>
                        <Typography color={'white'} level={'h4'}>{t('user_profile.personal-info.email')}</Typography>
                        <Typography color={'white'} level={'body1'}>
                            {loaderData.data[8]}
                        </Typography>
                    </Stack>
                    <MailIcon/>
                </div>
                <div className={'personal-info-comp'}>
                    <Stack>
                        <Typography color={'white'}
                                    level={'h4'}>{t('user_profile.personal-info.sec_phone')}</Typography>
                        <Typography color={'white'} level={'body1'}>
                            {loaderData.data[4] ? loaderData.data[4] : `${t('user_profile.personal-info.empty')}`}
                        </Typography>
                    </Stack>
                    <PhoneIcon/>
                </div>
            </div>
            <Typography className={'change-password'} sx={{color: 'yellow'}}
                        level={'body-sm'}>{t('user_profile.change-pass')}</Typography>
        </div>
    )
}