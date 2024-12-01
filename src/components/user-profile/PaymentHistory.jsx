import Typography from "@mui/joy/Typography";
import {useLoaderData} from "react-router";
import {
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import baseAxios from "../../config/axiosConfig.jsx";

export default function PaymentHistory(){
    const [data, setData] = useState(JSON.parse(useLoaderData()?.data[1]).records || [])
    const totalPage = useLoaderData()?.data[0] || 1
    const [currentPage, setCurrentPage] = useState(1)
    const {t} = useTranslation('common')

    const header = ['transaction_id', 'payment_date', 'payment_amount', 'payment_method', 'transaction_status']

    const statusStyle = {
        'COMPLETED': 'green',
        'PENDING': 'blue',
        'FAILED': 'black'
    }

    useEffect(() => {
        baseAxios.get('/payment/payment-history?email=' + localStorage.getItem('email') + '&page=' + currentPage)
            .then(r => {
                setData(JSON.parse(r.data[1]).records)
            })
    }, [currentPage]);

    return (
        <Stack className={'billing-wrapper'} rowGap={1.5}>
            <Typography color={'white'} level={'h2'}>{t('user_profile.payment.title')}</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#36007B'}}>
                            {header.map((item, index) =>
                                <TableCell sx={{color: 'white'}} key={index}>{t(`table.${item}`)}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data &&
                            data.map((item, index) => (
                                <TableRow sx={{
                                    '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                    '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                }} key={index}>
                                    <TableCell>{item[0]}</TableCell>
                                    <TableCell>{dayjs(item[2]).format("HH:mm DD/MM/YYYY")}</TableCell>
                                    <TableCell>{parseInt(item[3], 10) * 1000}đ</TableCell>
                                    <TableCell>{item[5]}</TableCell>
                                    <TableCell>
                                        <p className={'payment-status'} style={{backgroundColor: statusStyle[item[1]]}}>
                                            {t(`status.${item[1]}`).toUpperCase()}
                                        </p>
                                        {item[1] === 'PENDING' &&
                                            <button className={'pending-pay-btn'}
                                                onClick={() => {
                                                    window.location.href = item[4]
                                                }}
                                            >{t('user_profile.pay-now')}</button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {data && data.length == 0 &&
                    <div className={'empty-table'}>
                        {t('user_profile.payment.no-payment')}
                    </div>
                }
                {totalPage != 0 &&
                    <Stack alignSelf={'center'} marginTop={1} direction={'row'} justifyContent={'center'} columnGap={2}
                           sx={{backgroundColor: 'white', paddingBlock: '.25rem'}}
                    >
                        <Pagination count={parseInt(totalPage, 10)} color={'primary'} page={currentPage}
                            onChange={(_, page) => setCurrentPage(page)}
                        />
                    </Stack>
                }
            </TableContainer>
        </Stack>
    )
}