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
  views: {
    timeGridWeek: {
      titleFormat: {
        month: 'short',
        day: 'numeric'
      },
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      },
      slotLabelInterval: '01:00:00',   // One label every 1 hour
      slotDuration: '01:00:00',        // Each row is 1 hour tall
      slotMinTime: '00:00:00',
      slotMaxTime: '24:00:00'
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


function onDateClick(info) {
  const rect = info.dayEl.getBoundingClientRect();

  const cellCenterX = rect.left + rect.width / 2;
  const cellBottomY = rect.bottom;

  formPosition.x = cellCenterX + window.scrollX;
  formPosition.y = cellBottomY + window.scrollY;

  selectedDate.value = info.dateStr;
  isAddEventFormOpen.value = true;
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
