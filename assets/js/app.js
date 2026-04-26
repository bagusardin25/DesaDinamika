/**
 * DesaDinamika - Prototype Logic
 * Handles view switching, wizard progression, and live simulation
 */

const app = {
    currentView: 'view-landing',
    simulationInterval: null,
    simTime: 0,
    
    agents: [
        { name: 'Pak Budi', role: 'Petani', img: '33', status: 'happy' },
        { name: 'Bu Siti', role: 'Pedagang', img: '47', status: 'happy' },
        { name: 'Rudi', role: 'Pemuda', img: '12', status: 'happy' },
        { name: 'Pak Karto', role: 'Buruh', img: '59', status: 'neutral' },
        { name: 'Bu Ningsih', role: 'UMKM', img: '22', status: 'happy' }
    ],

    init() {
        // Initialize Navigation Listeners
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.getAttribute('data-target');
                if(target) this.switchView(target);
            });
        });
    },

    switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        // Update nav active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if(btn.getAttribute('data-target') === viewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show target view
        const targetView = document.getElementById(viewId);
        if(targetView) {
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
        }

        this.currentView = viewId;

        // Stop simulation if leaving simulation view
        if(viewId !== 'view-simulation' && this.simulationInterval) {
            this.endSimulation(true); // silent end
        }
    },

    // Wizard Logic
    addCustomAgent() {
        const input = document.getElementById('new-agent-name');
        const name = input.value.trim();
        if(!name) return;

        const grid = document.getElementById('demography-sliders');
        const idSafe = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const newSlider = document.createElement('div');
        newSlider.className = 'slider-group';
        newSlider.innerHTML = `
            <label>${name} (<span id="val-${idSafe}">10</span>%)</label>
            <input type="range" min="0" max="100" value="10" oninput="document.getElementById('val-${idSafe}').innerText = this.value">
        `;
        grid.appendChild(newSlider);
        
        // Add to agents array so they appear in simulation
        this.agents.push({
            name: `Perwakilan ${name}`,
            role: name,
            img: Math.floor(Math.random() * 70) + 1, // random avatar
            status: 'neutral'
        });
        
        input.value = '';
    },

    nextStep(stepNumber) {
        // Update Stepper UI
        document.querySelectorAll('.step').forEach(step => {
            const num = parseInt(step.getAttribute('data-step'));
            if(num <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Show Content
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.add('hidden');
            step.classList.remove('active');
        });

        const targetStep = document.getElementById(`step-${stepNumber}`);
        if(targetStep) {
            targetStep.classList.remove('hidden');
            targetStep.classList.add('active');
        }

        // Simulate loading on Step 3
        if(stepNumber === 3) {
            const btn = document.querySelector('.launch-btn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menyiapkan Agen...';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-play"></i> Mulai Simulasi Balai Desa';
            }, 1500);
        }
    },

    // Simulation Logic
    startSimulation() {
        this.switchView('view-simulation');
        this.simTime = 0;
        this.updateTimerDisplay();
        
        // Reset UI
        document.getElementById('chat-messages').innerHTML = '';
        this.populateAgents();
        this.resetGauges();

        // Initial System Message
        this.addChatMessage('Sistem', 'Simulasi Musyawarah dimulai. 500 warga virtual telah hadir di Balai Desa.', 'system');
        
        // Start Timer
        this.simulationInterval = setInterval(() => {
            this.simTime++;
            this.updateTimerDisplay();
            this.simulationTick();
        }, 1000); // 1 tick = 1 real second for fast demo
    },

    endSimulation(silent = false) {
        clearInterval(this.simulationInterval);
        this.simulationInterval = null;
        if(!silent) {
            this.switchView('view-report');
        }
    },

    updateTimerDisplay() {
        const mins = Math.floor(this.simTime / 60).toString().padStart(2, '0');
        const secs = (this.simTime % 60).toString().padStart(2, '0');
        document.getElementById('sim-timer').innerText = `${mins}:${secs}`;
    },

    populateAgents() {
        const list = document.getElementById('agent-list');
        list.innerHTML = '';
        
        this.agents.forEach(agent => {
            const el = document.createElement('div');
            el.className = `agent-item ${agent.status}`;
            el.id = `agent-${agent.name.replace(/\s+/g, '-')}`;
            el.innerHTML = `
                <img src="https://i.pravatar.cc/150?img=${agent.img}" alt="${agent.name}">
                <div class="info">
                    <h4>${agent.name}</h4>
                    <p>${agent.role}</p>
                </div>
            `;
            list.appendChild(el);
        });
    },

    addChatMessage(sender, text, type = 'normal', img = 'default') {
        const chatBox = document.getElementById('chat-messages');
        const el = document.createElement('div');
        el.className = 'message';
        
        if (type === 'system') {
            el.innerHTML = `
                <div style="width:100%; display:flex; justify-content:center; margin-bottom: 0.5rem;">
                    <div style="background: rgba(0,0,0,0.3); padding: 0.3rem 0.8rem; border-radius: 12px; color: #E2E8F0; font-size: 0.75rem; text-align:center;">
                        <i class="fa-solid fa-circle-info text-warning"></i> ${text}
                    </div>
                </div>
            `;
            el.style.maxWidth = "100%";
        } else {
            const titleClass = type === 'danger' ? 'danger' : '';
            const imgSrc = img === 'default' ? 'https://i.pravatar.cc/150?img=11' : `https://i.pravatar.cc/150?img=${img}`;
            
            el.innerHTML = `
                <img src="${imgSrc}" alt="${sender}" style="width: 36px; height: 36px; border-radius: 50%; align-self: flex-start;">
                <div class="message-bubble" style="background: #1E293B; padding: 0.5rem 0.8rem; border-radius: 0 12px 12px 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); min-width: 150px; position: relative;">
                    <h5 class="${titleClass}" style="margin: 0 0 0.2rem 0; font-size: 0.85rem; color: var(--primary);">${sender}</h5>
                    <p style="margin: 0; font-size: 0.95rem; padding-bottom: 0.8rem;">${text}</p>
                    <div style="position: absolute; bottom: 0.3rem; right: 0.6rem; font-size: 0.65rem; color: var(--text-muted);">
                        ${document.getElementById('sim-timer').innerText} <i class="fa-solid fa-check-double text-success" style="margin-left:2px;"></i>
                    </div>
                </div>
            `;
        }
        
        chatBox.appendChild(el);
        chatBox.scrollTop = chatBox.scrollHeight;
    },

    showTypingIndicator() {
        document.getElementById('typing-indicator').classList.remove('hidden');
    },
    
    hideTypingIndicator() {
        document.getElementById('typing-indicator').classList.add('hidden');
    },

    simulationTick() {
        // Scripted events based on time
        if(this.simTime === 2) {
            this.showTypingIndicator();
        }
        if(this.simTime === 4) {
            this.hideTypingIndicator();
            this.addChatMessage('Pak Budi (Petani)', 'Saya setuju kalau sisa anggarannya buat BUMDes pupuk, petani butuh subsidi mas.', 'normal', '33');
            this.updateGauge('Kepuasan Petani', 85);
        }
        
        if(this.simTime === 8) {
            this.showTypingIndicator();
        }
        if(this.simTime === 10) {
            this.hideTypingIndicator();
            this.addChatMessage('Rudi (Pemuda)', 'Loh Pak Kades, kalau jalan gang mawar nggak diperbaiki, gimana kami mau lewat kerja shift malam? Jalannya hancur!', 'danger', '12');
            this.updateAgentStatus('Rudi', 'angry');
            this.updateGauge('Risiko Konflik', 40);
        }
        
        if(this.simTime === 15) {
            this.addChatMessage('Bu Siti (Pedagang)', 'Betul kata Rudi, kasihan yang jualan keliling gerobaknya nyangkut terus di lubang.', 'danger', '47');
            this.updateAgentStatus('Bu Siti', 'angry');
            this.updateGauge('Risiko Konflik', 55);
        }

        // Auto end for demo purposes if left too long
        if(this.simTime === 60) {
            this.endSimulation();
        }
    },

    injectCrisis(type) {
        if(!this.simulationInterval) return;
        
        this.addChatMessage('Sistem', `INTERVENSI: Situasi krisis (${type}) disuntikkan.`, 'system');
        
        if(type === 'hoax') {
            setTimeout(() => {
                this.addChatMessage('Pak Karto (Buruh)', 'Ada info di grup WA, katanya uang jalan mau dikorupsi buat beli mobil dinas BUMDes! Betul itu?', 'danger', '59');
                this.updateAgentStatus('Pak Karto', 'angry');
                this.updateGauge('Risiko Konflik', 82);
                this.updateGauge('Kepuasan Petani', 75);
            }, 2000);
        } else if(type === 'subsidi') {
            setTimeout(() => {
                this.addChatMessage('Sistem', 'Kades mengumumkan janji subsidi tambahan tunai.', 'system');
                this.updateGauge('Risiko Konflik', 30);
                this.updateGauge('Kepuasan Petani', 95);
            }, 1500);
        } else if (type === 'protes') {
            setTimeout(() => {
                this.addChatMessage('Rudi (Pemuda)', 'KAMI AKAN DEMO BESOK DI BALAI DESA JIKA JALAN TIDAK DIASPAL!', 'danger', '12');
                this.updateGauge('Risiko Konflik', 90);
            }, 1000);
        }
    },

    updateAgentStatus(name, status) {
        const idName = name.split(' ')[0].replace(/\s+/g, '-');
        const agentDiv = document.querySelector(`.agent-item[id*="${idName}"]`);
        if(agentDiv) {
            agentDiv.className = `agent-item ${status}`;
        }
    },

    updateGauge(name, value) {
        const gauges = document.querySelectorAll('.gauge');
        gauges.forEach(gauge => {
            const label = gauge.querySelector('span:last-child').innerText;
            if(label === name) {
                const circle = gauge.querySelector('.circular-progress');
                const text = gauge.querySelector('.progress-value');
                
                // Determine traffic light state
                let state = 'success'; // default green
                if (name === 'Risiko Konflik') {
                    if (value >= 60) state = 'danger';
                    else if (value >= 30) state = 'warning';
                } else {
                    // For Satisfaction/Kepuasan
                    if (value <= 40) state = 'danger';
                    else if (value <= 70) state = 'warning';
                }

                // Update degree
                const degree = (value / 100) * 360;
                let colorVar = 'var(--primary)';
                if (state === 'danger') colorVar = 'var(--danger)';
                if (state === 'warning') colorVar = 'var(--warning)';
                
                circle.style.background = `conic-gradient(${colorVar} ${degree}deg, rgba(255,255,255,0.1) 0deg)`;
                text.innerText = `${value}%`;
                
                // Reset classes
                text.className = 'progress-value';
                circle.className = 'circular-progress';
                
                // Apply new classes
                if(state === 'danger') {
                    text.classList.add('text-danger');
                    circle.classList.add('danger');
                } else if (state === 'warning') {
                    text.classList.add('text-warning');
                    circle.classList.add('warning');
                } else {
                    text.classList.add('text-success');
                }
            }
        });
    },
    
    resetGauges() {
        this.updateGauge('Kepuasan Petani', 75);
        this.updateGauge('Risiko Konflik', 15);
    }
};

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
