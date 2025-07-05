<script setup>
import { reactive, defineProps, computed, defineEmits, watch } from 'vue'

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

const emit = defineEmits(['save', 'close', 'delete' ])

const event = reactive({
  name: '',
  date: null,
  time: null,
  notes: '',
  color: '#1f8caf'
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
    start: `${event.date}T${event.time}`,
    notes: event.notes,
    color: event.color,
    display: 'block'
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

  if (!event.time) {
    errors.time = 'Event time is required.'
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

  if (!event.notes.trim()) {
    errors.notes = 'Notes are required.'
    valid = false
  }

  return valid
}

const formPosition = computed(() => ({
  top: `${props.position.y}px`,
  left: `${props.position.x}px`
}))

watch(
    () => props.initialEvent,
    (newVal) => {
      if (newVal) {
        event.name = newVal.name || ''
        event.date = newVal.date || null
        event.time = newVal.time || null
        event.notes = newVal.notes || ''
        event.color = newVal.color || '#1f8caf'
      } else {
        // Reset to empty for Add mode
        event.name = ''
        event.date = null
        event.time = null
        event.notes = ''
        event.color = '#1f8caf'
      }
    },
    { immediate: true }
)

</script>
<template>
  <div class="form-wrapper" :style="formPosition">
    <form @submit="submit" class="form">
      <div class="input-wrapper">
        <label for="name">event name</label>
        <input v-model="event.name" @input="validateForm" id="name" type="text">
        <span class="error" v-if="errors.name">{{ errors.name }}</span>
      </div>
      <div class="input-wrapper">
        <label for="date">event date</label>
        <input v-model="event.date" @input="validateForm" id="date" type="date">
        <span class="error" v-if="errors.date">{{ errors.date }}</span>
      </div>
      <div class="input-wrapper">
        <label for="time">event time</label>
        <input v-model="event.time" @input="validateForm" id="time" type="time">
        <span class="error" v-if="errors.time">{{ errors.time }}</span>
      </div>
      <div class="input-wrapper">
        <label for="notes">notes</label>
        <input v-model="event.notes" @input="validateForm" id="notes" type="text">
        <span class="error" v-if="errors.notes">{{ errors.notes }}</span>
      </div>
      <div class="input-wrapper">
        <label for="color">Event color</label>
        <input v-model="event.color" id="color" type="color" />
      </div>
      <div>
        <button v-if="mode" @click="remove" type="button">Discard</button>
        <button v-else @click="emit('close')" type="button">Cancel</button>
        <button type="submit">{{ mode ? 'Edit' : 'Save' }}</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
  .form-wrapper {
    position: absolute;
    transform: translate(-50%, -40%);
    transform-origin: top center;
    background: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    border-radius: 8px;
    z-index: 1000;
  }

  .form {
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
