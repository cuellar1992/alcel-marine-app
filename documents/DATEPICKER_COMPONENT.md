# 📅 DatePicker Components - Premium

## Three DatePicker Components

Your app has **three premium DatePicker components** with the same elegant design:

---

## 1. 🕐 DateTimePicker (Date + Time)

**Use for:** Marine Non-Claims - Job creation/editing where you need both date and time

### Features:
- ✅ Date selection
- ✅ Time selection (15-minute intervals)
- ✅ Format: "MMMM d, yyyy h:mm aa"
- ✅ Example: "October 14, 2025 2:30 PM"

### Usage:
```jsx
import { DateTimePicker } from '../components/ui'

<DateTimePicker
  label="Date & Time"
  selected={formData.dateTime}
  onChange={(date) => setFormData({ ...formData, dateTime: date })}
  required
/>
```

---

## 2. 📅 DatePicker (Date Only - Basic)

**Use for:** Filters, reports, date ranges where time is not needed

### Features:
- ✅ Date selection only (no time)
- ✅ Format: "MMMM d, yyyy"
- ✅ Example: "October 14, 2025"
- ✅ Min/Max date validation
- ✅ Smart date ranges

### Usage:
```jsx
import { DatePicker } from '../components/ui'

<DatePicker
  label="Date From"
  selected={dateFrom}
  onChange={setDateFrom}
  placeholder="Select start date"
  maxDate={dateTo}  // Can't select after dateTo
/>

<DatePicker
  label="Date To"
  selected={dateTo}
  onChange={setDateTo}
  placeholder="Select end date"
  minDate={dateFrom}  // Can't select before dateFrom
/>
```

---

## 3. 🆕 📅 DatePicker with "Today" Button

**Use for:** Marine Claims - Registration Date and any field where quick "today" access is useful

### Features:
- ✅ Date selection only (no time)
- ✅ Format: "MMMM d, yyyy"
- ✅ **"Today" Button** - Sets current date with one click
- ✅ Button with Calendar icon
- ✅ Located next to the label

### Usage:
```jsx
import { DatePicker } from '../components/ui'

<DatePicker
  label="Registration Date"
  selected={formData.registrationDate}
  onChange={(date) => setFormData({ ...formData, registrationDate: date })}
  showTodayButton={true}  // ⭐ Activates Today button
  required
/>
```

### Visual Design:

```
┌─────────────────────────────────────────────────────┐
│ Registration Date                         📅 Today  │ ← Button on top right
├─────────────────────────────────────────────────────┤
│ [Select date                               📅]      │ ← Input field
└─────────────────────────────────────────────────────┘
```

### How it Works:

```javascript
// Internal implementation
const handleTodayClick = (e) => {
  e.preventDefault()
  e.stopPropagation()
  onChange(new Date()) // Sets current date
}
```

When user clicks "Today" button:
1. Prevents calendar from opening
2. Sets the date to current date/time
3. Updates the input field immediately
4. User can still manually select other dates

### Use Cases:
- ✅ **Registration Date** - Most common use
- ✅ **Report Generation** - Quick current date
- ✅ **Log Entry Dates** - Fast timestamp
- ✅ **Event Dates** - When most events are today

---

## 🎨 Shared Premium Design

Both components share the same elegant styling:

### Visual Features:

1. **Glassmorphism Background:**
   - Gradient: slate-800/50
   - Backdrop blur
   - Border: white/10

2. **Calendar Icon:**
   - Lucide Calendar icon
   - Right side
   - Gray color
   - Pointer-events disabled

3. **Focus States:**
   - Cyan border on focus
   - Cyan ring (glow)
   - Smooth transitions

4. **Premium Calendar Popup:**
   - Dark gradient background
   - Backdrop blur
   - Rounded corners
   - Hover effects on dates
   - Selected date: Blue gradient

---

## 📊 Advanced Filters Integration

### Date Range with Smart Validation:

```jsx
// Date From
<DatePicker
  label="Date From"
  selected={filters.dateFrom}
  onChange={(date) => handleFilterChange('dateFrom', date)}
  placeholder="Select start date"
  maxDate={filters.dateTo || null}  // ← Can't select after "Date To"
/>

// Date To
<DatePicker
  label="Date To"
  selected={filters.dateTo}
  onChange={(date) => handleFilterChange('dateTo', date)}
  placeholder="Select end date"
  minDate={filters.dateFrom || null}  // ← Can't select before "Date From"
/>
```

### Benefits:

✅ **Prevents invalid ranges** - User can't select end before start  
✅ **Visual feedback** - Disabled dates are grayed out  
✅ **Intuitive** - Calendar automatically restricts available dates  
✅ **No validation errors** - Impossible to create invalid date range  

---

## 🎯 Example Scenarios

### Scenario 1: Date Range Filter

**Steps:**
1. User selects "Date From: October 1, 2025"
2. "Date To" calendar now disables all dates before October 1
3. User can only select October 1 or later for "Date To"

**Result:** Always valid date range!

### Scenario 2: Changing Date From

**Before:**
- Date From: October 1, 2025
- Date To: October 15, 2025

**User changes Date From to October 20:**
- Date To automatically stays October 15
- But now it's invalid (before Date From)
- User must select new Date To (October 20 or later)

---

## 💻 Technical Details

### Date Conversion for API:

```javascript
// DatePicker returns Date object
const dateFrom = new Date('2025-10-14')

// Convert to YYYY-MM-DD for API
const dateString = dateFrom.toISOString().split('T')[0]
// Result: "2025-10-14"
```

### In API Service:

```javascript
if (filters.dateFrom) {
  const dateFrom = filters.dateFrom instanceof Date 
    ? filters.dateFrom.toISOString().split('T')[0]
    : filters.dateFrom
  url += `&dateFrom=${dateFrom}`
}
```

---

## 🎨 Visual Comparison

### DateTimePicker:
```
┌─────────────────────────────────────┐
│ October 14, 2025 2:30 PM       [📅] │
└─────────────────────────────────────┘
         ↑           ↑
       Date        Time
```

### DatePicker:
```
┌─────────────────────────────────────┐
│ October 14, 2025                [📅] │
└─────────────────────────────────────┘
         ↑
    Date only
```

---

## 🚀 Props Reference

### DateTimePicker Props:

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Field label |
| `selected` | Date | Selected date+time |
| `onChange` | function | Callback when changed |
| `required` | boolean | Is required? |
| `className` | string | Additional CSS classes |

### DatePicker Props:

| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Field label |
| `selected` | Date | Selected date |
| `onChange` | function | Callback when changed |
| `required` | boolean | Is required? |
| `placeholder` | string | Placeholder text |
| `minDate` | Date | Minimum selectable date |
| `maxDate` | Date | Maximum selectable date |
| `className` | string | Additional CSS classes |

---

## ✨ Premium Calendar Styling

Both components use the premium calendar styles from `src/index.css`:

```css
.react-datepicker {
  background: linear-gradient(135deg, ...);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
}

.react-datepicker__day--selected {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: #fff;
  font-weight: 600;
}
```

---

## 🎉 Summary

**Two Components, One Design:**

| Component | Use Case | Has Time? |
|-----------|----------|-----------|
| **DateTimePicker** | Create/Edit Jobs | ✅ Yes |
| **DatePicker** | Filters, Reports | ❌ No |

**Both have:**
- ✅ Premium dark mode design
- ✅ Glassmorphism effects
- ✅ Calendar icon
- ✅ Smooth animations
- ✅ Focus states
- ✅ Elegant popups

**Choose based on need:**
- Need time? → DateTimePicker
- Date only? → DatePicker

**Used in Advanced Filters for smart date range validation!** 📅✨

