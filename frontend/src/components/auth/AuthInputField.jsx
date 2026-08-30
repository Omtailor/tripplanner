export default function AuthInputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  style,
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="glass-input"
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={showPasswordToggle ? { ...style, paddingRight: 50 } : style}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: 'absolute', right: 14, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              cursor: 'pointer', padding: 4,
              color: 'rgba(255,255,255,0.5)',
              fontSize: 18, lineHeight: 1,
              transition: 'color 0.2s',
            }}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14, fontWeight: 700,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 10,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}
