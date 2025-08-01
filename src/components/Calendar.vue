<script setup>
import { reactive, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import EventForm from '@/components/EventForm.vue'

const formPosition = reactive({ x: 0, y: 0, arrowLeft: 0, arrowTop: 0, arrowRotate: '0deg' })
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
  info.dayEl.style.boxShadow = '0px 3px 6px #00000029'
}

function onPopupMounted() {
  const popupBoundingRect = document.querySelector('.form-wrapper').getBoundingClientRect();
  let cellBoundingRect;
  if (clickedCell.el) {
    cellBoundingRect = clickedCell.el.getBoundingClientRect();
  } else {
    cellBoundingRect = clickedCell.dayEl.getBoundingClientRect();
  }

  const popupPossibleLocations = getPopupPossibleLocations(popupBoundingRect, cellBoundingRect);
  const popupLocation = popupPossibleLocations[0];
  const popupCoordinates = calculatePopupCoordinates(popupBoundingRect, cellBoundingRect, popupLocation);
  const normalizedPopupCoordinates = normalizePopupCoordinates(popupCoordinates, popupBoundingRect);

  formPosition.x = normalizedPopupCoordinates.left;
  formPosition.y = normalizedPopupCoordinates.top;

  const popupArrowCoordinates = getPopupArrowCoordinates(popupLocation, cellBoundingRect);
  formPosition.arrowTop = popupArrowCoordinates.top;
  formPosition.arrowLeft = popupArrowCoordinates.left;
  formPosition.arrowRotate = popupArrowCoordinates.rotate;

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

function getPopupArrowCoordinates(popupLocation, cellBoundingRect) {
  const arrowWidth = 12; //TODO calculate correct
  const arrowHeight = 6;

  //TODO refactor repeated code

  if (popupLocation === 'bottom') {
    return {
      left: cellBoundingRect.left + cellBoundingRect.width/2 - arrowWidth/2,
      top: cellBoundingRect.bottom - arrowHeight,
      rotate: '180deg'
    }
  }

  if (popupLocation === 'top') {
    return {
      left: cellBoundingRect.left + cellBoundingRect.width/2 - arrowWidth/2,
      top: cellBoundingRect.top,
      rotate: '0deg'
    }
  }

  if (popupLocation === 'left') {
    return {
      left: cellBoundingRect.left,
      top: cellBoundingRect.top + cellBoundingRect.height / 2 - arrowHeight / 2,
      rotate: '-90deg'
    }
  }

  if (popupLocation === 'right') {
    return {
      left: cellBoundingRect.right - arrowWidth,
      top: cellBoundingRect.top + cellBoundingRect.height/2 - arrowHeight/2,
      rotate: '90deg'
    }
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

  if (clickedCell && clickedCell.event) {
    const newColor = selectedEvent.value?.color || '#3B86FF';
    clickedCell.event.setProp('backgroundColor', newColor);
    clickedCell.event.setProp('borderColor', newColor);
    clickedCell.event.setProp('textColor', '#ffffff');
    clickedCell.event.setExtendedProp('customColor', newColor);
  }

  discardChanges()
  editMode.value = false
  selectedEvent.value = null
}

function deleteEvent (id) {
  const index = events.findIndex((event) => event.id === id)
  if (index !== -1) {
    events.splice(index, 1)
  }
  discardChanges()
}

function closeForm () {
  restoreCellStyle();
  editMode.value = false;
  isAddEventFormOpen.value = false;
  clickedCell = null;
  selectedEvent.value = null;
}

function discardChanges() {
  restoreEventStyle();
  closeForm();
}

function onEventClick (clickInfo) {
  editMode.value = true;
  isAddEventFormOpen.value = true;
  clickedCell = clickInfo;

  const currentColor = clickInfo.event.extendedProps.customColor
      || clickInfo.event.backgroundColor
      || '#3B86FF';

  if (!clickInfo.event.extendedProps.customColor) {
    clickInfo.event.setExtendedProp('customColor', currentColor);
  }

  clickInfo.event.setProp('textColor', currentColor);
  clickInfo.event.setProp('borderColor', currentColor);
  clickInfo.event.setProp('backgroundColor', '#ffffff');
  clickInfo.el.style.boxShadow = '0px 3px 6px #00000063';

  selectedEvent.value = {
    id: clickInfo.event.id,
    name: clickInfo.event.title,
    date: clickInfo.event.startStr.split('T')[0],
    time: clickInfo.event.startStr.split('T')[1]?.slice(0,5) || '',
    notes: clickInfo.event.extendedProps.notes || '',
    color: currentColor,
    allDay: clickInfo.event.allDay
  };
}

function restoreEventStyle () {
  if (clickedCell && clickedCell.event) {
    const savedColor = clickedCell.event.extendedProps.customColor || '#3B86FF';
    clickedCell.event.setProp('backgroundColor', savedColor);
    clickedCell.event.setProp('borderColor', savedColor);
    clickedCell.event.setProp('textColor', '#ffffff');
  }
}

function restoreCellStyle () {
  if (clickedCell && clickedCell.dayEl) {
    clickedCell.dayEl.style.boxShadow = '';
  }
}
</script>

<template>
  <div class="calendar-container">
    <h2 class="calendar-title">Calendar View</h2>
    <FullCalendar :options="calendarOptions" />
    <EventForm
        v-if="isAddEventFormOpen"
        :initialEvent="selectedEvent"
        :mode="editMode"
        :position="formPosition"
        @save="handleSaveOrEditEvent"
        @close="discardChanges"
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
