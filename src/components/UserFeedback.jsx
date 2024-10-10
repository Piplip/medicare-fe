import {useLoaderData} from "react-router";
import Typography from "@mui/joy/Typography";

export default function UserFeedback(){
    const data = useLoaderData().data
    console.log(data)

    return (
        <>
            <Typography color={'white'} level={'h2'}>Feedback</Typography>
        </>
    )
}