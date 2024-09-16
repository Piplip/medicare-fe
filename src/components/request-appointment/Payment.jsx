import Typography from "@mui/joy/Typography";

export default function Payment(){
    return (
        <div>
            <Typography level={'h1'} sx={{color: 'white'}}>Payment</Typography>
            <hr style={{width: '7.75rem', height: '.25rem', backgroundColor: 'yellow', borderColor: 'yellow'}}/>
            <div>
                <p>Payment is required to confirm your appointment</p>
                <p>Payment will be processed through our secure payment gateway</p>
                <p>After payment, you will receive a confirmation email</p>
            </div>
        </div>
    )
}