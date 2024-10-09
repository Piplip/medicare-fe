import "../../styles/admin-home-style.css"
import IosShareIcon from '@mui/icons-material/IosShare';
import InfoIcon from '@mui/icons-material/Info';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import {Gauge, gaugeClasses} from "@mui/x-charts";
import {Button, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";

export default function AdminDashboard(){
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(name, calories, fat, carbs) {
        return { name, calories, fat, carbs};
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24),
        createData('Ice cream sandwich', 237, 9.0, 37),
        createData('Eclair', 262, 16.0, 24),
        createData('Cupcake', 305, 3.7, 67),
        createData('Gingerbread', 356, 16.0, 49),
    ];

    const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
    const xLabels = ['14/06', '15/06', '16/06', '17/06', '18/06', '19/06', '20/06',];

    return (
        <div id={'admin-home'}>
            <section className={'cmd-btn-wrapper'}>
                <Button variant="contained" startIcon={<IosShareIcon />}>SHARE</Button>
                <Button variant="contained" startIcon={<InfoIcon />}>INFO</Button>
            </section>
            <section className={'patient-admission-view-wrapper'}>
                <h2>Patient Admission</h2>
                <div className={'patient-admission-view'}>
                    <div className={'patient-admission-chart'}>
                        <LineChart xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                   series={[{data: [2, 5.5, 2, 8.5, 1.5, 5],},]}
                                    height={250}/>
                        <p className={'chart-description'}>Day</p>
                    </div>
                    <div className={'patient-admission-chart'}>
                        <LineChart xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                   series={[{data: [2, 5.5, 2, 8.5, 1.5, 5],},]}
                                   height={250}/>
                        <p className={'chart-description'}>Week</p>
                    </div>
                    <div className={'patient-admission-chart'}>
                        <LineChart xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                                   series={[{data: [2, 5.5, 2, 8.5, 1.5, 5],},]}
                                   height={250}/>
                        <p className={'chart-description'}>Month</p>
                    </div>
                </div>
            </section>
            <section className={'chart-container-wrapper'}>
                <div>
                    <h1>Bed Status</h1>
                    <BarChart
                        height={300}
                        series={[
                            { data: pData, label: 'pv', id: 'pvId', stack: 'total' },
                            { data: uData, label: 'uv', id: 'uvId', stack: 'total' },
                        ]}
                        xAxis={[{ data: xLabels, scaleType: 'band' }]}
                    />
                </div>
                <div>
                    <h1>System Performance</h1>
                    <Gauge height={300} value={60} startAngle={-90} endAngle={90}
                           sx={{
                               [`& .${gaugeClasses.valueText}`]: {
                                   fontSize: '3.25rem',
                                   transform: 'translate(0px, -20px)',
                               },
                               [`& .${gaugeClasses.valueArc}`]: {
                                   fill: 'lightgreen',
                               },
                               [`& .${gaugeClasses.referenceArc}`]: {
                                   fill: 'black'
                               }
                           }}
                           text={({ value, valueMax }) => `${value} / ${valueMax}`}/>
                </div>
            </section>
            <section className={'notification-table-wrapper'}>
                <h1>Alerts & Notifications</h1>
                <TableContainer component={Paper} className={'notification-table'}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Number</StyledTableCell>
                                <StyledTableCell>Description</StyledTableCell>
                                <StyledTableCell>Sender</StyledTableCell>
                                <StyledTableCell>Time</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell>{row.calories}</StyledTableCell>
                                    <StyledTableCell>{row.name}</StyledTableCell>
                                    <StyledTableCell>{row.fat}</StyledTableCell>
                                    <StyledTableCell>{row.carbs}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
        </div>
    )
}