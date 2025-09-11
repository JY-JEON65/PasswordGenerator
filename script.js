const SUPABASE_URL = "https://khytzjktxmqdaftjfmsq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoeXR6amt0eG1xZGFmdGpmbXNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxOTc1NTAsImV4cCI6MjA2OTc3MzU1MH0.GXMY5r3cgivmcGBRULqDB5faBUTYR9jf3MHxt4dtfBc";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    // 회원가입 버튼 클릭 시 회원가입 폼 보여주기
    showSignupBtn.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    // 로그인 버튼 클릭 시 로그인 폼 보여주기
    showLoginBtn.addEventListener('click', () => {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // --- SUPABASE & CONSTANTS ---
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const NUMBERS = '0123456789';
    const SPECIAL_CHARACTERS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ENCRYPTION_KEY = 'a-very-secret-key-that-is-not-so-secret';

    // --- DOM ELEMENTS ---
    // Auth
    const authContainer = document.getElementById('auth-container');
    const authCard = document.getElementById('auth-card');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const authErrorLogin = document.getElementById('auth-error-login');
    const authErrorSignup = document.getElementById('auth-error-signup');
    const logoutButton = document.getElementById('logout-button');
    const userIdentifier = document.getElementById('user-identifier');

    // App
    const appContainer = document.getElementById('app-container');
    const programNameInput = document.getElementById('program-name');
    const errorMessage = document.getElementById('error-message');
    const passwordDisplay = document.getElementById('password-display');
    const copyButton = document.getElementById('copy-button');
    const copyButtonText = document.getElementById('copy-button-text');
    const generateButton = document.getElementById('generate-button');
    const passwordListContainer = document.getElementById('password-list-container');

    // --- STATE ---
    let savedPasswords = [];
    let currentUser = null;

    // --- ICONS ---
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;
    const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>`;

    // --- HELPERS ---
    const encryptData = (text) => CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    const decryptData = (ciphertext) => {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedText) { throw new Error("Decryption resulted in empty string"); }
            return decryptedText;
        } catch (e) { console.error("Failed to decrypt data", e); return "복호화 오류"; }
    };
    const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '');

    // --- RENDER & UI FUNCTIONS ---
    const renderPasswordList = () => {
        passwordListContainer.innerHTML = '';
        if (savedPasswords.length === 0) {
            passwordListContainer.innerHTML = `
                <div class="text-center py-10 px-4 h-full flex flex-col justify-center items-center">
                    <p class="text-slate-400">저장된 비밀번호가 없습니다.</p>
                    <p class="text-slate-500 text-sm mt-2">새 비밀번호를 생성하면 여기에 표시됩니다.</p>
                </div>`;
            return;
        }
        const sorted = [...savedPasswords].sort((a, b) => decryptData(a.encryptedName).toLowerCase().localeCompare(decryptData(b.encryptedName).toLowerCase()));
        sorted.forEach(item => {
            const decryptedName = decryptData(item.encryptedName);
            const itemEl = document.createElement('div');
            itemEl.className = 'bg-slate-900/70 p-4 rounded-lg flex items-center justify-between gap-4 animate-fade-in';
            itemEl.innerHTML = `
                <div class="flex-grow min-w-0">
                    <p class="font-semibold text-white break-words">${decryptedName}</p>
                    <div class="flex items-center gap-2 font-mono text-sm">
                        <span class="text-slate-300 w-24" data-id="${item.id}" data-role="password-text">********</span>
                        <button data-action="toggle" data-id="${item.id}" class="p-1 text-slate-400 hover:text-indigo-400 transition-colors" aria-label="Show password">${eyeIcon}</button>
                    </div>
                    <p class="text-slate-500 text-xs mt-1">${formatTimestamp(item.timestamp)}</p>
                </div>
                <div class="flex items-center flex-shrink-0 gap-2">
                    <button data-action="copy" data-id="${item.id}" class="flex items-center px-2 py-1 text-xs font-semibold rounded-md transition-colors bg-slate-600 hover:bg-slate-500 text-slate-200">${copyIcon}<span>복사</span></button>
                    <button data-action="delete" data-id="${item.id}" class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/50 rounded-md transition-colors" aria-label="Delete password for ${decryptedName}">${trashIcon}</button>
                </div>
            `;
            passwordListContainer.appendChild(itemEl);
        });
    };

    const setAuthError = (message, type = 'login') => {
        const el = type === 'login' ? authErrorLogin : authErrorSignup;
        el.textContent = message;
    }

    // --- AUTH HANDLERS ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError('', 'login');
        const email = loginForm.elements['login-email'].value;
        const password = loginForm.elements['login-password'].value;
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) setAuthError(error.message, 'login');
        else loginForm.reset();
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setAuthError('', 'signup');
        const email = signupForm.elements['signup-email'].value;
        const password = signupForm.elements['signup-password'].value;
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) setAuthError(error.message, 'signup');
        else alert('회원가입이 완료되었습니다. 로그인해주세요.');
    };

    const handleLogout = async () => {
        // Try the official sign-out method first.
        const { error } = await supabaseClient.auth.signOut();

        // Manually remove the session from localStorage as a fallback.
        // This makes the logout process more robust.
        const supabaseLocalStorageKey = 'sb-khytzjktxmqdaftjfmsq-auth-token';
        localStorage.removeItem(supabaseLocalStorageKey);

        // If there was an error, log it to the console for debugging,
        // but don't block the user from logging out.
        if (error && error.message !== 'Auth session missing!') {
            console.error('Logout error:', error.message);
        }

        // Reload the page to reset the UI and complete the logout.
        location.reload();
    };

    // --- APP HANDLERS ---
    const handleGeneratePassword = async () => {
        if (!currentUser) return;
        const trimmedProgramName = programNameInput.value.trim();
        if (!trimmedProgramName) {
            errorMessage.textContent = '프로그램 이름을 입력해주세요.';
            programNameInput.classList.add('border-red-500');
            return;
        }
        errorMessage.textContent = '';
        programNameInput.classList.remove('border-red-500');

        // 비밀번호 입력란 값 사용 (직접 입력 or 자동 생성)
        let newPassword = passwordDisplay.value;
        if (!newPassword) {
            // 자동 생성
            const charSets = [LOWERCASE_LETTERS, UPPERCASE_LETTERS, NUMBERS, SPECIAL_CHARACTERS];
            const length = Math.floor(Math.random() * 9) + 8;
            const guaranteedChars = charSets.map(set => set[Math.floor(Math.random() * set.length)]);
            const allChars = charSets.join('');
            let randomChars = Array.from({ length: length - guaranteedChars.length }, () => allChars[Math.floor(Math.random() * allChars.length)]);
            newPassword = [...guaranteedChars, ...randomChars].sort(() => Math.random() - 0.5).join('');
            passwordDisplay.value = newPassword;
        }

        copyButton.disabled = false;
        copyButton.classList.remove('bg-slate-600', 'text-slate-400', 'cursor-not-allowed');
        copyButton.classList.add('bg-slate-700', 'hover:bg-slate-600', 'text-slate-200');
        copyButtonText.textContent = '복사';

        const encryptedNewPassword = encryptData(newPassword);
        const now = new Date().toISOString();
        const existingItem = savedPasswords.find(p => decryptData(p.encryptedName) === trimmedProgramName);

        if (existingItem) {
            const { data, error } = await supabaseClient.from('passwords').update({ encrypted_password: encryptedNewPassword, timestamp: now }).eq('id', existingItem.id).select();
            if (error) return alert('업데이트 실패: ' + error.message);
            if(data && data.length > 0) {
                const updatedItem = data[0];
                existingItem.encryptedPassword = updatedItem.encrypted_password;
                existingItem.timestamp = new Date(updatedItem.timestamp).getTime();
            }
        } else {
            const newEntry = { id: self.crypto.randomUUID(), user_id: currentUser.id, encrypted_name: encryptData(trimmedProgramName), encrypted_password: encryptedNewPassword, timestamp: now };
            const { data, error } = await supabaseClient.from('passwords').insert(newEntry).select();
            if (error) return alert('저장 실패: ' + error.message);
            if(data && data.length > 0) {
                const newItem = data[0];
                savedPasswords.push({ id: newItem.id, encryptedName: newItem.encrypted_name, encryptedPassword: newItem.encrypted_password, timestamp: new Date(newItem.timestamp).getTime() });
            }
        }
        renderPasswordList();

        // 입력란 초기화 추가
        programNameInput.value = '';
        passwordDisplay.value = '';
        copyButton.disabled = true;
        copyButton.classList.add('bg-slate-600', 'text-slate-400', 'cursor-not-allowed');
        copyButton.classList.remove('bg-slate-700', 'hover:bg-slate-600', 'text-slate-200');
        copyButtonText.textContent = '복사';
    };

    const handleCopyToClipboard = () => {
        if (!passwordDisplay.value) return;
        navigator.clipboard.writeText(passwordDisplay.value).then(() => {
            copyButtonText.textContent = '복사됨!';
            copyButton.classList.add('bg-green-600', 'text-white');
            setTimeout(() => {
                copyButtonText.textContent = '복사';
                copyButton.classList.remove('bg-green-600', 'text-white');
                copyButton.classList.add('bg-slate-700', 'hover:bg-slate-600');
            }, 2000);
        });
    };
    
    const handleListActions = async (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;
        const { action, id } = button.dataset;
        const item = savedPasswords.find(p => p.id === id);
        if (!item) return;

        if (action === 'delete') {
            const { error } = await supabaseClient.from('passwords').delete().eq('id', id);
            if (error) return alert('삭제 실패: ' + error.message);
            savedPasswords = savedPasswords.filter(p => p.id !== id);
            renderPasswordList();
        }
        if (action === 'copy') {
            navigator.clipboard.writeText(decryptData(item.encryptedPassword)).then(() => {
                const copySpan = button.querySelector('span');
                copySpan.textContent = '복사됨!';
                button.classList.add('bg-green-600', 'text-white');
                setTimeout(() => {
                    copySpan.textContent = '복사';
                    button.classList.remove('bg-green-600', 'text-white');
                    button.classList.add('bg-slate-600', 'hover:bg-slate-500');
                }, 2000);
            });
        }
        if (action === 'toggle') {
            const passwordTextEl = document.querySelector(`span[data-id='${id}'][data-role='password-text']`);
            const isVisible = passwordTextEl.textContent !== '********';
            passwordTextEl.textContent = isVisible ? '********' : decryptData(item.encryptedPassword);
            button.innerHTML = isVisible ? eyeIcon : eyeOffIcon;
        }
    };

    // --- INITIALIZATION ---
    const initAppForUser = async (user) => {
        currentUser = user;
        userIdentifier.textContent = user.email;
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        appContainer.classList.add('animate-fade-in');

        // 입력란 초기화
        programNameInput.value = '';
        passwordDisplay.value = '';
        copyButton.disabled = true;
        copyButton.classList.add('bg-slate-600', 'text-slate-400', 'cursor-not-allowed');
        copyButton.classList.remove('bg-slate-700', 'hover:bg-slate-600', 'text-slate-200');
        copyButtonText.textContent = '복사';

        // 현재 로그인한 사용자(user.id)만 조회
        const { data, error } = await supabaseClient
            .from('passwords')
            .select('*')
            .eq('user_id', user.id); // ← 이 부분 추가

        if (error) {
            alert('데이터 로딩 실패: ' + error.message);
            savedPasswords = [];
        } else {
            savedPasswords = data.map(item => ({
                id: item.id,
                encryptedName: item.encrypted_name,
                encryptedPassword: item.encrypted_password,
                timestamp: new Date(item.timestamp).getTime()
            }));
        }
        renderPasswordList();
    };

    const initAuth = () => {
        currentUser = null;
        appContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
        authContainer.classList.add('animate-fade-in');

        // 입력란 초기화 추가
        programNameInput.value = '';
        passwordDisplay.value = '';
        copyButton.disabled = true;
        copyButton.classList.add('bg-slate-600', 'text-slate-400', 'cursor-not-allowed');
        copyButton.classList.remove('bg-slate-700', 'hover:bg-slate-600', 'text-slate-200');
        copyButtonText.textContent = '복사';
    };

    // Attach listeners
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    logoutButton.addEventListener('click', handleLogout);
    showSignupBtn.addEventListener('click', () => authCard.classList.add('is-flipped'));
    showLoginBtn.addEventListener('click', () => authCard.classList.remove('is-flipped'));
    
    generateButton.addEventListener('click', handleGeneratePassword);
    copyButton.addEventListener('click', handleCopyToClipboard);
    passwordListContainer.addEventListener('click', handleListActions);
    programNameInput.addEventListener('input', () => {
        if (errorMessage.textContent) {
            errorMessage.textContent = '';
            programNameInput.classList.remove('border-red-500');
        }
    });

    // Check auth state on load
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
            initAppForUser(session.user);
        } else {
            initAuth();
        }
    });
});