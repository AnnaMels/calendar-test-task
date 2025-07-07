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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var props = defineProps({
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
});
var emit = defineEmits(['save', 'close', 'delete', 'mounted']);
var event = (0, vue_1.reactive)({
    name: '',
    date: null,
    time: null,
    notes: '',
    color: '#3B86FF',
    allDay: false
});
var errors = (0, vue_1.reactive)({
    name: '',
    date: '',
    time: '',
    notes: ''
});
function submit(e) {
    var _a;
    e.preventDefault();
    if (!validateForm()) {
        return;
    }
    var newEvent = {
        id: props.mode && ((_a = props.initialEvent) === null || _a === void 0 ? void 0 : _a.id) ? props.initialEvent.id : Date.now().toString(),
        title: event.name,
        start: event.allDay ? event.date : "".concat(event.date, "T").concat(event.time),
        notes: event.notes,
        color: event.color,
        display: 'block',
        allDay: event.allDay
    };
    emit('save', newEvent);
}
function remove() {
    emit('delete', props.initialEvent.id);
}
function validateForm() {
    var valid = true;
    errors.name = '';
    errors.date = '';
    errors.time = '';
    errors.notes = '';
    if (!event.name.trim()) {
        errors.name = 'Event name is required.';
        valid = false;
    }
    if (event.name.length > 30) {
        errors.name = 'Name should be less than 30 characters';
        valid = false;
    }
    if (!event.date) {
        errors.date = 'Event date is required.';
        valid = false;
    }
    if (event.date) {
        var selectedDate = new Date(event.date);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate.getTime() < today.getTime()) {
            errors.date = 'Date cannot be in the past.';
            valid = false;
        }
    }
    if (!event.allDay) {
        if (!event.time) {
            errors.time = 'Event time is required.';
            valid = false;
        }
        else if (event.date) {
            var selectedDate = new Date(event.date);
            var selectedDateTime = new Date("".concat(event.date, "T").concat(event.time));
            var now = new Date();
            var isToday = selectedDate.getFullYear() === now.getFullYear() &&
                selectedDate.getMonth() === now.getMonth() &&
                selectedDate.getDate() === now.getDate();
            if (isToday && selectedDateTime.getTime() < now.getTime()) {
                errors.time = 'Time cannot be in the past for today.';
                valid = false;
            }
        }
    }
    if (!event.notes.trim()) {
        errors.notes = 'Notes are required.';
        valid = false;
    }
    return valid;
}
var adjustedPosition = (0, vue_1.ref)({ top: '0px', left: '0px' });
var arrowPosition = (0, vue_1.ref)({ top: '0px', left: '0px', rotate: '0deg' });
var formRef = (0, vue_1.ref)();
(0, vue_1.watch)(function () { return props.position; }, function (newPos) { return __awaiter(void 0, void 0, void 0, function () {
    var left, top;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, vue_1.nextTick)()];
            case 1:
                _a.sent();
                left = newPos.x;
                top = newPos.y;
                adjustedPosition.value = {
                    top: "".concat(top, "px"),
                    left: "".concat(left, "px")
                };
                arrowPosition.value = {
                    top: "".concat(newPos.arrowTop, "px"),
                    left: "".concat(newPos.arrowLeft, "px"),
                    rotate: newPos.arrowRotate
                };
                return [2 /*return*/];
        }
    });
}); }, { immediate: true });
(0, vue_1.watch)(function () { return props.initialEvent; }, function (newVal) {
    if (newVal) {
        event.name = newVal.name || '';
        event.date = newVal.date || null;
        event.time = newVal.time || null;
        event.notes = newVal.notes || '';
        event.color = newVal.color || '#3B86FF';
        event.allDay = newVal.allDay || false;
    }
}, { immediate: true });
(0, vue_1.onMounted)(function () {
    emit('mounted');
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['save-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign(__assign({ class: "form-wrapper" }, { ref: "formRef" }), { style: (__VLS_ctx.adjustedPosition) }));
/** @type {typeof __VLS_ctx.formRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "arrow" }, { style: (__VLS_ctx.arrowPosition) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)(__assign({ onSubmit: (__VLS_ctx.submit) }, { class: "form" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.emit('close');
    } }, { class: "close-icon" }), { width: "20", height: "20", src: "@/assets/images/cross.png", alt: "Close" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "input-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "name" }, { class: "label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign(__assign(__assign({ onInput: (__VLS_ctx.validateForm) }, { value: (__VLS_ctx.event.name) }), { class: "input" }), { id: "name", type: "text" }));
if (__VLS_ctx.errors.name) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "error" }));
    (__VLS_ctx.errors.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "input-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "date" }, { class: "label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign(__assign({ onInput: (__VLS_ctx.validateForm) }, { class: "input" }), { id: "date", type: "date" }));
(__VLS_ctx.event.date);
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ class: "input-icon" }, { width: "20", height: "20", src: "@/assets/images/calendar.png", alt: "Calendar" }));
if (__VLS_ctx.errors.date) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "error" }));
    (__VLS_ctx.errors.date);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "input-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "time" }, { class: "label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign(__assign({ onInput: (__VLS_ctx.validateForm) }, { class: "input" }), { disabled: (__VLS_ctx.event.allDay), id: "time", type: "time" }));
(__VLS_ctx.event.time);
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)(__assign({ class: "input-icon" }, { width: "20", height: "20", src: "@/assets/images/clock.png", alt: "Clock" }));
if (__VLS_ctx.errors.time) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "error" }));
    (__VLS_ctx.errors.time);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "input-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "notes" }, { class: "label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign(__assign(__assign({ onInput: (__VLS_ctx.validateForm) }, { value: (__VLS_ctx.event.notes) }), { class: "input" }), { id: "notes", type: "text" }));
if (__VLS_ctx.errors.notes) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "error" }));
    (__VLS_ctx.errors.notes);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "checkbox-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "allDay" }, { class: "label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    id: "allDay",
    type: "checkbox",
});
(__VLS_ctx.event.allDay);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "input-wrapper" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ for: "color" }, { class: "label color" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)(__assign({ class: "color-input" }, { id: "color", type: "color" }));
(__VLS_ctx.event.color);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "buttons-wrapper" }));
if (__VLS_ctx.mode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.remove) }, { class: "cancel-button" }), { type: "button" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.mode))
                return;
            __VLS_ctx.emit('close');
        } }, { class: "cancel-button" }), { type: "button" }));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ type: "submit" }, { class: "save-button" }));
(__VLS_ctx.mode ? 'EDIT' : 'Save');
/** @type {__VLS_StyleScopedClasses['form-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['input-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['input']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['input-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['label']} */ ;
/** @type {__VLS_StyleScopedClasses['color']} */ ;
/** @type {__VLS_StyleScopedClasses['color-input']} */ ;
/** @type {__VLS_StyleScopedClasses['buttons-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-button']} */ ;
/** @type {__VLS_StyleScopedClasses['save-button']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return __assign(__assign({ $props: __VLS_makeOptional(props) }, props), { $emit: emit, emit: emit, event: event, errors: errors, submit: submit, remove: remove, validateForm: validateForm, adjustedPosition: adjustedPosition, arrowPosition: arrowPosition, formRef: formRef });
    },
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return __assign(__assign({ $props: __VLS_makeOptional(props) }, props), { $emit: emit });
    },
});
; /* PartiallyEnd: #4569/main.vue */
