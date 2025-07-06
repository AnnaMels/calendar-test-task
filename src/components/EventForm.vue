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
  },
  arrowPosition: {
    type: String,
    default: 'bottom'
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
const formRef = ref()

// Watch the passed position and adjust it to stay within viewport
watch(
    () => props.position,
    async (newPos) => {
      await nextTick() // wait for DOM update

      let left = newPos.x
      let top = newPos.y

      adjustedPosition.value = {
        top: `${top}px`,
        left: `${left}px`
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
  <div class="form-wrapper" ref="formRef" :style="adjustedPosition" :class="`arrow-${props.arrowPosition}`">
    <div class="arrow"></div>
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
        <input v-model="event.time" @input="validateForm" :disabled="event.allDay" id="time" type="time">
        <span class="error" v-if="errors.time">{{ errors.time }}</span>
      </div>
      <div class="checkbox-wrapper">
        <label for="allDay">all day</label>
        <input v-model="event.allDay" id="allDay" type="checkbox">
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
    position: fixed;
    background: white;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    border-radius: 8px;
    z-index: 1000;
  }

  .form-wrapper .arrow {
    position: absolute;
    width: 0;
    height: 0;
  }

  .form-wrapper.arrow-top .arrow {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #43425D;
  }

  .form-wrapper.arrow-bottom .arrow {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #43425D;
  }

  .form-wrapper.arrow-left .arrow {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #43425D;
  }

  .form-wrapper.arrow-right .arrow {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #43425D;
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

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>
