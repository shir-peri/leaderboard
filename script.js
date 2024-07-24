const SHEET_ID = '2PACX-1vQa9Ydz6ewGo1rpi7nSh7YFf9KywDuRdZY_-7BXnPDVQFr4CZMg_UYkV0g37vBoPCuplr6dvS1408GG';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/${SHEET_ID}/pub?output=csv`;

function calculateTotalPoints(answers, upvotes) {
    return answers * 10 + upvotes * 2;
}

function updateLeaderboard(data) {
    const tbody = document.querySelector("#leaderboard tbody");
    tbody.innerHTML = "";

    data.sort((a, b) => b['Total Points'] - a['Total Points']);

    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.Username}</td>
            <td>${row.Answers}</td>
            <td>${row.Upvotes}</td>
            <td>${row['Total Points']}</td>
        `;
        tbody.appendChild(tr);
    });
}

function fetchLeaderboardData() {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        complete: function(results) {
            console.log("Fetched data:", results.data);
            const data = results.data.map(row => ({
                Username: row.Username,
                Answers: parseInt(row.Answers) || 0,
                Upvotes: parseInt(row.Upvotes) || 0,
                'Total Points': calculateTotalPoints(parseInt(row.Answers) || 0, parseInt(row.Upvotes) || 0)
            }));
            updateLeaderboard(data);
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchLeaderboardData);

// Add sorting functionality
document.querySelectorAll('#leaderboard th').forEach(th => 
    th.addEventListener('click', () => {
        const column = th.textContent.trim();
        fetchLeaderboardData().then(data => {
            data.sort((a, b) => b[column] - a[column]);
            updateLeaderboard(data);
        });
    })
);
