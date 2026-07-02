import re

with open('src/pages/UserLoginPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add showPassword state
content = content.replace(
    'const [isLogin, setIsLogin] = useState(true);',
    'const [isLogin, setIsLogin] = useState(true);\n  const [showPassword, setShowPassword] = useState(false);'
)

# Password replacer
def repl_password(m):
    return '''<div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}''' + m.group(1) + '''
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d73a24] focus:outline-none cursor-pointer"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>'''

content = re.sub(r'<input\s+type="password"(.*?/>)', repl_password, content, flags=re.DOTALL)

# Theme colors
content = content.replace('bg-gradient-to-br from-amber-50 to-orange-100', 'bg-gradient-to-br from-[#f5e6a9] to-[#efd582]')
content = content.replace('bg-amber-50', 'bg-[#f5e6a9]/30')
content = content.replace('bg-amber-600 rounded-full', 'bg-[#c42021] rounded-full')
content = content.replace('focus:ring-amber-500 focus:border-amber-500', 'focus:ring-[#d73a24] focus:border-[#d73a24]')
content = content.replace('text-amber-600', 'text-[#d73a24]')
content = content.replace('bg-amber-600', 'bg-[#d73a24]')
content = content.replace('hover:bg-amber-700', 'hover:bg-[#c42021]')

with open('src/pages/UserLoginPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully')
