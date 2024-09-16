import {Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import SelectBasic from "./CustomSelect.jsx";

export default function TableTemplate({header, data, isPagination}){
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#36007B'}}>
                            {header.map((item, index) =>
                                <TableCell sx={{color: 'white'}} key={index}>{item}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow sx={{
                                '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                            }} key={index}>
                                {Object.keys(row).map((key, index) => (
                                    <TableCell key={index}>{row[key]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isPagination &&
                <div style={{
                    alignSelf: 'center',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <Pagination showFirstButton showLastButton size={'large'} count={100} color="primary"/>
                    <Stack direction={'row'} spacing={1} alignItems={'center'} style={{position: 'absolute', right: 0}}>
                        <p>Row per page</p>
                        <SelectBasic/>
                    </Stack>
                </div>
            }
        </>
    )
}