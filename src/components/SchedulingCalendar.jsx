import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";

export default function SchedulingCalendar(){
    const events = [
        { id: 'a', title: 'Meeting',
            start: new Date(2024, 5, 16, 19, 14, 12),
            end: new Date(2024, 5, 16, 21, 14, 12)
        },
        { id: 'a', title: 'Meeting',
            start: new Date(2024, 5, 16, 20, 14, 12),
            end: new Date(2024, 5, 16, 21, 14, 12)
        },
        { id: 'b', title: 'Meeting', start: new Date(2024, 5, 17, 3, 24, 12)},
        { id: 'c', title: 'Meeting', start: new Date(2024, 5, 18, 12, 24, 12)},
        { id: 'd', title: 'Meeting', start: new Date(2024, 5, 19, 15, 24, 12)},
    ]
    function renderEventContent(eventInfo) {
        return (
            <div style={{paddingInline: '0.25rem', display:'flex', columnGap: '0.5rem'}}>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        )
    }
    return (
        <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
            initialView="timeGridWeek"
            views={{
                timeGridWeek: {
                    allDayText: 'All Day',
                    nowIndicator: true
                },
                timeGridDay: {
                    allDayText: 'All Day',
                    nowIndicator: true
                }
            }}
            events={events}
            eventContent={renderEventContent}
            dateClick={(info) => console.log(info)}
            buttonText={{
                today: 'Today',
                week: 'Week',
                day: 'Day',
                month: 'Month'
            }}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridDay timeGridWeek dayGridMonth'
            }}
        />
    )
}