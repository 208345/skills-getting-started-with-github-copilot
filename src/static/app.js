async function loadActivities() {
    const res = await fetch('/activities');
    const activities = await res.json();
    const grid = document.getElementById('activities-grid');
    grid.innerHTML = '';

    for (const [name, data] of Object.entries(activities)) {
        const card = document.createElement('div');
        card.className = 'card';
        
        let participantsHTML = '<ul class="participants-list">';
        data.participants.forEach(email => {
            participantsHTML += `<li>${email} <span class="delete-btn" onclick="unregister('${name}', '${email}')">❌</span></li>`;
        });
        participantsHTML += '</ul>';

        card.innerHTML = `
            <h3>${name}</h3>
            <p>${data.description}</p>
            <p><strong>Schedule:</strong> ${data.schedule}</p>
            <p><strong>Participants:</strong> (${data.participants.length}/${data.max_participants})</p>
            ${participantsHTML}
            <div class="signup-form">
                <input type="email" id="email-${name.replace(/\s+/g, '-')}" placeholder="Enter your email" required>
                <button onclick="signup('${name}')">Sign Up</button>
            </div>
        `;
        grid.appendChild(card);
    }
}

async function signup(activityName) {
    const inputId = `email-${activityName.replace(/\s+/g, '-')}`;
    const email = document.getElementById(inputId).value;
    if (!email) return alert('Please enter an email');

    const res = await fetch(`/activities/${encodeURIComponent(activityName)}/signup?email=${encodeURIComponent(email)}`, {
        method: 'POST'
    });
    if (res.ok) {
        loadActivities();
    } else {
        const err = await res.json();
        alert(err.detail || 'Error signing up');
    }
}

async function unregister(activityName, email) {
    const res = await fetch(`/activities/${encodeURIComponent(activityName)}/unregister?email=${encodeURIComponent(email)}`, {
        method: 'POST'
    });
    if (res.ok) {
        loadActivities();
    } else {
        const err = await res.json();
        alert(err.detail || 'Error unregistering');
    }
}

document.addEventListener('DOMContentLoaded', loadActivities);
