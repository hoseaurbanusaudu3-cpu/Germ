# Form Auto-Save Feature Guide

## Overview
The form auto-save feature automatically saves form data to browser localStorage, ensuring that users don't lose their work if they:
- Accidentally refresh the page
- Navigate away from the form
- Close the browser tab
- Experience a connection issue

## How It Works

### 1. Auto-Save Hook (`useFormAutoSave`)
- Saves form data every **2 seconds** after the last change (debounced)
- Saves immediately when user navigates away
- Stores data in browser's localStorage
- Each form has a unique key to prevent conflicts

### 2. Restore Hook (`useRestoreFormData`)
- Automatically loads saved data when component mounts
- Returns null if no saved data exists

## Usage Example

### For Score Entry Form:

```tsx
import { useState, useEffect } from 'react';
import { useFormAutoSave, useRestoreFormData } from '../hooks/useFormAutoSave';

function ScoreEntryForm() {
  const [scores, setScores] = useState({
    studentId: '',
    ca1: '',
    ca2: '',
    exam: '',
  });

  // Restore saved data on mount
  const savedData = useRestoreFormData<typeof scores>('score-entry-form');
  
  useEffect(() => {
    if (savedData) {
      setScores(savedData);
      // Optional: Show notification
      toast.info('Restored your previous work');
    }
  }, []);

  // Auto-save form data
  const { clearSavedData } = useFormAutoSave('score-entry-form', scores);

  const handleSubmit = async () => {
    try {
      await submitScores(scores);
      // Clear saved data after successful submission
      clearSavedData();
      toast.success('Scores submitted successfully');
    } catch (error) {
      toast.error('Failed to submit scores');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Forms That Should Use Auto-Save

1. **Score Entry** - `score-entry-form-{classId}-{termId}`
2. **Student Registration** - `student-registration-form`
3. **Fee Structure** - `fee-structure-form-{classId}`
4. **Payment Entry** - `payment-entry-form`
5. **Result Comments** - `result-comments-form-{studentId}`
6. **Class Assignment** - `class-assignment-form`

## Best Practices

### 1. Use Unique Keys
```tsx
// Good - includes identifiers
useFormAutoSave(`score-entry-${classId}-${termId}`, formData);

// Bad - generic key (conflicts possible)
useFormAutoSave('form', formData);
```

### 2. Clear Data After Success
```tsx
const { clearSavedData } = useFormAutoSave('my-form', formData);

const handleSubmit = async () => {
  await api.submit(formData);
  clearSavedData(); // Important!
};
```

### 3. Show Restore Notification
```tsx
useEffect(() => {
  if (savedData) {
    setFormData(savedData);
    toast.info('Restored your previous work', {
      action: {
        label: 'Discard',
        onClick: () => clearSavedData()
      }
    });
  }
}, []);
```

### 4. Handle Multiple Forms
```tsx
// Different forms on same page
useFormAutoSave('student-info', studentData);
useFormAutoSave('parent-info', parentData);
useFormAutoSave('health-info', healthData);
```

## Technical Details

### Storage Location
- Data stored in: `localStorage`
- Key format: `{formKey}` (e.g., `score-entry-form`)
- Data format: JSON string

### Storage Limits
- localStorage limit: ~5-10MB per domain
- Each form typically uses: <50KB
- Can store: 100+ forms easily

### Privacy & Security
- Data stored locally in user's browser
- Not sent to server until form submission
- Cleared on logout (optional)
- Cleared after successful submission

## Troubleshooting

### Form Data Not Saving
1. Check browser console for errors
2. Verify localStorage is enabled
3. Check if form key is unique
4. Ensure form data is serializable (no functions, circular refs)

### Form Data Not Restoring
1. Check if `useRestoreFormData` is called before render
2. Verify the same form key is used
3. Check browser console for parse errors

### Clear All Saved Forms
```tsx
// Clear specific form
localStorage.removeItem('score-entry-form');

// Clear all forms (use with caution)
Object.keys(localStorage).forEach(key => {
  if (key.endsWith('-form')) {
    localStorage.removeItem(key);
  }
});
```

## Future Enhancements

- [ ] Add expiration time for saved data
- [ ] Compress large form data
- [ ] Sync to server for cross-device access
- [ ] Add visual indicator when auto-saving
- [ ] Conflict resolution for concurrent edits
