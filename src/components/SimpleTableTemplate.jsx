import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

export default function SimpleTableTemplate({header, data, keys}){
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#36007B'}}>
                            {header.map((item, index) => (
                                <TableCell sx={{color: 'white', userSelect: 'none'}} key={index}>{item}</TableCell>
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
                                                <TableCell key={index}>{item[key]}</TableCell> :
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
                <Stack sx={{height: '200px', width: '100%', backgroundColor: '#dadada', fontSize: '3rem'}} justifyContent={'center'} textAlign={'center'}>
                    EMPTY
                </Stack>
            }
        </>
    )
}