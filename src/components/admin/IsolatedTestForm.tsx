// COMPLETELY ISOLATED TEST - NO IMPORTS, NO DEPENDENCIES
export function IsolatedTestForm() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ marginBottom: '20px' }}>🧪 Isolated Input Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Test 1: Pure HTML Input (No React State)</p>
        <input
          type="text"
          placeholder="Type 'JSS 1 A' here continuously..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          ✅ This should work perfectly - it's pure HTML with NO React state
        </p>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Test 2: Another Pure HTML Input</p>
        <input
          type="text"
          placeholder="Type your full name here..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Test 3: Textarea</p>
        <textarea
          placeholder="Type a long sentence here..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>📋 Instructions:</h3>
        <ol style={{ marginLeft: '20px' }}>
          <li>Try typing continuously in each field</li>
          <li>Type "JSS 1 A" without stopping</li>
          <li>If these work, the problem is in our custom components</li>
          <li>If these DON'T work, something else is interfering</li>
        </ol>
      </div>
    </div>
  );
}
