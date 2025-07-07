"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue3_1 = require("@fullcalendar/vue3");
var daygrid_1 = require("@fullcalendar/daygrid");
var timegrid_1 = require("@fullcalendar/timegrid");
var list_1 = require("@fullcalendar/list");
var interaction_1 = require("@fullcalendar/interaction");
var EventForm_vue_1 = require("@/components/EventForm.vue");
var formPosition = (0, vue_1.reactive)({ x: 0, y: 0, arrowLeft: 0, arrowTop: 0, arrowRotate: '0deg' });
var events = (0, vue_1.reactive)([]);
var editMode = (0, vue_1.ref)(false);
var isAddEventFormOpen = (0, vue_1.ref)(false);
var selectedDate = (0, vue_1.ref)(null);
var selectedEvent = (0, vue_1.ref)(null);
var calendarOptions = (0, vue_1.reactive)({
    plugins: [daygrid_1.default, interaction_1.default, timegrid_1.default, list_1.default],
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
                day: 'numeric',
                omitCommas: true
            },
            dayHeaderContent: function (arg) {
                var d = arg.date;
                var weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
                var mm = String(d.getMonth() + 1).padStart(2, '0');
                var dd = String(d.getDate()).padStart(2, '0');
                return "".concat(weekday, " ").concat(mm, "/").concat(dd);
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
var clickedCell = {};
function onDateClick(info) {
    isAddEventFormOpen.value = true;
    clickedCell = info;
    info.dayEl.style.boxShadow = '0px 3px 6px #00000029';
}
function onPopupMounted() {
    var popupBoundingRect = document.querySelector('.form-wrapper').getBoundingClientRect();
    var cellBoundingRect;
    if (clickedCell.el) {
        cellBoundingRect = clickedCell.el.getBoundingClientRect();
    }
    else {
        cellBoundingRect = clickedCell.dayEl.getBoundingClientRect();
    }
    var popupPossibleLocations = getPopupPossibleLocations(popupBoundingRect, cellBoundingRect);
    var popupLocation = popupPossibleLocations[0];
    var popupCoordinates = calculatePopupCoordinates(popupBoundingRect, cellBoundingRect, popupLocation);
    var normalizedPopupCoordinates = normalizePopupCoordinates(popupCoordinates, popupBoundingRect);
    formPosition.x = normalizedPopupCoordinates.left;
    formPosition.y = normalizedPopupCoordinates.top;
    var popupArrowCoordinates = getPopupArrowCoordinates(popupLocation, cellBoundingRect);
    formPosition.arrowTop = popupArrowCoordinates.top;
    formPosition.arrowLeft = popupArrowCoordinates.left;
    formPosition.arrowRotate = popupArrowCoordinates.rotate;
    selectedDate.value = clickedCell.dateStr;
}
function getPopupPossibleLocations(popupBoundingRect, cellBoundingRect) {
    var locations = [];
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var freeBottomSpace = viewportHeight - cellBoundingRect.bottom;
    var freeRightSpace = viewportWidth - cellBoundingRect.right;
    if (freeBottomSpace >= popupBoundingRect.height) {
        locations.push('bottom');
    }
    if (cellBoundingRect.top >= popupBoundingRect.height) {
        locations.push('top');
    }
    if (cellBoundingRect.left >= popupBoundingRect.width) {
        locations.push('left');
    }
    if (freeRightSpace >= popupBoundingRect.width) {
        locations.push('right');
    }
    return locations;
}
function calculatePopupCoordinates(popupBoundingRect, cellBoundingRect, location) {
    var cellCenterX = cellBoundingRect.left + cellBoundingRect.width / 2;
    var cellCenterY = cellBoundingRect.top + cellBoundingRect.height / 2;
    if (location === 'bottom') {
        var popupLeft = cellCenterX - popupBoundingRect.width / 2;
        var popupTop = cellBoundingRect.bottom;
        return {
            left: popupLeft,
            top: popupTop
        };
    }
    if (location === 'top') {
        var popupLeft = cellCenterX - popupBoundingRect.width / 2;
        var popupTop = cellBoundingRect.top - popupBoundingRect.height;
        return {
            left: popupLeft,
            top: popupTop
        };
    }
    if (location === 'left') {
        var popupLeft = cellBoundingRect.left - popupBoundingRect.width;
        var popupTop = cellCenterY - popupBoundingRect.height / 2;
        return {
            left: popupLeft,
            top: popupTop
        };
    }
    if (location === 'right') {
        var popupLeft = cellBoundingRect.right;
        var popupTop = cellCenterY - popupBoundingRect.height / 2;
        return {
            left: popupLeft,
            top: popupTop
        };
    }
}
function normalizePopupCoordinates(popupCoordinates, popupBoundingRect) {
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var popupLeft = popupCoordinates.left;
    var popupTop = popupCoordinates.top;
    if (popupLeft < 0) {
        popupLeft = 0;
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
    };
}
function getPopupArrowCoordinates(popupLocation, cellBoundingRect) {
    var arrowWidth = 12; //TODO calculate correct
    var arrowHeight = 6;
    //TODO refactor repeated code
    if (popupLocation === 'bottom') {
        return {
            left: cellBoundingRect.left + cellBoundingRect.width / 2 - arrowWidth / 2,
            top: cellBoundingRect.bottom - arrowHeight,
            rotate: '180deg'
        };
    }
    if (popupLocation === 'top') {
        return {
            left: cellBoundingRect.left + cellBoundingRect.width / 2 - arrowWidth / 2,
            top: cellBoundingRect.top,
            rotate: '0deg'
        };
    }
    if (popupLocation === 'left') {
        return {
            left: cellBoundingRect.left,
            top: cellBoundingRect.top + cellBoundingRect.height / 2 - arrowHeight / 2,
            rotate: '-90deg'
        };
    }
    if (popupLocation === 'right') {
        return {
            left: cellBoundingRect.right - arrowWidth,
            top: cellBoundingRect.top + cellBoundingRect.height / 2 - arrowHeight / 2,
            rotate: '90deg'
        };
    }
}
function handleSaveOrEditEvent(newEvent) {
    var _a;
    if (editMode.value) {
        var index = events.findIndex(function (e) { return e.id === newEvent.id; });
        if (index !== -1) {
            events[index] = newEvent;
        }
    }
    else {
        events.push(newEvent);
    }
    if (clickedCell && clickedCell.event) {
        var newColor = ((_a = selectedEvent.value) === null || _a === void 0 ? void 0 : _a.color) || '#3B86FF';
        clickedCell.event.setProp('backgroundColor', newColor);
        clickedCell.event.setProp('borderColor', newColor);
        clickedCell.event.setProp('textColor', '#ffffff');
        clickedCell.event.setExtendedProp('customColor', newColor);
    }
    discardChanges();
    editMode.value = false;
    selectedEvent.value = null;
}
function deleteEvent(id) {
    var index = events.findIndex(function (event) { return event.id === id; });
    if (index !== -1) {
        events.splice(index, 1);
    }
    discardChanges();
}
function closeForm() {
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
function onEventClick(clickInfo) {
    var _a;
    editMode.value = true;
    isAddEventFormOpen.value = true;
    clickedCell = clickInfo;
    var currentColor = clickInfo.event.extendedProps.customColor
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
        time: ((_a = clickInfo.event.startStr.split('T')[1]) === null || _a === void 0 ? void 0 : _a.slice(0, 5)) || '',
        notes: clickInfo.event.extendedProps.notes || '',
        color: currentColor,
        allDay: clickInfo.event.allDay
    };
}
function restoreEventStyle() {
    if (clickedCell && clickedCell.event) {
        var savedColor = clickedCell.event.extendedProps.customColor || '#3B86FF';
        clickedCell.event.setProp('backgroundColor', savedColor);
        clickedCell.event.setProp('borderColor', savedColor);
        clickedCell.event.setProp('textColor', '#ffffff');
    }
}
function restoreCellStyle() {
    if (clickedCell && clickedCell.dayEl) {
        clickedCell.dayEl.style.boxShadow = '';
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "calendar-container" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)(__assign({ class: "calendar-title" }));
var __VLS_0 = {}.FullCalendar;
/** @type {[typeof __VLS_components.FullCalendar, ]} */ ;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    options: (__VLS_ctx.calendarOptions),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        options: (__VLS_ctx.calendarOptions),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
if (__VLS_ctx.isAddEventFormOpen) {
    /** @type {[typeof EventForm, ]} */ ;
    // @ts-ignore
    var __VLS_4 = __VLS_asFunctionalComponent(EventForm_vue_1.default, new EventForm_vue_1.default(__assign(__assign(__assign(__assign({ 'onSave': {} }, { 'onClose': {} }), { 'onDelete': {} }), { 'onMounted': {} }), { initialEvent: (__VLS_ctx.selectedEvent), mode: (__VLS_ctx.editMode), position: (__VLS_ctx.formPosition) })));
    var __VLS_5 = __VLS_4.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onSave': {} }, { 'onClose': {} }), { 'onDelete': {} }), { 'onMounted': {} }), { initialEvent: (__VLS_ctx.selectedEvent), mode: (__VLS_ctx.editMode), position: (__VLS_ctx.formPosition) })], __VLS_functionalComponentArgsRest(__VLS_4), false));
    var __VLS_7 = void 0;
    var __VLS_8 = void 0;
    var __VLS_9 = void 0;
    var __VLS_10 = {
        onSave: (__VLS_ctx.handleSaveOrEditEvent)
    };
    var __VLS_11 = {
        onClose: (__VLS_ctx.discardChanges)
    };
    var __VLS_12 = {
        onDelete: (__VLS_ctx.deleteEvent)
    };
    var __VLS_13 = {
        onMounted: (__VLS_ctx.onPopupMounted)
    };
    var __VLS_6;
}
/** @type {__VLS_StyleScopedClasses['calendar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['calendar-title']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            FullCalendar: vue3_1.default,
            EventForm: EventForm_vue_1.default,
            formPosition: formPosition,
            editMode: editMode,
            isAddEventFormOpen: isAddEventFormOpen,
            selectedEvent: selectedEvent,
            calendarOptions: calendarOptions,
            onPopupMounted: onPopupMounted,
            handleSaveOrEditEvent: handleSaveOrEditEvent,
            deleteEvent: deleteEvent,
            discardChanges: discardChanges,
        };
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
