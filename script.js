// Interactive Minimalistic Click & Keyboard Console script for George Zhong's portfolio

// Matrix Canvas Rain Background Engine
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let animationFrameId = null;
let isMatrixActive = true;

const matrixChars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ*+-/%=<>!#$?".split("");
const fontSize = 14;
let columns = 0;
let drops = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100;
    }
}

function drawMatrix() {
    if (!isMatrixActive) return;
    
    ctx.fillStyle = 'rgba(3, 8, 4, 0.08)';
    ctx.fillRect(0, 0,  canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = 'rgba(51, 255, 102, ' + (Math.random() * 0.4 + 0.4) + ')';
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    
    animationFrameId = requestAnimationFrame(drawMatrix);
}

// Start Matrix rain
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawMatrix();

// --- CLI Keyboard & Click Interactive Logic ---
const termOutput = document.getElementById('term-output');
const termBody = document.getElementById('term-body');

// Shaded, glowing title text for Propofol Dreams (styled using console monospace font)
const asciiLogo = `<div class="welcome-title">Propofol Dreams</div>`;

// Minimalistic clean content database
const contentDatabase = {
    about: `
<p>Dr George Zhong is an anaesthetist based in Sydney, Australia. He is passionate about pushing the boundaries of clinical anaesthesia through cross-disciplinary translational research. He dreams of a future where anaesthesia care is individualised, safe, sustainable as well as accessible to all.</p>`,

    research: `
<p>Current Research Focus:</p>
<ul>
    <li>Development of <a href="https://app.propofoldreams.org/" target="_blank">Propofol Dreams app</a></li>
    <li>TCI pharmacology and algorithms</li>
    <li>Environmental sustainability in anaesthesia</li>
    <li>High risk anaesthesia</li>
</ul>`,

    contact: `
<p>Interested in cross-disciplinary collaboration and research? Let's propofol dream together!</p>
<table style="margin-top: 5px; border-spacing: 10px 5px; font-family: var(--font-mono)">
    <tr><td><strong>Email:</strong></td><td><a href="mailto:george@propofoldreams.org">george@propofoldreams.org</a></td></tr>
    <tr><td><strong>ORCiD:</strong></td><td><a href="https://orcid.org/0000-0003-0286-4606" target="_blank">0000-0003-0286-4606</a></td></tr>
    <tr><td><strong>Website:</strong></td><td><a href="https://propofoldreams.org" target="_blank">propofoldreams.org</a></td></tr>
</table>`,

    pubs: `
<p>Selected Publications:</p>
<table class="pub-table">
    <!-- 2020 -->
    <tr>
        <td class="pub-year">2020</td>
        <td>
            <div class="pub-title">Airway topicalisation via direct injection of local anaesthetic into the lumen of high flow oxygenation devices.</div>
            <div class="pub-details"><em>Anaesthesia and Intensive Care</em>. <a href="https://doi.org/10.1177/0310057x20946049" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <tr>
        <td class="pub-year">2020</td>
        <td>
            <div class="pub-title">Environmental and economic impact of using increased fresh gas flow to reduce CO2 absorbent consumption in the absence of inhalational anaesthetics.</div>
            <div class="pub-details"><em>British Journal of Anaesthesia</em>. <a href="https://doi.org/10.1016/j.bja.2020.07.043" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <!-- 2022 -->
    <tr>
        <td class="pub-year">2022</td>
        <td>
            <div class="pub-title">Environmental and economic impact of using increased fresh gas flow to reduce carbon dioxide absorbent consumption during clinical anaesthesia practice.</div>
            <div class="pub-details"><em>British Journal of Anaesthesia</em>. <a href="https://doi.org/10.1016/j.bja.2022.09.003" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <!-- 2023 -->
    <tr>
        <td class="pub-year">2023</td>
        <td>
            <div class="pub-title">Environmental impact of high-flow nasal oxygenation.</div>
            <div class="pub-details"><em>Anaesthesia</em>. <a href="https://doi.org/10.1111/anae.15963" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <tr>
        <td class="pub-year">2023</td>
        <td>
            <div class="pub-title">Audit of carbon dioxide absorbent replacement triggers and potential impact on wastage.</div>
            <div class="pub-details"><em>British Journal of Anaesthesia</em>. <a href="https://doi.org/10.1016/j.bja.2023.11.031" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <!-- 2024 -->
    <tr>
        <td class="pub-year">2024</td>
        <td>
            <div class="pub-title">General purpose propofol target controlled infusions using the Marsh model with adjusted body weight.</div>
            <div class="pub-details"><em>Journal of Anesthesia</em>. <a href="https://doi.org/10.1007/s00540-024-03312-w" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <!-- 2025 -->
    <tr>
        <td class="pub-year">2025</td>
        <td>
            <div class="pub-title">Simple model for predicting the awakening propofol plasma concentration during target-controlled infusion with the Marsh model.</div>
            <div class="pub-details"><em>British Journal of Anaesthesia</em>. <a href="https://doi.org/10.1016/j.bja.2025.01.007" target="_blank">(doi)</a></div>
        </td>
    </tr>
    <!-- 2026 -->
    <tr>
        <td class="pub-year">2026</td>
        <td>
            <div class="pub-title">Reducing propofol waste during TIVA by pre-operative estimation of requirement: A single-center retrospective analysis.</div>
            <div class="pub-details"><em>Journal of Clinical Anesthesia</em>. <a href="https://doi.org/10.1016/j.jclinane.2026.112160" target="_blank">(doi)</a></div>
        </td>
    </tr>
</table>`
};

// Write output line
function printOutput(htmlContent, className = "") {
    const p = document.createElement('p');
    p.className = `output-line ${className}`;
    p.innerHTML = htmlContent;
    termOutput.appendChild(p);
    termBody.scrollTop = termBody.scrollHeight;
}

// Generate the interactive prompt line at the end
function printPromptLine() {
    // Remove any accidental duplicate prompt blocks
    const activeBlocks = document.querySelectorAll('.terminal-prompt-block');
    activeBlocks.forEach(block => block.remove());

    const div = document.createElement('div');
    div.className = 'terminal-prompt-block';
    div.innerHTML = `
        <div class="quick-menu-line" style="margin-top: 15px; border-top: 1px dashed var(--text-dim); padding-top: 10px; margin-bottom: 5px;">
            <span class="prompt" style="color: var(--text-secondary);">Quick Menu:</span>
            <span class="menu-item">[<span class="term-action" onclick="executeCommand('about')">about</span>]</span>
            <span class="menu-item">[<span class="term-action" onclick="executeCommand('research')">research</span>]</span>
            <span class="menu-item">[<span class="term-action" onclick="executeCommand('publications')">publications</span>]</span>
            <span class="menu-item">[<span class="term-action" onclick="executeCommand('contact')">contact</span>]</span>
            <span class="menu-item">[<span class="term-action" onclick="executeCommand('clear')">clear</span>]</span>
        </div>
        <div class="input-line">
            <span class="prompt">@propofoldreams:~$</span>
            <div class="input-container">
                <input type="text" id="cli-input" autocomplete="off" spellcheck="false" aria-label="Terminal Input">
                <span class="cursor" id="cli-cursor"></span>
            </div>
        </div>
    `;
    termOutput.appendChild(div);
    
    const input = div.querySelector('#cli-input');
    const cursor = div.querySelector('#cli-cursor');
    const inputContainer = div.querySelector('.input-container');
    
    // Clicking prompt container starts blinking and brings up mobile keyboard
    inputContainer.addEventListener('click', () => {
        input.focus();
        activateBlinking();
    });
    
    input.addEventListener('focus', () => {
        activateBlinking();
    });
    
    // Sync cursor offset
    input.addEventListener('input', () => {
        activateBlinking();
        const textWidth = input.value.length * 9.6;
        cursor.style.left = `${textWidth}px`;
    });
    
    // Keydown listener for Enter command submission
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.value;
            freezeActivePrompt(value);
            window.executeCommand(value, true);
        }
    });

    termBody.scrollTop = termBody.scrollHeight;
}

// Activate cursor blinking
function activateBlinking() {
    const activeCursor = document.querySelector('#cli-cursor');
    if (activeCursor) {
        activeCursor.classList.add('blink');
    }
}

// Convert the active prompt to static text and remove its menu
function freezeActivePrompt(commandText) {
    const activeBlock = document.querySelector('.terminal-prompt-block');
    if (activeBlock) {
        const qMenu = activeBlock.querySelector('.quick-menu-line');
        if (qMenu) qMenu.remove();
        
        activeBlock.querySelector('.input-container').innerHTML = `<span>${commandText}</span>`;
        activeBlock.className = 'terminal-prompt-block-frozen';
    }
}

// Execute commands (click or keyboard)
window.executeCommand = function(cmd, alreadyFrozen = false) {
    const cmdClean = cmd.trim();
    const cmdLower = cmdClean.toLowerCase();

    // 1. Freeze the prompt block if command came via click action
    if (!alreadyFrozen) {
        freezeActivePrompt(cmdClean);
    }

    if (cmdClean === "") {
        printPromptLine();
        return;
    }

    // 2. Process actions & Easter eggs
    switch (cmdLower) {
        case 'hello':
            printOutput("Hello world");
            break;
            
        case 'tci':
            printOutput('TCI App: <a href="https://pdtci.netlify.app/" target="_blank">https://pdtci.netlify.app/</a>');
            break;
            
        case 'propofol':
            printOutput(asciiLogo);
            break;
            
        case 'contact':
            printOutput(contentDatabase.contact);
            break;
            
        case 'pub':
        case 'pubs':
        case 'publications':
        case 'publication':
            printOutput(contentDatabase.pubs);
            break;
            
        case 'george':
        case 'zhong':
        case 'about':
            printOutput(contentDatabase.about);
            break;
            
        case 'research':
            printOutput(contentDatabase.research);
            break;
            
        case 'pwa':
        case 'propofol dreams':
            printOutput('Propofol Dreams Web App: <a href="https://app.propofoldreams.org/" target="_blank">https://app.propofoldreams.org/</a>');
            break;
            
        case 'clear':
            termOutput.innerHTML = "";
            break;
            
        default:
            printOutput(`<span class="error">command not found: ${cmdClean}</span>`);
    }

    // 3. Re-append prompt line at bottom
    printPromptLine();
};

// Auto-focus and activate console blinking on key presses (for desktop typing)
window.addEventListener('keydown', (e) => {
    const activeInput = document.querySelector('#cli-input');
    if (activeInput && document.activeElement !== activeInput) {
        // Intercept standard printable characters (letters, numbers, space)
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            activeInput.focus();
            activateBlinking();
        }
    }
});

// Initial Bootup
window.onload = () => {
    printOutput(asciiLogo);
    printPromptLine();
};
