<script setup>
import { reactive, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventForm from '@/components/EventForm.vue'

const formPosition = reactive({ x: 0, y: 0 })
const events = reactive([]);
const editMode = ref(false);
const isAddEventFormOpen = ref(false);
const selectedDate = ref(null);
const selectedEvent = ref(null);

const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth, timeGridWeek, timeGridDay'
  },
  editable: true,
  dateClick: onDateClick,
  eventClick: onEventClick,
  eventResize: onEventResize,
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
function onEventResize () {
  console.log('onEventResize')
}

</script>

<template>
  <div class="calendar-container">
    <h1>Calendar</h1>
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
    padding: 100px 75px;
  }

</style>
