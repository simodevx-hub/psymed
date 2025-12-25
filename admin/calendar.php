<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - TherapieMarocOnline</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
    <style>
        body { margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; font-family: 'DM Sans', sans-serif; }
        
        /* Sidebar */
        #sidebar {
            width: 300px;
            background: #f8f9fa;
            border-right: 1px solid #ddd;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            box-shadow: 2px 0 5px rgba(0,0,0,0.05);
            z-index: 10;
        }

        #sidebar h2 { margin-top: 0; font-size: 1.5rem; color: var(--color-primary); }
        
        .tool-section { margin-bottom: 2rem; }
        .tool-title { font-weight: bold; margin-bottom: 0.5rem; display: block; color: #555; }
        
        .btn-tool {
            display: block;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
            font-size: 0.9rem;
        }
        .btn-tool:hover { background: #eee; border-color: #ccc; }
        .btn-tool.danger { border-color: #ffcccc; color: #d9534f; }
        .btn-tool.danger:hover { background: #fff0f0; }

        .btn-tool i { margin-right: 8px; }

        /* Main Content */
        #main { flex: 1; padding: 1rem; position: relative; overflow-y: auto; }
        #calendar { height: 100%; }

        /* Calendar Styling */
        .fc-event { cursor: pointer; border: none !important; }
        .fc-event-main { background: var(--color-green); color: white; padding: 4px; border-radius: 4px; }
        .fc-event:hover .fc-event-main { background: #2e7d32; }
        
        .fc-timegrid-slot { height: 40px !important; } /* Taller slots */
    </style>
</head>
<body>

    <div id="sidebar">
        <h2>Administration</h2>
        <p style="font-size: 0.9rem; color: #666; margin-bottom: 2rem;">Gérez vos disponibilités en temps réel.</p>

        <div class="tool-section">
            <span class="tool-title">⚡ Actions Rapides</span>
            <button class="btn-tool" onclick="clearCurrentView()">
                🧹 Vider la semaine visible
            </button>
        </div>

        <div class="tool-section">
            <span class="tool-title">⚠️ Maintenance</span>
            <button class="btn-tool danger" onclick="cleanHistory()">
                🗑️ Supprimer tout le passé
            </button>
        </div>
        
        <div style="margin-top: auto;">
             <a href="../rdv.html" target="_blank" class="btn btn-outline" style="display:block; text-align:center;">Voir coté Client ↗</a>
        </div>
    </div>

    <div id="main">
        <div id="calendar"></div>
    </div>

    <script>
        let calendar;
        const SLOT_DURATION = '01:00'; // 1 hour slots

        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                locale: 'fr',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,dayGridMonth'
                },
                slotMinTime: '08:00:00',
                slotMaxTime: '20:00:00',
                allDaySlot: false,
                slotDuration: SLOT_DURATION,
                selectable: true,
                selectMirror: true,
                nowIndicator: true,
                
                // Load events
                events: '../api/slots.php',

                // Click on empty space -> Create Slot
                select: async function(info) {
                    let start = info.startStr;
                    let end = info.endStr;
                    
                    // Prevent past
                    if(info.start < new Date()) {
                        calendar.unselect();
                        return; 
                    }

                    if(confirm("Ajouter un créneau de " + formatTime(info.start) + " à " + formatTime(info.end) + " ?")) {
                         await addSlot(start, end);
                    }
                    calendar.unselect();
                },

                // Click on event -> Delete
                eventClick: async function(info) {
                    if(confirm("Supprimer ce créneau ?")) {
                        await deleteSlot(info.event.id);
                        info.event.remove();
                    }
                }
            });
            calendar.render();
        });

        // --- API Helpers ---
        // Simple security for this phase: Prompt on load
        const API_KEY = prompt("Veuillez entrer la clé de sécurité Admin (ex: PsyMed...):", "PsyMed_Secr3t_K3y_2025");

        async function addSlot(start, end) {
            try {
                const res = await fetch('../api/slots.php', {
                    method: 'POST', 
                    headers: {
                        'Authorization': 'Bearer ' + API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'add', start, end })
                });
                if(!res.ok) throw new Error("Auth failed");
                calendar.refetchEvents();
            } catch(e) { console.error(e); alert('Erreur ajout'); }
        }

        async function deleteSlot(id) {
            try {
                await fetch('../api/slots.php', {
                     method: 'POST', 
                     headers: {
                        'Authorization': 'Bearer ' + API_KEY,
                        'Content-Type': 'application/json'
                    },
                     body: JSON.stringify({ action: 'delete', id })
                });
            } catch(e) { console.error(e); alert('Erreur suppression'); }
        }

        // --- Tools ---

        function formatTime(date) {
            return date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
        }

        async function cleanHistory() {
             if(!confirm("Supprimer tout le passé ?")) return;
             await fetch('../api/slots.php', { 
                 method: 'POST', 
                 headers: {
                    'Authorization': 'Bearer ' + API_KEY,
                    'Content-Type': 'application/json'
                },
                 body: JSON.stringify({ action: 'cleanup' }) 
            });
             calendar.refetchEvents();
             alert('Nettoyé !');
        }

        async function clearCurrentView() {
            if(!confirm("Attention: Cela va supprimer TOUS les créneaux visibles sur cette vue. Continuer ?")) return;
            // Get all visible events
            let events = calendar.getEvents();
            for(let e of events) {
                // Delete one by one (ideal would be batch delete but let's keep it simple for now as we don't have batch_delete API)
                // Actually we can just loop calls.
                deleteSlot(e.id);
            }
            // Optimization: could add batch_delete to PHP later.
            setTimeout(() => calendar.refetchEvents(), 500);
        }

    </script>
</body>
</html>
