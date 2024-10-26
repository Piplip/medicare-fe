import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function SimpleTableTemplate({header, data, keys}) {
    const {t} = useTranslation('common')
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#36007B'}}>
                            {header.map((item, index) => (
                                <TableCell sx={{color: 'white', userSelect: 'none'}}
                                           key={index}>{t(`table.${item}`)}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {data.length > 0 &&
                        <TableBody>
                            {
                                data.map((item, index) => (
                                    <TableRow key={index} sx={{
                                        '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                        '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                    }}>
                                        {keys.map((key, index) => (
                                            (item[key] !== null && item[key] !== undefined) ?
                                                <TableCell key={index}>{item[key] ||
                                                    <p style={{color: 'red'}}>-----X-----</p>
                                                }</TableCell> :
                                                <TableCell key={index}></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    }
                </Table>
            </TableContainer>
            {
                data.length === 0 &&
                <Stack sx={{height: '200px', width: '100%', backgroundColor: '#dadada', fontSize: '3rem'}}
                       justifyContent={'center'} textAlign={'center'}>
                    EMPTY
                </Stack>
            }
        </>
    )
}