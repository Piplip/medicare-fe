import {useLoaderData} from "react-router";
import Typography from "@mui/joy/Typography";
import {Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import dayjs from "dayjs";

export default function UserFeedback(){
    const data = useLoaderData().data
    console.log(data)

    const header = ['ID', 'Feedback Type', 'Content', 'Rating', 'Date']

    return (
        <Stack rowGap={1.25}>
            <Typography color={'white'} level={'h2'}>Feedback</Typography>
            <div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                {header.map((item, index) =>
                                    <TableCell sx={{color: 'white'}} key={index}>{item}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.records.map((item, index) => (
                                <Tooltip title={"Click to view detail"} key={index} followCursor>
                                    <TableRow sx={{
                                        '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                        '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                    }}>
                                        <TableCell>{item[0]}</TableCell>
                                        <TableCell>{item[1].toUpperCase()}</TableCell>
                                        <TableCell>{item[2] || "------------------"}</TableCell>
                                        <TableCell>{item[3] ? item[3].toUpperCase() : "------------------"}</TableCell>
                                        <TableCell>{dayjs(item[4]).format("HH:ss DD-MM-YYYY")}</TableCell>
                                    </TableRow>
                                </Tooltip>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Stack>
    )
}