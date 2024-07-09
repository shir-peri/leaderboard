const SHEET_ID = '2PACX-1vRWI9BosPgGwA2xU0qs-VJN3IKDTKK9nALd-S5kFswaNDCqG29aXg20q9KeyLnt5aKEtcX9OvMTExu5/pubhtml';
const SHEET_NAME = 'Sheet1';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;  

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
            const data = results.data.map(row => ({
                ...row,
                'Total Points': calculateTotalPoints(parseInt(row.Answers), parseInt(row.Upvotes))
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
