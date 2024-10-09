import {useContextMenu} from "../custom hooks/useContextMenu.jsx";
import '../styles/custom-context-menu-style.css'
import {styled} from "@mui/system";

export default function ContextMenu(){
    const { clicked, setClicked, coords, setCoords } = useContextMenu()

    const CustomContextMenu = styled('div')({
        position: 'absolute',
        width: '300px',
        height: 'fit-content',
        top: `${coords.y}px`,
        left: `${coords.x}px`,
        backgroundColor: 'white'
    })

    return (
        <div style={{width: '100%', height: '100dvh'}} onContextMenu={event => {
            event.preventDefault()
            console.log("x", event.pageX, "y", event.pageY)
            setCoords({ x: event.pageX, y: event.pageY })
            setClicked(true)
        }}>
            {clicked && (
                <CustomContextMenu>
                    <ul>
                        <li>Item A</li>
                        <li>Item A</li>
                        <li>Item A</li>
                    </ul>
                </CustomContextMenu>
            )}
        </div>
    )
}