import {useLoaderData} from "react-router";
import Typography from "@mui/joy/Typography";
import {Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {useEffect, useState} from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Checkbox from "@mui/joy/Checkbox";
import {useTranslation} from "react-i18next";

export default function UserFeedback(){
    const data = useLoaderData().data.records
    const [feedbackData, setFeedbackData] = useState(data)
    const [filteredData, setFilteredData] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const [filter, setFilter] = useState({
        allowBlank: true,
        type: 'default',
        rating: 'default',
        sort: 'id',
        order: 'asc'
    })
    const {t} = useTranslation('common')

    const header = ['id', 'feedback-type', 'content', 'rating', 'datetime']
    const ratingValue = {amazing: 5, good: 4, okay: 3, bad: 2, terrible: 1}

    useEffect(() => {
       if(feedbackData.length !== 0){
           const sortData = [...feedbackData]
           switch (filter.sort){
               case 'id':
                   sortData.sort((a, b) => {
                       if(filter.order === 'asc') return a[0] - b[0]
                       return b[0] - a[0]
                   })
                   break;
               case 'rating':
                   sortData.sort((a, b) => {
                       if(a[3] === null && b[3] === null){
                            return 0
                       }
                       else{
                           if(a[3] === null)
                               return filter.order === 'asc' ? -1 : 1
                           else if(b[3] === null)
                               return filter.order === 'asc' ? 1 : -1
                           else{
                                 if(filter.order === 'asc')
                                     return ratingValue[a[3]] - ratingValue[b[3]]
                                 return ratingValue[b[3]] - ratingValue[a[3]]
                           }

                       }
                   })
                   break;
               case 'date':
                   sortData.sort((a, b) => {
                       if(filter.order === 'asc') return dayjs(a[4]) - dayjs(b[4])
                       return dayjs(b[4]) - dayjs(a[4])
                   })
                   break;
           }
           setFeedbackData(sortData)
       }
    }, [filter.sort, filter.order]);

    console.log(feedbackData)

    useEffect(() => {
        const data = [...feedbackData]
        const filterData = data.filter(item => {
            if(filter.type === 'default' && filter.rating === 'default')
                return (!filter.allowBlank ? item[2] !== null : true)
            else if(filter.type !== 'default' && filter.rating === 'default')
                return item[1] === filter.type && (!filter.allowBlank ? item[2] !== null : true)
            else if(filter.type === 'default' && filter.rating !== 'default')
                return item[3] === filter.rating && (!filter.allowBlank ? item[2] !== null : true)
            else
                return item[1] === filter.type && item[3] === filter.rating && (!filter.allowBlank ? item[2] !== null : true)
        })
        setFilteredData(filterData)
    }, [filter.type, filter.rating, filter.allowBlank]);

    function handleSelectChange(type, value){
        setFilter(prev => {
            return {...prev, [type]: value}
        })
    }

    return (
        <Stack rowGap={1.25}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography color={'white'} level={'h2'}>
                    {t('user_profile.feedback.title')}
                </Typography>
                <Button variant="contained" startIcon={<FilterAltIcon />} onClick={() => setShowFilter(prev => !prev)}>
                    {t('user_profile.sort-filter')}
                </Button>
            </Stack>
            {showFilter &&
                <Stack className={'sort-filter-panel'} rowGap={'1rem'}>
                    <p className={'clear-filter-btn'} onClick={() => {
                        setFilter({
                            allowBlank: true,
                            type: 'default',
                            rating: 'default',
                            sort: 'id',
                            order: 'asc'
                        })
                    }}>CLEAR ALL FILTERS</p>
                    <Stack direction={'row'} columnGap={3}>
                        <Stack direction={'row'} alignItems={'center'} columnGap={1}>
                            <Typography variant={'plain'} color={'white'}>
                                {t('user_profile.feedback.filter.include-content')}
                            </Typography>
                            <Checkbox checked={!filter.allowBlank}
                                      onChange={() => {
                                          setFilter(prev => {
                                              return {...prev, allowBlank: !prev.allowBlank}
                                          })
                                      }}
                            />
                        </Stack>
                        <Stack rowGap={1} direction={'row'} alignItems={'center'} columnGap={1}>
                            <Typography color={'white'}>
                                {t('user_profile.feedback.filter.type.title')}
                            </Typography>
                            <Select defaultValue={"default"} value={filter.type}
                                    onChange={(_, val) => handleSelectChange('type', val)}>
                                <Option value={"default"}>
                                    {t('user_profile.feedback.filter.type.all')}
                                </Option>
                                <Option value={"scheduling"}>
                                    {t('user_profile.feedback.filter.type.scheduling')}
                                </Option>
                            </Select>
                        </Stack>
                        <Stack rowGap={1} direction={'row'} alignItems={'center'} columnGap={1}>
                            <Typography color={'white'}>
                                {t('user_profile.feedback.filter.rating.title')}
                            </Typography>
                            <Select defaultValue={"default"} value={filter.rating}
                                    onChange={(_, val) => handleSelectChange('rating', val)}>
                                <Option value={"default"}>
                                    {t('user_profile.feedback.filter.rating.all')}
                                </Option>
                                <Option value={"amazing"}>{t('user_profile.feedback.rating.amazing')}</Option>
                                <Option value={"good"}>{t('user_profile.feedback.rating.good')}</Option>
                                <Option value={"okay"}>{t('user_profile.feedback.rating.ok')}</Option>
                                <Option value={"bad"}>{t('user_profile.feedback.rating.bad')}</Option>
                                <Option value={"terrible"}>{t('user_profile.feedback.rating.terrible')}</Option>
                            </Select>
                        </Stack>
                    </Stack>
                   <Stack direction={'row'} columnGap={3}>
                       <Stack rowGap={1} direction={'row'} alignItems={'center'} columnGap={1}>
                           <Typography color={'white'}>
                               {t('user_profile.feedback.filter.order.title')}
                           </Typography>
                           <Select defaultValue={"id"} value={filter.sort}
                                   onChange={(_, val) => handleSelectChange('sort', val)}>
                               <Option value={"id"}>{t('user_profile.feedback.filter.order.id')}</Option>
                               <Option value={"rating"}>{t('user_profile.feedback.filter.order.rating')}</Option>
                               <Option value={"date"}>{t('user_profile.feedback.filter.order.datetime')}</Option>
                           </Select>
                       </Stack>
                       <Stack rowGap={1} direction={'row'} alignItems={'center'} columnGap={1}>
                           <Typography color={'white'}>{t('user_profile.feedback.filter.order.title-2')}</Typography>
                           <Select defaultValue={"id"} value={filter.order}
                                   onChange={(_, val) => handleSelectChange('order', val)}>
                               <Option value={"asc"}>{t('order.asc')}</Option>
                               <Option value={"desc"}>{t('order.desc')}</Option>
                           </Select>
                       </Stack>
                   </Stack>
                </Stack>
            }
            <div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#36007B'}}>
                                {header.map((item, index) =>
                                    <TableCell sx={{color: 'white'}} key={index}>{t(`table.${item}`)}</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <Tooltip title={"Click to view detail"} key={index} followCursor>
                                    <TableRow sx={{
                                        '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                        '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                    }}>
                                        <TableCell>{item[0]}</TableCell>
                                        <TableCell>{t(`user_profile.feedback.type.${item[1]}`)}</TableCell>
                                        <TableCell>{item[2] || "------------------"}</TableCell>
                                        <TableCell>{item[3] ?
                                            t(`user_profile.feedback.rating.${item[3]}`)
                                            : "------------------"}</TableCell>
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