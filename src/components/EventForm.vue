<script setup>
import { reactive, computed, watch, ref, nextTick, onMounted } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    required: true
  },
  mode: {
    type: Boolean,
    required: true
  },
  initialEvent: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close', 'delete', 'mounted' ])

const event = reactive({
  name: '',
  date: null,
  time: null,
  notes: '',
  color: '#3B86FF',
  allDay: false
});

const errors = reactive({
  name: '',
  date: '',
  time: '',
  notes: ''
})

function submit (e) {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  const newEvent = {
    id: props.mode && props.initialEvent?.id ? props.initialEvent.id : Date.now().toString(),
    title: event.name,
    start: event.allDay ? event.date : `${event.date}T${event.time}`,
    notes: event.notes,
    color: event.color,
    display: 'block',
    allDay: event.allDay
  }

  emit('save', newEvent)
}

function remove () {
  emit('delete', props.initialEvent.id)
}

function validateForm () {
  let valid = true

  errors.name = ''
  errors.date = ''
  errors.time = ''
  errors.notes = ''

  if (!event.name.trim()) {
    errors.name = 'Event name is required.'
    valid = false
  }

  if(event.name.length > 30) {
    errors.name = 'Name should be less than 30 characters'
    valid = false
  }

  if (!event.date) {
    errors.date = 'Event date is required.'
    valid = false
  }

  if (event.date) {
    const selectedDate = new Date(event.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate.getTime() < today.getTime()) {
      errors.date = 'Date cannot be in the past.'
      valid = false
    }
  }

  if (!event.allDay) {
    if (!event.time) {
      errors.time = 'Event time is required.'
      valid = false
    } else if (event.date) {
      const selectedDate = new Date(event.date)
      const selectedDateTime = new Date(`${event.date}T${event.time}`)
      const now = new Date()

      const isToday =
          selectedDate.getFullYear() === now.getFullYear() &&
          selectedDate.getMonth() === now.getMonth() &&
          selectedDate.getDate() === now.getDate()

      if (isToday && selectedDateTime.getTime() < now.getTime()) {
        errors.time = 'Time cannot be in the past for today.'
        valid = false
      }
    }
  }


  if (!event.notes.trim()) {
    errors.notes = 'Notes are required.'
    valid = false
  }

  return valid
}

const adjustedPosition = ref({ top: '0px', left: '0px' })
const arrowPosition = ref({top: '0px', left: '0px', rotate: '0deg'})
const formRef = ref()

watch(
    () => props.position,
    async (newPos) => {
      await nextTick()

      let left = newPos.x
      let top = newPos.y

      adjustedPosition.value = {
        top: `${top}px`,
        left: `${left}px`
      }

      arrowPosition.value = {
        top: `${newPos.arrowTop}px`,
        left: `${newPos.arrowLeft}px`,
        rotate: newPos.arrowRotate
      }
    },
    { immediate: true }
)

watch(
    () => props.initialEvent,
    (newVal) => {
      if (newVal) {
        event.name = newVal.name || ''
        event.date = newVal.date || null
        event.time = newVal.time || null
        event.notes = newVal.notes || ''
        event.color = newVal.color || '#3B86FF'
        event.allDay = newVal.allDay || false
      }
    },
    { immediate: true }
)

onMounted(() => {
  emit('mounted')
})

</script>
<template>
  <div class="form-wrapper" ref="formRef" :style="adjustedPosition">
    <div class="arrow" :style="arrowPosition"></div>
    <form @submit="submit" class="form">
      <img class="close-icon" @click="emit('close')" width="20" height="20" src="@/assets/images/cross.png" alt="Close" />
      <div class="input-wrapper">
        <label for="name" class="label">event name</label>
        <input v-model="event.name" @input="validateForm" class="input" id="name" type="text">
        <span class="error" v-if="errors.name">{{ errors.name }}</span>
      </div>
      <div class="input-wrapper">
        <label for="date" class="label">event date</label>
        <input v-model="event.date" @input="validateForm" class="input" id="date" type="date">
        <img class="input-icon" width="20" height="20" src="@/assets/images/calendar.png" alt="Calendar" />
        <span class="error" v-if="errors.date">{{ errors.date }}</span>
      </div>
      <div class="input-wrapper">
        <label for="time" class="label">event time</label>
        <input v-model="event.time" @input="validateForm" class="input" :disabled="event.allDay" id="time" type="time">
        <img class="input-icon" width="20" height="20" src="@/assets/images/clock.png" alt="Clock" />
        <span class="error" v-if="errors.time">{{ errors.time }}</span>
      </div>
      <div class="input-wrapper">
        <label for="notes" class="label">notes</label>
        <input v-model="event.notes" @input="validateForm" class="input" id="notes" type="text">
        <span class="error" v-if="errors.notes">{{ errors.notes }}</span>
      </div>
      <div class="checkbox-wrapper">
        <label for="allDay" class="label">all day</label>
        <input v-model="event.allDay" id="allDay" type="checkbox">
      </div>
      <div class="input-wrapper">
        <label for="color" class="label color">Select event color</label>
        <input v-model="event.color" class="color-input" id="color" type="color" />
      </div>
      <div class="buttons-wrapper">
        <button v-if="mode" @click="remove" class="cancel-button" type="button">DISCARD</button>
        <button v-else @click="emit('close')" class="cancel-button" type="button">Cancel</button>
        <button type="submit" class="save-button">{{ mode ? 'EDIT' : 'Save' }}</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
  .form-wrapper {
    position: fixed;
    background: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    border-radius: 8px;
    z-index: 1000;
  }

  .arrow {
    position: fixed;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #43425D;
  }

  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 200px;
    padding: 22px 26px;
    border: 1px solid #43425D;
    border-radius: 10px;
  }

  .close-icon {
    position: absolute;
    top: 7px;
    right: 7px;
    cursor: pointer;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .label {
    font-size: 9px;
    color: #D6D6D6;
    cursor: pointer;
  }

  .label.color {
    margin-bottom: 10px;
  }

  .input {
    min-height: 17px;
    font-size: 9px;
    color: #43425D;
    border: none;
    border-bottom: 0.3px solid #43425D80;
  }

  .color-input {
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .input-wrapper:not(:last-child),
  .checkbox-wrapper {
    margin-bottom: 20px;
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    right: 0;
    top: 0;
  }

  .cancel-button {
    color: #FF5F5F;
    font-size: 12px;
  }

  .save-button {
    color: #6A6996;
    font-size: 12px;
  }

  .cancel-button,
  .save-button {
    padding: 0;
  }

  .buttons-wrapper {
    display: flex;
    justify-content: space-between;
  }

  .error {
    font-size: 9px;
    color: #FF5F5F;
  }

</style>
