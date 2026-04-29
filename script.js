// 🔥 Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// 🔑 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBmMOV_k15vjrBjOg8S4u0cnNyOeyzBrzw",
    authDomain: "event-management-system-5180d.firebaseapp.com",
    projectId: "event-management-system-5180d",
    storageBucket: "event-management-system-5180d.firebasestorage.app",
    messagingSenderId: "203321067669",
    appId: "1:203321067669:web:2bda8cd86d8125ffcb339c",
    measurementId: "G-2DZPQQ8Y08"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📅 Event Manager Class
class EventManager {
    constructor() {
        this.events = [];
        this.init();
    }

    // INIT
    init() {
        this.listenToEvents();
        this.bindEvents();
    }

    // FORM SUBMIT
    bindEvents() {
        document.getElementById('eventForm')
            .addEventListener('submit', (e) => {
                e.preventDefault();
                this.addEvent();
            });
    }

    // 🔄 REALTIME FETCH FROM FIREBASE
    listenToEvents() {
        const eventsRef = collection(db, "events");

        onSnapshot(eventsRef, (snapshot) => {
            this.events = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort latest first
            this.events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            this.renderEvents();
        });
    }

    // ➕ ADD EVENT
    async addEvent() {
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const type = document.getElementById('eventType').value;
        const desc = document.getElementById('eventDesc').value;

        if (!title || !date) return;

        try {
            await addDoc(collection(db, "events"), {
                title,
                date,
                type,
                description: desc,
                createdAt: new Date().toISOString()
            });

            this.resetForm();

        } catch (error) {
            console.error("Error adding event:", error);
        }
    }

    // 🗑 DELETE EVENT
    async deleteEvent(id) {
        try {
            await deleteDoc(doc(db, "events", id));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    // 🔄 RESET FORM
    resetForm() {
        document.getElementById('eventForm').reset();
    }

    // 🎯 ICONS
    getEventTypeIcon(type) {
        const icons = {
            meeting: '👥',
            workshop: '🎓',
            party: '🎉',
            conference: '📊',
            webinar: '💻'
        };
        return icons[type] || '📅';
    }

    // 📅 FORMAT DATE
    formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 📌 CHECK TODAY
    isToday(dateString) {
        const eventDate = new Date(dateString);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
    }

    // 📊 UPDATE STATS
    updateStats() {
        document.getElementById('totalEvents').textContent = this.events.length;

        const todayCount = this.events.filter(event =>
            this.isToday(event.date)
        ).length;

        document.getElementById('todayEvents').textContent = todayCount;
    }

    // 🎨 RENDER EVENTS
    renderEvents() {
        const container = document.getElementById('eventsContainer');

        if (this.events.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    No events yet. Add your first event!
                </div>`;
            this.updateStats();
            return;
        }

        container.innerHTML = this.events.map(event => `
            <div class="event-card ${this.isToday(event.date) ? 'today-event' : ''}">

                <div class="event-title">
                    ${this.getEventTypeIcon(event.type)} ${event.title}
                </div>

                <div class="event-date">
                    ${this.formatDate(event.date)}
                </div>

                ${event.description ? `
                    <p class="event-description">${event.description}</p>
                ` : ''}

                <div class="event-meta">
                    <span>
                        ${event.type
                            ? event.type.charAt(0).toUpperCase() + event.type.slice(1)
                            : 'Event'}
                    </span>

                    <button class="delete-btn"
                        onclick="eventManager.deleteEvent('${event.id}')">
                        🗑️ Delete
                    </button>
                </div>

            </div>
        `).join('');

        this.updateStats();
    }
}

// 🚀 START APP
document.addEventListener('DOMContentLoaded', () => {
    window.eventManager = new EventManager();
});