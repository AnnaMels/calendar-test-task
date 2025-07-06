<script setup>
import { reactive, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import EventForm from '@/components/EventForm.vue'

const formPosition = reactive({ x: 0, y: 0 })
const events = reactive([]);
const editMode = ref(false);
const isAddEventFormOpen = ref(false);
const selectedDate = ref(null);
const selectedEvent = ref(null);

const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  initialView: 'dayGridMonth',
  defaultTimedEventDuration: '00:30:00',
  fixedWeekCount: false,
  views: {
    timeGridWeek: {
      eventOverlap: false,
      defaultTimedEventDuration: '00:30:00',
      nowIndicator: true,
      titleFormat: { month: 'short', day: 'numeric' },
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      },
      slotLabelInterval: '01:00:00',
      slotDuration: '01:00:00',
    },
    dayGridMonth: {
      dayMaxEventRows: true
    },
    timeGridDay: {
      slotDuration: '00:30:00',
      slotLabelInterval: '00:30:00',
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      },
      titleFormat: {
        weekday: 'long',
        month: 'short',
        day: 'numeric' ,
        omitCommas: true
      },
      dayHeaderContent(arg) {
        const d = arg.date;
        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${weekday} ${mm}/${dd}`;
      },
    }
  },
  headerToolbar: {
    left: 'today prev next',
    center: 'title',
    right: 'dayGridMonth timeGridWeek timeGridDay listWeek'
  },
  buttonText: {
    today: 'Today',
    prev: 'Back',
    next: 'Next',
    dayGridMonth: 'Month',
    timeGridWeek: 'Week',
    timeGridDay: 'Day',
    listWeek: 'Agenda'
  },
  editable: true,
  dateClick: onDateClick,
  eventClick: onEventClick,
  events: events
});

let clickedCell = {}

function onDateClick(info) {
  isAddEventFormOpen.value = true;
  clickedCell = info;
}

function onPopupMounted() {
  const popupBoundingRect = document.querySelector('.form-wrapper').getBoundingClientRect();
  const cellBoundingRect = clickedCell.dayEl.getBoundingClientRect();

  const popupPossibleLocations = getPopupPossibleLocations(popupBoundingRect, cellBoundingRect);
  const popupLocation = popupPossibleLocations[0];
  const popupCoordinates = calculatePopupCoordinates(popupBoundingRect, cellBoundingRect, popupLocation);
  const normalizedPopupCoordinates = normalizePopupCoordinates(popupCoordinates, popupBoundingRect);

  formPosition.x = normalizedPopupCoordinates.left;
  formPosition.y = normalizedPopupCoordinates.top;

  selectedDate.value = clickedCell.dateStr;

}

function getPopupPossibleLocations (popupBoundingRect, cellBoundingRect) {
  const locations = [];
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const freeBottomSpace = viewportHeight - cellBoundingRect.bottom;
  const freeRightSpace = viewportWidth - cellBoundingRect.right;

  if (freeBottomSpace >= popupBoundingRect.height) {
    locations.push('bottom')
  }

  if (cellBoundingRect.top >= popupBoundingRect.height) {
    locations.push('top')
  }

  if (cellBoundingRect.left >= popupBoundingRect.width) {
    locations.push('left')
  }

  if (freeRightSpace >= popupBoundingRect.width) {
    locations.push('right')
  }

  return locations;
}

function calculatePopupCoordinates (popupBoundingRect, cellBoundingRect, location) {
  const cellCenterX = cellBoundingRect.left + cellBoundingRect.width / 2;
  const cellCenterY = cellBoundingRect.top + cellBoundingRect.height / 2;

  if (location === 'bottom') {
    const popupLeft = cellCenterX - popupBoundingRect.width / 2;
    const popupTop = cellBoundingRect.bottom;

    return {
      left: popupLeft,
      top: popupTop
    }
  }

  if (location === 'top') {
    const popupLeft = cellCenterX - popupBoundingRect.width / 2;
    const popupTop = cellBoundingRect.top - popupBoundingRect.height;

    return {
      left: popupLeft,
      top: popupTop
    }
  }

  if (location === 'left') {
    const popupLeft = cellBoundingRect.left - popupBoundingRect.width;
    const popupTop = cellCenterY - popupBoundingRect.height / 2;

    return {
      left: popupLeft,
      top: popupTop
    }
  }

  if (location === 'right') {
    const popupLeft = cellBoundingRect.right;
    const popupTop = cellCenterY - popupBoundingRect.height / 2;

    return {
      left: popupLeft,
      top: popupTop
    }

  }
}

function normalizePopupCoordinates (popupCoordinates, popupBoundingRect) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let popupLeft = popupCoordinates.left;
  let popupTop = popupCoordinates.top;

  if (popupLeft < 0) {
    popupLeft = 0
  }

  if (popupLeft + popupBoundingRect.width > viewportWidth) {
    popupLeft = viewportWidth - popupBoundingRect.width;
  }

  if (popupTop < 0) {
    popupTop = 0;
  }

  if (popupTop + popupBoundingRect.height > viewportHeight) {
    popupTop = viewportHeight - popupBoundingRect.height;
  }

  return {
    left: popupLeft,
    top: popupTop
  }
}


function handleSaveOrEditEvent(newEvent) {
  if (editMode.value) {
    const index = events.findIndex(e => e.id === newEvent.id)
    if (index !== -1) {
      events[index] = newEvent
    }
  } else {
    events.push(newEvent)
  }

  closeForm()
  editMode.value = false
  selectedEvent.value = null
}

function deleteEvent (id) {
  const index = events.findIndex((event) => event.id === id)
  if (index !== -1) {
    events.splice(index, 1)
  }
  closeForm()
}

function closeForm () {
  isAddEventFormOpen.value = false
}

function onEventClick (clickInfo) {
  editMode.value = true;
  const rect = clickInfo.el.getBoundingClientRect();
  const cellCenterX = rect.left + rect.width / 2;
  const cellBottomY = rect.bottom;

  formPosition.x = cellCenterX + window.scrollX;
  formPosition.y = cellBottomY + window.scrollY;

  selectedEvent.value = {
    id: clickInfo.event.id,
    name: clickInfo.event.title,
    date: clickInfo.event.startStr.split('T')[0],
    time: clickInfo.event.startStr.split('T')[1]?.slice(0,5) || '',
    notes: clickInfo.event.extendedProps.notes || '',
    color: clickInfo.event.backgroundColor || '#1f8caf'
  };

  isAddEventFormOpen.value = true;
}

</script>

<template>
  <div class="calendar-container">
    <h2 class="calendar-title">Calendar View</h2>
    <FullCalendar :options="calendarOptions"/>
    <EventForm
        v-if="isAddEventFormOpen"
        :initialEvent="selectedEvent"
        :mode="editMode"
        :position="formPosition"
        @save="handleSaveOrEditEvent"
        @close="closeForm"
        @delete="deleteEvent"
        @mounted="onPopupMounted"
    />
  </div>
</template>

<style scoped>
  .calendar-container {
    padding: 20px;
    background-color: #ffffff;
  }

  .calendar-title {
    margin-bottom: 15px;
    font-size: 18px;
    color: #4D4F5C;
  }

</style>
