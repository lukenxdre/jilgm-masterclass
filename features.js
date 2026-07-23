/**
 * JILGM Masterclass Modular Features Library
 * Fully decoupled and role-secure modular components.
 */

(function () {
    const Features = {
        isMilestoneTriggered: false,
        db: null,

        // Initialize features
        init: async function () {
            // Wait for Firebase to be ready via the auth.js init promise first
            if (window.firebaseInitPromise) {
                try {
                    await window.firebaseInitPromise;
                } catch (err) {
                    console.error("Firebase init error in features.js:", err);
                }
            }
            if (typeof firebase === 'undefined' && window.syncPromise) {
                try {
                    await window.syncPromise;
                } catch (err) {
                    console.error("Firebase sync error in features.js:", err);
                }
            }

            if (typeof firebase !== 'undefined') {
                this.db = firebase.firestore();
                console.log("Features module initialized Firestore connection successfully.");
            } else {
                console.warn("Firebase compat SDK not loaded. Mocking db features.");
                return;
            }

            const currentUser = window.AuthAPI ? window.AuthAPI.getCurrentUser() : null;
            const currentInstructor = window.AuthAPI ? window.AuthAPI.getCurrentInstructor() : null;

            // Route-specific initializations
            const path = window.location.pathname;
            if (path.includes('dashboard.html')) {
                if (currentUser) {
                    this.initStudentDashboard(currentUser);
                }
            } else if (path.includes('module.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                const isPreview = urlParams.get('preview') === 'true';
                if (currentUser || currentInstructor || isPreview) {
                    this.initModuleView(currentUser || currentInstructor || { id: 'preview', firstName: 'Preview', lastName: 'Mode' });
                }
            } else if (path.includes('instructor_dashboard.html') || path.includes('admin.html')) {
                if (currentInstructor || (window.AuthAPI && window.AuthAPI.getCurrentAdmin())) {
                    this.initInstructorFeatures();
                }
            }

            // Global floating presence dock for logged-in sessions
            if (currentUser || currentInstructor) {
                this.initPresenceDock(currentUser || currentInstructor, !!currentInstructor);
            }
        },

        /* =====================================================================
           1. STREAK TRACKING & PROGRESS RINGS (Student View)
           ===================================================================== */

        initStudentDashboard: function (user) {
            // 1. Streak Tracking
            this.handleStreak(user);

            // 2. Render SVG Progress Ring
            this.renderProgressRing(user);

            // 3. Initialize Notification Bell in Navbar
            this.initNotificationCenter(user);
        },

        handleStreak: async function (user) {
            if (!this.db) return;
            const now = new Date();
            let streak = user.streakCount || 0;
            let lastActive = user.lastActiveTimestamp ? new Date(user.lastActiveTimestamp) : null;

            if (lastActive) {
                const diffMs = now - lastActive;
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours >= 24 && diffHours <= 48) {
                    // Incremented day streak
                    streak += 1;
                } else if (diffHours > 48) {
                    // Reset streak
                    streak = 1;
                }
                // If diffHours < 24, do nothing (streak maintained)
            } else {
                streak = 1;
            }

            // Update user session and Firestore
            try {
                await this.db.collection('students').doc(user.id).update({
                    lastActiveTimestamp: now.toISOString(),
                    streakCount: streak
                });

                // Update local session
                const updatedUser = { ...user, lastActiveTimestamp: now.toISOString(), streakCount: streak };
                localStorage.setItem('jilgm_current_user', JSON.stringify(updatedUser));

                // Render Streak Indicator next to welcome name
                this.renderStreakIndicator(streak);
            } catch (e) {
                console.error("Error updating user streak:", e);
            }
        },

        renderStreakIndicator: function (streak) {
            const welcome = document.querySelector('.dash-hero-welcome');
            if (welcome) {
                const badge = document.createElement('div');
                badge.className = 'streak-indicator';
                badge.style.marginLeft = '1rem';
                badge.style.display = 'inline-flex';
                badge.innerHTML = `🔥 ${streak} Day Streak`;
                welcome.appendChild(badge);
            }
        },

        renderProgressRing: function (user) {
            const progressCard = document.getElementById('overallProgressCard') || document.querySelector('.dash-card.glass-card');
            if (!progressCard) return;

            // Calculate completed modules
            const modsContent = window.AuthAPI.getModulesContent();
            const modIds = window.AuthAPI.getModuleOrder().filter(id => modsContent[id]);
            const total = modIds.length || 1;
            const completed = modIds.filter(id => window.AuthAPI.isModuleCompleted(user.answers, id)).length;
            const pct = Math.round((completed / total) * 100);

            // Re-draw inside progress card
            progressCard.innerHTML = `
                <div class="progress-ring-container">
                    <div style="position: relative; width: 90px; height: 90px; flex-shrink: 0;">
                        <svg class="progress-ring-svg" width="90" height="90">
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="var(--accent-gold-light, #f5d97e)" />
                                    <stop offset="100%" stop-color="var(--accent-gold, #d4af37)" />
                                </linearGradient>
                            </defs>
                            <circle class="progress-ring-circle-bg" cx="45" cy="45" r="36" />
                            <circle class="progress-ring-circle" id="dashboardProgressCircle" cx="45" cy="45" r="36" />
                        </svg>
                        <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <span style="font-family: var(--font-sans); font-weight: 700; font-size: 1.15rem; color: var(--text-primary); line-height: 1;">${pct}%</span>
                            <span style="font-size: 0.55rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Done</span>
                        </div>
                    </div>
                    <div>
                        <h3 style="margin: 0; font-family: var(--font-serif); font-style: italic; font-size: 1.3rem;">Curriculum Journey</h3>
                        <p style="margin: 0.3rem 0 0; color: var(--text-secondary); font-size: 0.88rem;">
                            You have completed <strong>${completed}</strong> out of <strong>${total}</strong> curriculum modules. Keep going!
                        </p>
                    </div>
                </div>
            `;

            // Animate stroke
            const circle = document.getElementById('dashboardProgressCircle');
            if (circle) {
                const radius = circle.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                circle.style.strokeDasharray = `${circumference} ${circumference}`;
                circle.style.strokeDashoffset = circumference;
                
                // Force layout reflow
                circle.getBoundingClientRect();
                
                const offset = circumference - (pct / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }
        },

        /* =====================================================================
           2. MILESTONE MODALS & REFLECTION BOARDS (Module View)
           ===================================================================== */

        initModuleView: function (user) {
            const urlParams = new URLSearchParams(window.location.search);
            const moduleId = urlParams.get('id');
            if (!moduleId) return;

            // 1. Setup Reflection Board Below Lesson Card
            this.initReflectionBoard(user, moduleId);

            // 2. Setup Complete Lesson Button Event Listener
            this.initCompleteLessonBtn(user, moduleId);

            // 3. Notification & Bell for module pages
            this.initNotificationCenter(user);

            // 4. Setup PowerPoint Slides Presentation Exporter (Instructor-only link)
            this.initPPTExporter(moduleId);
        },

        initReflectionBoard: function (user, moduleId) {
            const card = document.getElementById('lessonContentCard');
            if (!card) return;

            const board = document.createElement('div');
            board.className = 'reflection-board glass-panel';
            board.innerHTML = `
                <h3 style="margin-bottom: 0.5rem; font-family: var(--font-serif); font-style: italic; color: var(--accent-gold-light);">Peer Reflection Board</h3>
                <p style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 1.5rem;">Read what your fellow apprentices are discovering in this lesson. Post your short takeaway below.</p>
                <div id="reflectionList" style="max-height: 350px; overflow-y: auto; margin-bottom: 1.5rem; padding-right: 0.5rem;">
                    <div style="text-align: center; color: var(--text-secondary); padding: 1.5rem 0; font-size: 0.85rem;">Loading peer reflections...</div>
                </div>
                <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                    <input type="text" id="reflectionInput" class="glass-input" style="flex: 1; padding: 0.6rem 1.2rem; font-size: 0.9rem; border-radius: 24px; min-width: 200px;" placeholder="What was your main takeaway? (Short & impactful)">
                    <button class="btn btn-primary" id="btnPostReflection" style="padding: 0.6rem 1.6rem; font-size: 0.9rem; border-radius: 24px; height: auto;">Post Takeaway</button>
                </div>
            `;
            // Append into sidebar if available, else below lesson content card
            const sidebar = document.getElementById('moduleSidebar');
            if (sidebar) {
                sidebar.appendChild(board);
            } else {
                card.parentNode.insertBefore(board, card.nextSibling);
            }

            const reflectionList = document.getElementById('reflectionList');
            const reflectionInput = document.getElementById('reflectionInput');
            const postBtn = document.getElementById('btnPostReflection');

            // Set up real-time listener for reflections (sorted client-side to avoid composite index requirements)
            if (this.db) {
                this.db.collection('module_reflections')
                    .where('moduleId', '==', moduleId)
                    .onSnapshot(snapshot => {
                        reflectionList.innerHTML = '';
                        if (snapshot.empty) {
                            reflectionList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem 0; font-size: 0.85rem; font-style: italic;">Be the first to share your takeaway from this module!</div>';
                            return;
                        }

                        const docs = [];
                        snapshot.forEach(doc => {
                            docs.push({ id: doc.id, ...doc.data() });
                        });

                        // Sort client-side: oldest first (ascending order)
                        docs.sort((a, b) => {
                            const tA = a.timestamp ? (a.timestamp.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime()) : 0;
                            const tB = b.timestamp ? (b.timestamp.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime()) : 0;
                            return tA - tB;
                        });

                        docs.forEach(data => {
                            const timeStr = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now';
                            const initials = data.initials || 'A';

                            const item = document.createElement('div');
                            item.className = 'reflection-item';
                            item.innerHTML = `
                                <div class="reflection-meta">
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <span class="dash-avatar" style="width: 22px; height: 22px; font-size: 0.6rem; border-shadow: none; box-shadow: none;">${initials}</span>
                                        <span>${data.studentName}</span>
                                    </div>
                                    <span class="reflection-date">${timeStr}</span>
                                </div>
                                <p style="margin: 0; color: var(--text-primary); font-size: 0.88rem; line-height: 1.4; word-break: break-word; white-space: pre-wrap;">${data.content}</p>
                            `;
                            reflectionList.appendChild(item);
                        });

                        // Auto-scroll to bottom of reflections
                        reflectionList.scrollTop = reflectionList.scrollHeight;
                    }, err => {
                        console.error("Error reading reflections:", err);
                        reflectionList.innerHTML = '<div style="text-align: center; color: #ef4444; padding: 1.5rem 0; font-size: 0.85rem;">Error loading reflections. Please refresh.</div>';
                    });
            }

            postBtn.addEventListener('click', async () => {
                const text = reflectionInput.value.trim();
                if (!text) return;
                if (text.length > 250) {
                    alert("Takeaways must be 250 characters or less.");
                    return;
                }

                reflectionInput.value = '';
                postBtn.disabled = true;

                try {
                    await this.db.collection('module_reflections').add({
                        moduleId: moduleId,
                        studentId: user.id,
                        studentName: `${user.firstName} ${user.lastName}`,
                        initials: user.firstName.charAt(0).toUpperCase(),
                        content: text,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } catch (err) {
                    console.error("Error saving reflection:", err);
                    alert("Failed to submit reflection: " + err.message);
                } finally {
                    postBtn.disabled = false;
                }
            });

            // Enter key mapping
            reflectionInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') postBtn.click();
            });
        },

        initCompleteLessonBtn: function (user, moduleId) {
            const self = this;

            // Global event delegation on body
            document.body.addEventListener('click', async function (event) {
                const target = event.target;
                if (target && (target.id === 'btn-complete-lesson' || target.closest('#btn-complete-lesson'))) {
                    event.preventDefault();
                    console.log('Complete Lesson button click intercepted successfully!');

                    try {
                        console.log("Checking user validation state...");
                        const btn = document.getElementById('btn-complete-lesson');
                        if (!btn || btn.disabled) {
                            console.log("Button is disabled or not found.");
                            return;
                        }

                        const hasFinished = window.AuthAPI.isModuleCompleted(user.answers, moduleId);
                        console.log("Is module already completed?", hasFinished);

                        if (hasFinished) {
                            const order = window.AuthAPI.getModuleOrder();
                            const currIdx = order.indexOf(moduleId);
                            const nextModuleId = currIdx !== -1 && currIdx < order.length - 1 ? order[currIdx + 1] : null;
                            const isNextReleased = nextModuleId ? window.AuthAPI.isModuleUnlocked(nextModuleId) : false;

                            console.log("Redirecting to next module:", nextModuleId, "Released globally?", isNextReleased);
                            if (isNextReleased) {
                                window.location.href = `module.html?id=${nextModuleId}`;
                            } else {
                                window.location.href = 'dashboard.html';
                            }
                        } else {
                            btn.disabled = true;
                            btn.innerText = "Verifying activities...";

                            console.log("Verifying lesson completeness...");
                            const checkResult = await self.verifyLessonCompleteness(user, moduleId);
                            console.log("Lesson completeness result:", checkResult);

                            if (checkResult.success) {
                                console.log("Reflection verified successfully.");
                                btn.innerText = "Submitting completion...";
                                
                                console.log("Attempting Firestore progress write...");
                                const res = await window.AuthAPI.submitAnswer(
                                    user.id,
                                    moduleId,
                                    'Lesson Completion',
                                    'Completed',
                                    null,
                                    9999,
                                    { type: 'lesson_completion' }
                                );
                                console.log("Firestore database write resolved successfully! Result:", res);

                                if (res.success) {
                                    // Reload user to capture updated answers list
                                    const freshUser = window.AuthAPI.getCurrentUser();
                                    const order = window.AuthAPI.getModuleOrder();
                                    const currIdx = order.indexOf(moduleId);
                                    const nextModuleId = currIdx !== -1 && currIdx < order.length - 1 ? order[currIdx + 1] : null;
                                    const isNextReleased = nextModuleId ? window.AuthAPI.isModuleUnlocked(nextModuleId) : false;

                                    if (isNextReleased) {
                                        btn.innerText = "Proceed to Next Module";
                                        btn.disabled = false;
                                    } else {
                                        btn.innerText = "Completed (Back to Dashboard)";
                                        btn.disabled = false;
                                    }
                                    
                                    console.log("Attempting to trigger milestone modal UI...");
                                    self.triggerMilestoneModal(moduleId);
                                    console.log("Milestone modal triggered successfully.");
                                } else {
                                    alert("Failed to save completion: " + (res.error || "unknown error"));
                                    btn.disabled = false;
                                    btn.innerText = "Complete Lesson";
                                }
                            } else {
                                console.log("Validation failed:", checkResult.reason);
                                self.spawnToast("Tasks Incomplete", checkResult.reason);
                                btn.innerText = "Complete Lesson";
                                btn.disabled = false;
                            }
                        }
                    } catch (error) {
                        console.error("❌ CRITICAL UNCAUGHT BLOCK ERROR:", error);
                        alert("Engine Error: " + error.message);
                    }
                }
            });

            // Also check and set the initial text on page load if the button is already present
            const completeBtn = document.getElementById('btn-complete-lesson');
            if (completeBtn) {
                const hasFinished = window.AuthAPI.isModuleCompleted(user.answers, moduleId);
                if (hasFinished) {
                    const order = window.AuthAPI.getModuleOrder();
                    const currIdx = order.indexOf(moduleId);
                    const nextModuleId = currIdx !== -1 && currIdx < order.length - 1 ? order[currIdx + 1] : null;
                    const isNextReleased = nextModuleId ? window.AuthAPI.isModuleUnlocked(nextModuleId) : false;

                    if (isNextReleased) {
                        completeBtn.innerText = "Proceed to Next Module";
                    } else {
                        completeBtn.innerText = "Completed (Back to Dashboard)";
                    }
                }
            }
        },

        verifyLessonCompleteness: async function (user, moduleId) {
            // Check 1: Verify all mandatory interactive tasks inside the module are completed
            const modsContent = window.AuthAPI.getModulesContent();
            const moduleData = modsContent[moduleId];
            if (!moduleData || !moduleData.components) return { success: true };

            const interactiveTypes = ['question', 'essay', 'file_upload', 'quiz', 'true_false', 'matching'];
            const interactiveComponents = moduleData.components.map((comp, index) => {
                return { ...comp, originalIndex: index };
            }).filter(comp => interactiveTypes.includes(comp.type));

            const studentAnswers = user.answers || [];

            // Check if every interactive component has a corresponding answer by index
            const missingTasks = [];
            interactiveComponents.forEach(comp => {
                const hasAnswer = studentAnswers.some(a => a.moduleId === moduleId && a.componentIndex === comp.originalIndex);
                if (!hasAnswer) {
                    const label = comp.title || comp.question || (comp.type === 'question' ? 'Reflection Question' : 'Activity');
                    missingTasks.push(label);
                }
            });

            if (missingTasks.length > 0) {
                return { 
                    success: false, 
                    reason: `Please complete all interactive tasks first: Missing "${missingTasks.join(', ')}".` 
                };
            }

            // Check 2: Verify they have posted a takeaway to the Peer Reflection Board in Firestore
            if (!this.db) return { success: true }; // Fail-soft fallback

            console.log("Checking reflections for user:", user.id, "and module:", moduleId);
            try {
                const snapshot = await this.db.collection('module_reflections')
                    .where('moduleId', '==', moduleId)
                    .where('studentId', '==', user.id)
                    .get();

                console.log("Found reflection docs count:", snapshot.size);
                if (snapshot.empty) {
                    return { success: false, reason: "Please post a takeaway on the Reflection Board first!" };
                }
                return { success: true };
            } catch (err) {
                console.error("Error checking reflection board completeness:", err);
                return { success: true }; // Fail-soft fallback
            }
        },

        triggerMilestoneModal: function (moduleId) {
            const order = window.AuthAPI.getModuleOrder();
            const currIdx = order.indexOf(moduleId);
            const nextModuleId = currIdx !== -1 && currIdx < order.length - 1 ? order[currIdx + 1] : null;

            let isNextReleased = false;
            let nextTitle = '';
            if (nextModuleId) {
                isNextReleased = window.AuthAPI.isModuleUnlocked(nextModuleId);
                const modsContent = window.AuthAPI.getModulesContent();
                if (modsContent[nextModuleId]) {
                    nextTitle = modsContent[nextModuleId].title;
                }
            }

            const buttonText = isNextReleased ? "Proceed to Next Module" : "Proceed to Dashboard";
            const targetUrl = isNextReleased ? `module.html?id=${nextModuleId}` : "dashboard.html";

            const overlay = document.createElement('div');
            overlay.className = 'milestone-overlay';
            overlay.innerHTML = `
                <div class="milestone-modal">
                    <div class="milestone-badge-glow"></div>
                    <div class="milestone-badge-icon">🏆</div>
                    <h2 style="font-family: var(--font-serif); font-style: italic; color: var(--accent-gold-light); margin-bottom: 0.8rem; font-size: 1.8rem;">Module Milestone!</h2>
                    <p style="color: var(--text-primary); font-size: 1rem; line-height: 1.5; margin-bottom: 1.8rem;">
                        Congratulations! You have successfully completed all lessons and activities for this study module. Your progression badge is unlocked!
                        ${isNextReleased ? `<br><span style="font-size: 0.85rem; color: var(--accent-gold-light);">Next Module: <strong>${nextTitle}</strong> is ready for you!</span>` : ''}
                    </p>
                    <button class="btn btn-primary" id="btnCloseMilestone" style="width: 100%; border-radius: 50px; padding: 0.75rem;">${buttonText}</button>
                </div>
            `;
            document.body.appendChild(overlay);

            // Trigger animation
            setTimeout(() => overlay.classList.add('active'), 50);

            document.getElementById('btnCloseMilestone').addEventListener('click', () => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.remove();
                    window.location.href = targetUrl;
                }, 400);
            });
        },

        /* =====================================================================
           3. REAL-TIME PRESENCE BAR
           ===================================================================== */

        initPresenceDock: function (user, isInstructor) {
            if (!this.db) return;

            // 1. Render Presence Dock container
            const dock = document.createElement('div');
            dock.className = 'presence-dock';
            dock.innerHTML = `
                <div class="presence-status-dot"></div>
                <span style="font-size: 0.72rem; color: var(--text-secondary); margin-right: 0.4rem; font-weight: 600;">Online Now:</span>
                <div class="presence-avatars-list" id="presenceAvatarsList"></div>
            `;
            document.body.appendChild(dock);

            const name = isInstructor ? (user.name || user.username || "Instructor") : `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Apprentice";
            let initials = "S";
            if (isInstructor) {
                const nameString = user && user.name ? user.name : (user && user.username ? user.username : "Instructor");
                initials = nameString.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().substring(0, 2);
            } else {
                initials = (user && user.firstName) ? user.firstName.charAt(0).toUpperCase() : "A";
            }

            // 2. Setup heartbeat writing
            const presenceRef = this.db.collection('presence').doc(user.id);
            const sendHeartbeat = () => {
                presenceRef.set({
                    userId: user.id,
                    name: name,
                    initials: initials.substring(0, 2),
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(e => console.error("Presence writing error:", e));
            };

            // Write initial heartbeat, then run every 60s
            sendHeartbeat();
            const heartbeatInterval = setInterval(sendHeartbeat, 60000);

            // Unsubscribe presence on page leave
            window.addEventListener('beforeunload', () => {
                clearInterval(heartbeatInterval);
                presenceRef.delete().catch(e => {});
            });

            // 3. Listen to active presence within the last 5 minutes
            this.db.collection('presence')
                .onSnapshot(snapshot => {
                    const avatarList = document.getElementById('presenceAvatarsList');
                    if (!avatarList) return;
                    avatarList.innerHTML = '';

                    const now = Date.now();
                    let count = 0;

                    snapshot.forEach(doc => {
                        const data = doc.data();
                        
                        // Local fallback validation since Firestore serverTimestamp might take a second to resolve
                        let lastSeenMs = now;
                        if (data.lastSeen) {
                            lastSeenMs = data.lastSeen.seconds ? data.lastSeen.seconds * 1000 : data.lastSeen;
                        }

                        // Filter active sessions inside 3 minutes
                        if (now - lastSeenMs < 180000) {
                            count++;
                            if (count <= 6) { // Render max 6 avatar circles
                                const el = document.createElement('div');
                                el.className = 'presence-avatar-badge';
                                el.setAttribute('data-tooltip', data.name);
                                el.innerText = data.initials;
                                avatarList.appendChild(el);
                            }
                        }
                    });

                    // If more than 6, render an overflow pill
                    if (count > 6) {
                        const extra = document.createElement('div');
                        extra.className = 'presence-avatar-badge';
                        extra.style.background = 'rgba(212, 175, 55, 0.4)';
                        extra.innerText = `+${count - 6}`;
                        avatarList.appendChild(extra);
                    }
                }, err => {
                    console.error("Error reading presence states:", err);
                });
        },

        /* =====================================================================
           4. IN-APP NOTIFICATIONS & BELL SYSTEM
           ===================================================================== */

        initNotificationCenter: function (user) {
            if (!this.db) return;

            // Find global navbar or wrapper
            const navRight = document.querySelector('.nav-links') || document.querySelector('.navbar');
            if (!navRight) return;

            // Inject Bell element
            const bell = document.createElement('div');
            bell.className = 'notification-bell-container';
            bell.style.margin = '0 0.5rem';
            bell.innerHTML = `
                <div style="font-size: 1.3rem; line-height: 1; padding: 0.3rem;" id="navNotificationBell">🔔</div>
                <div class="notification-counter" id="notificationCountBadge" style="display: none;">0</div>
                <div class="notifications-dropdown" id="notificationDrop">
                    <div class="notifications-header">
                        <h4>Notifications</h4>
                        <span style="font-size: 0.65rem; text-decoration: underline; cursor: pointer;" id="btnMarkAllRead">Mark all read</span>
                    </div>
                    <div class="notifications-list" id="notificationDropList"></div>
                </div>
            `;
            navRight.insertBefore(bell, navRight.firstChild);

            const drop = document.getElementById('notificationDrop');
            const list = document.getElementById('notificationDropList');
            const badge = document.getElementById('notificationCountBadge');
            const markAll = document.getElementById('btnMarkAllRead');

            // Create toast container in body
            let toastBox = document.getElementById('toastCenter');
            if (!toastBox) {
                toastBox = document.createElement('div');
                toastBox.id = 'toastCenter';
                toastBox.className = 'toast-container';
                document.body.appendChild(toastBox);
            }

            // Click bell toggles dropdown
            document.getElementById('navNotificationBell').addEventListener('click', (e) => {
                e.stopPropagation();
                drop.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                drop.classList.remove('active');
            });

            // Listen to notifications matching user
            let isFirstLoad = true;
            this.db.collection('notifications')
                .where('userId', '==', user.id)
                .onSnapshot(snapshot => {
                    list.innerHTML = '';
                    let unread = 0;

                    if (snapshot.empty) {
                        list.innerHTML = '<div style="text-align:center;padding:1.5rem;font-size:0.75rem;color:var(--text-secondary);font-style:italic;">No notifications.</div>';
                        badge.style.display = 'none';
                        return;
                    }

                    const docs = [];
                    snapshot.forEach(doc => {
                        docs.push({ id: doc.id, ...doc.data() });
                    });

                    // Sort client-side: newest first (descending order)
                    docs.sort((a, b) => {
                        const tA = a.timestamp ? (a.timestamp.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp).getTime()) : 0;
                        const tB = b.timestamp ? (b.timestamp.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp).getTime()) : 0;
                        return tB - tA;
                    });

                    docs.forEach(data => {
                        const id = data.id;
                        if (!data.read) unread++;

                        // Build dropdown item
                        const item = document.createElement('div');
                        item.className = `notification-dropdown-item ${data.read ? '' : 'unread'}`;
                        item.style.cursor = 'pointer';
                        item.innerHTML = `
                            <div style="font-weight: 700; color: var(--accent-gold-light); margin-bottom: 0.15rem;">${data.title}</div>
                            <div style="color: var(--text-primary); line-height: 1.3;">${data.message}</div>
                            <div style="font-size: 0.65rem; color: var(--text-secondary); text-align: right; margin-top: 0.3rem;">
                                ${data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                            </div>
                        `;

                        item.addEventListener('click', () => {
                            if (!data.read) {
                                this.db.collection('notifications').doc(id).update({ read: true });
                            }
                        });

                        list.appendChild(item);

                        // Trigger toast notification on new entries (after first load)
                        if (!isFirstLoad && !data.read) {
                            this.spawnToast(data.title, data.message);
                        }
                    });

                    isFirstLoad = false;

                    if (unread > 0) {
                        badge.innerText = unread;
                        badge.style.display = 'flex';
                    } else {
                        badge.style.display = 'none';
                    }
                });

            // Mark all read trigger
            markAll.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const snap = await this.db.collection('notifications')
                        .where('userId', '==', user.id)
                        .where('read', '==', false)
                        .get();
                    
                    const batch = this.db.batch();
                    snap.forEach(doc => {
                        batch.update(doc.ref, { read: true });
                    });
                    await batch.commit();
                } catch (err) {
                    console.error("Mark all read failed:", err);
                }
            });
        },

        spawnToast: function (title, msg) {
            let container = document.getElementById('toastCenter');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toastCenter';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = 'live-toast';
            toast.innerHTML = `
                <div style="font-size: 1.2rem;">🔔</div>
                <div>
                    <div style="font-weight: 700; color: var(--accent-gold-light);">${title}</div>
                    <div style="font-size: 0.8rem; margin-top: 2px;">${msg}</div>
                </div>
            `;
            container.appendChild(toast);

            // Animate slider
            setTimeout(() => toast.classList.add('show'), 50);

            // Auto purge after 4 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, 4000);
        },

        /* =====================================================================
           5. INSTRUCTOR FEATURES: SMART ANALYTICS & COHORT FILTERS
           ===================================================================== */

        initInstructorFeatures: function () {
            if (this.db) {
                // Listen to student updates in real-time
                this.db.collection('students').onSnapshot(() => {
                    this.renderInstructorCohortSelector();
                    this.renderAnalyticsMetrics();
                    this.flagInactiveApprentices();
                }, err => {
                    console.error("Features students snapshot error:", err);
                });
                // Listen to modules updates in real-time
                this.db.collection('modules_content').onSnapshot(() => {
                    this.renderInstructorCohortSelector();
                    this.renderAnalyticsMetrics();
                    this.flagInactiveApprentices();
                }, err => {
                    console.error("Features modules snapshot error:", err);
                });
            } else {
                setTimeout(() => {
                    this.renderInstructorCohortSelector();
                    this.renderAnalyticsMetrics();
                    this.flagInactiveApprentices();
                }, 300);
            }
        },

        renderInstructorCohortSelector: function () {
            const table = document.querySelector('.table') || document.querySelector('table');
            if (!table) return;

            // Check if selector exists; if so, clear its options and rebuild
            let select = document.getElementById('instructorCohortFilter');
            if (!select) {
                // Create selector container above table
                const filterDiv = document.createElement('div');
                filterDiv.style.display = 'flex';
                filterDiv.style.alignItems = 'center';
                filterDiv.style.gap = '0.8rem';
                filterDiv.style.marginBottom = '1rem';
                filterDiv.innerHTML = `
                    <label style="font-size: 0.85rem; color: var(--text-secondary);">Filter by Cohort:</label>
                    <select id="instructorCohortFilter" class="glass-input" style="width: auto; padding: 0.4rem 1.2rem; font-size: 0.85rem; border-radius: 20px;">
                        <option value="all">All Cohorts</option>
                    </select>
                `;
                table.parentNode.insertBefore(filterDiv, table);
                select = document.getElementById('instructorCohortFilter');
                
                select.addEventListener('change', () => {
                    const selected = select.value;
                    const rows = table.querySelectorAll('tbody tr');
                    
                    rows.forEach(row => {
                        const studentNameLink = row.querySelector('td a');
                        if (!studentNameLink) return;

                        // Match name with cohort
                        const studentId = studentNameLink.href.split('studentId=')[1] || '';
                        if (!studentId) return;

                        const student = window.AuthAPI.getAllStudents().find(s => s.id === studentId);
                        if (!student) return;

                        const studentCohort = student.cohort || 'Unassigned';
                        if (selected === 'all' || studentCohort === selected) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    });
                });
            } else {
                // Clear options except "All Cohorts"
                select.innerHTML = '<option value="all">All Cohorts</option>';
            }

            // Load distinct cohorts dynamically from students list
            if (window.AuthAPI) {
                const students = window.AuthAPI.getAllStudents();
                const cohorts = [...new Set(students.map(s => s.cohort || 'Unassigned'))];
                cohorts.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c;
                    opt.innerText = c;
                    select.appendChild(opt);
                });
            }


        },

        renderAnalyticsMetrics: function () {
            // Find placeholder card or append
            const statsSection = document.querySelector('.instructor-stats') || document.querySelector('.dashboard-grid');
            if (!statsSection) return;

            let chartBox = document.getElementById('analyticsChartBox');
            if (!chartBox) {
                chartBox = document.createElement('div');
                chartBox.id = 'analyticsChartBox';
                chartBox.className = 'analytics-chart-container glass-panel';
                chartBox.style.gridColumn = '1 / -1';
                statsSection.parentNode.insertBefore(chartBox, statsSection);
            }

            chartBox.innerHTML = `
                <h3 style="font-family: var(--font-serif); font-style: italic; color: var(--accent-gold-light); margin-bottom: 1.2rem; font-size: 1.4rem;">Curriculum Submission Analytics</h3>
                <div id="analyticsBarsList"></div>
            `;

            const barList = document.getElementById('analyticsBarsList');
            if (!window.AuthAPI) return;

            const students = window.AuthAPI.getAllStudents();
            const totalStudents = students.length || 1;
            const modsContent = window.AuthAPI.getModulesContent();
            const modIds = window.AuthAPI.getModuleOrder().filter(id => modsContent[id]);

            modIds.forEach(modId => {
                const title = modsContent[modId].title || modId;
                
                // Count completions for this module
                const completions = students.filter(s => {
                    return window.AuthAPI.isModuleCompleted(s.answers || [], modId);
                }).length;

                const pct = Math.round((completions / totalStudents) * 100);

                const row = document.createElement('div');
                row.className = 'analytics-bar-row';
                row.innerHTML = `
                    <span class="analytics-bar-label" title="${title}">${title}</span>
                    <div class="analytics-bar-wrapper">
                        <div class="analytics-bar-fill" style="width: 0%;"></div>
                    </div>
                    <span class="analytics-bar-value">${completions}/${totalStudents}</span>
                `;
                barList.appendChild(row);

                // Animate bars slightly after loading
                setTimeout(() => {
                    row.querySelector('.analytics-bar-fill').style.width = `${pct}%`;
                }, 100);
            });
        },

        flagInactiveApprentices: function () {
            // Add review warning visual alert flags
            const rows = document.querySelectorAll('table tbody tr');
            const now = new Date();

            rows.forEach(row => {
                const nameLink = row.querySelector('td a');
                if (!nameLink) return;

                const studentId = nameLink.href.split('studentId=')[1] || '';
                if (!studentId) return;

                const student = window.AuthAPI.getAllStudents().find(s => s.id === studentId);
                if (!student) return;

                // Check inactivity (> 5 days)
                if (student.lastActiveTimestamp) {
                    const lastActive = new Date(student.lastActiveTimestamp);
                    const diffDays = (now - lastActive) / (1000 * 60 * 60 * 24);

                    if (diffDays >= 5 && !nameLink.parentNode.querySelector('.needs-review-flag')) {
                        const alertSpan = document.createElement('span');
                        alertSpan.className = 'needs-review-flag';
                        alertSpan.innerHTML = `⚠️ 5d+ Inactive`;
                        nameLink.parentNode.appendChild(alertSpan);
                    }
                }
            });
        },

        initPPTExporter: function (moduleId) {
            const urlParams = new URLSearchParams(window.location.search);
            const fromInst = urlParams.get('from') === 'instructor' || urlParams.get('from') === 'admin' || urlParams.get('preview') === 'true';
            
            if (!fromInst) return;

            // Wait for sidebar-nav to exist
            setTimeout(() => {
                const nav = document.querySelector('.sidebar-nav');
                if (!nav) return;

                // Check if button already exists
                if (document.getElementById('btn-generate-ppt')) return;

                const pptBtn = document.createElement('a');
                pptBtn.href = '#';
                pptBtn.id = 'btn-generate-ppt';
                pptBtn.innerHTML = '📊 Generate PPT';
                pptBtn.className = 'btn-ppt-sidebar-trigger';
                pptBtn.style.cssText = 'color: var(--accent-gold); font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;';
                
                pptBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.exportModulePPT(moduleId);
                });

                // Insert before the theme toggle
                const themeToggle = nav.querySelector('.theme-toggle');
                if (themeToggle) {
                    nav.insertBefore(pptBtn, themeToggle);
                } else {
                    nav.appendChild(pptBtn);
                }
            }, 300);
        },

        exportModulePPT: function (moduleId) {
            console.log("🚀 Initializing Isolated Pop-Up Presentation Print Pipeline...");
            const mod = window.AuthAPI ? window.AuthAPI.getModule(moduleId) : null;
            if (!mod) {
                alert('Module data is not ready or not found.');
                return;
            }

            // 1. Open a clean, isolated blank browser tab
            const printWindow = window.open('', '_blank', 'width=1200,height=800');
            if (!printWindow) {
                alert("Pop-up blocked! Please allow pop-ups for this site to export the presentation deck.");
                return;
            }

            const title = mod.title || 'Untitled Module';
            const subtitle = mod.subtitle || '';
            const comps = mod.components || [];

            // 2. Build out the standalone HTML slide structure directly into the new window document
            let slideHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>${title} - Presentation Deck</title>
                    <style>
                        @page {
                            size: landscape !important;
                            margin: 0 !important;
                        }
                        html, body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 100% !important;
                            height: 100% !important;
                            background-color: #0b132b !important;
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            color: #ffffff;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            overflow: hidden !important;
                        }
                        .slide {
                            width: 100vw !important;
                            height: 100vh !important;
                            page-break-after: always !important;
                            page-break-inside: avoid !important;
                            box-sizing: border-box;
                            padding: 60px 80px;
                            background-color: #0b132b !important;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            justify-content: flex-start;
                        }
                        .header-bar {
                            position: absolute;
                            top: 0; left: 0; right: 0; height: 10px;
                            background: linear-gradient(90deg, #d4af37, #10b981);
                        }
                        .cover-title { font-size: 38pt; font-weight: 700; color: #d4af37; margin-top: 80px; margin-bottom: 20px; line-height: 1.2; }
                        .cover-subtitle { font-size: 18pt; color: #e2e8f0; font-weight: 300; margin: 0; }
                        .slide-title { font-size: 26pt; font-weight: 600; color: #ffffff; border-left: 5px solid #d4af37; padding-left: 15px; margin-bottom: 30px; }
                        .bullet-list { padding: 0; margin: 0; flex: 1; display: flex; flex-direction: column; justify-content: center; }
                        .bullet-list li { font-size: 16pt; line-height: 1.6; margin-bottom: 15px; color: #e2e8f0; list-style-type: square; margin-left: 20px; }
                        .bullet-list li strong { color: #d4af37; }
                    </style>
                </head>
                <body onload="setTimeout(function() { window.print(); window.close(); }, 300);">
                    <!-- Slide 1: Cover -->
                    <div class="slide">
                        <div class="header-bar"></div>
                        <h1 class="cover-title">${title}</h1>
                        <p class="cover-subtitle">${subtitle || 'JILGM Riyadh Leadership Masterclass'}</p>
                    </div>
            `;

            // Extract content blocks
            const contentItems = [];
            comps.forEach(c => {
                if (!c) return;
                if (c.type === 'header_h1' || c.type === 'header_h2' || c.type === 'header_h3' || c.type === 'header') {
                    contentItems.push({ type: 'header', text: c.content });
                } else if (c.type === 'text' || c.type === 'quote' || c.type === 'callout') {
                    contentItems.push({ type: 'text', text: c.content });
                } else if (c.type === 'bullet_list' || c.type === 'toggle_list') {
                    if (Array.isArray(c.items)) {
                        c.items.forEach(item => {
                            if (item) contentItems.push({ type: 'list_item', text: item.text || item });
                        });
                    } else if (c.content) {
                        contentItems.push({ type: 'list_item', text: c.content });
                    }
                }
            });

            // 3. Dynamically append core content slides here from in-memory snapshot
            const itemsPerSlide = 4;
            for (let i = 0; i < contentItems.length; i += itemsPerSlide) {
                const chunk = contentItems.slice(i, i + itemsPerSlide);
                
                let listHtml = '';
                chunk.forEach(item => {
                    if (item.type === 'header') {
                        listHtml += `<li style="font-size: 18pt; font-weight: bold; color: #d4af37; margin-bottom: 1.5rem; list-style-type: none; border-left: 4px solid #d4af37; padding-left: 0.8rem; margin-left: 0; text-align: left;">${item.text}</li>`;
                    } else {
                        listHtml += `<li style="text-align: left;">${item.text}</li>`;
                    }
                });

                slideHTML += `
                    <div class="slide">
                        <div class="header-bar"></div>
                        <div style="font-size: 0.85rem; text-transform: uppercase; color: #d4af37; letter-spacing: 2px; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 0.5rem; margin-bottom: 2rem; display: flex; justify-content: space-between;">
                            <span>${title}</span>
                            <span>Slide ${Math.floor(i / itemsPerSlide) + 2}</span>
                        </div>
                        <ul class="bullet-list">
                            ${listHtml}
                        </ul>
                    </div>
                `;
            }

            // 4. Final Slide: Face-to-Face CTA
            slideHTML += `
                    <div class="slide">
                        <div class="header-bar"></div>
                        <h2 class="slide-title">Face-to-Face Engagement</h2>
                        <ul class="bullet-list">
                            <li><strong>Apprentice Action:</strong> Log into your personal dashboard device right now.</li>
                            <li><strong>Reflection Board:</strong> Post your primary key takeaway from this session to the live Peer Reflection Board below the viewport!</li>
                        </ul>
                    </div>
                </body>
                </html>
            `;

            // 5. Write content to the isolated frame, wait for rendering, print, and self-destruct
            printWindow.document.write(slideHTML);
            printWindow.document.close();
            console.log("🛡️ Document stream closed. Internal body layout paint trigger initiated.");
        }
    };

    window.Features = Features;
    document.addEventListener('DOMContentLoaded', () => {
        Features.init();
    });
})();
