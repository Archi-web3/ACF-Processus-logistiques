const toggleDarkMode = document.getElementById('toggleDarkMode');

toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleDarkMode.textContent = document.body.classList.contains('dark-mode') ? 'Mode Clair' : 'Mode Sombre';
});

// Help Tooltip Logic
const helpBtn = document.getElementById('helpBtn');
const helpTooltip = document.getElementById('helpTooltip');

if (helpBtn && helpTooltip) {
    helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        helpTooltip.classList.toggle('show');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!helpTooltip.contains(e.target) && e.target !== helpBtn) {
            helpTooltip.classList.remove('show');
        }
    });
}

function afficherImageEnGrand(imageUrl, event) {
    event.stopPropagation();
    const overlay = document.getElementById('overlay');
    const imageEnGrand = document.getElementById('imageEnGrand');
    imageEnGrand.src = imageUrl;
    overlay.style.display = 'flex';
}

function masquerImageEnGrand() {
    document.getElementById('overlay').style.display = 'none';
}

document.addEventListener('click', function (event) {
    if (!event.target.closest('.processus')) {
        const popups = document.querySelectorAll('.popup');
        popups.forEach(popup => popup.remove());

        const actorRectangles = document.querySelectorAll('.actor-rectangle');
        actorRectangles.forEach(rect => rect.style.display = 'none');
    }
});

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const processusList = document.querySelectorAll('.processus');

    processusList.forEach(processus => {
        const text = processus.textContent.toLowerCase();
        const actors = processus.dataset.actors ? processus.dataset.actors.toLowerCase() : '';
        const typeControle = processus.dataset.typeControle ? processus.dataset.typeControle.toLowerCase() : '';
        const actorRectangle = processus.querySelector('.actor-rectangle');
        const localisationElement = processus.querySelector('.localisation');

        // Récupérer les localisations
        const isHQ = processus.dataset.hq === 'true';
        const isCoordination = processus.dataset.coordination === 'true';
        const isBase = processus.dataset.base === 'true';

        // Vérifier si le terme de recherche est dans les localisations
        const matchesHQ = isHQ && 'hq'.includes(searchTerm);
        const matchesCoordination = isCoordination && 'coordination'.includes(searchTerm);
        const matchesBase = isBase && 'base'.includes(searchTerm);

        // Vérifier si le terme de recherche est dans le texte, les acteurs, le type de contrôle ou les localisations
        const matchesSearch = text.includes(searchTerm) || actors.includes(searchTerm) || typeControle.includes(searchTerm) || matchesHQ || matchesCoordination || matchesBase;

        if (matchesSearch) {
            processus.style.display = 'block';

            // Afficher les rectangles (acteur et localisation) si un terme de recherche est présent
            if (searchTerm) {
                actorRectangle.textContent = processus.dataset.actors;
                actorRectangle.style.display = 'block';
                localisationElement.style.display = 'block';
            } else {
                actorRectangle.style.display = 'none';
                localisationElement.style.display = 'none';
            }

        } else {
            processus.style.display = 'none';
            actorRectangle.style.display = 'none';
            localisationElement.style.display = 'none';
        }
    });
});

const btns = document.querySelectorAll('.filters button');

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // document.querySelector('.default-image') styles removed

        document.querySelectorAll('.section-container').forEach(c => {
            const category = c.dataset.category;

            if (filter === 'all') {
                c.style.display = 'block';
            } else if (filter === 'clear') {
                document.querySelectorAll('.section-container').forEach(section => {
                    section.style.display = 'none';
                });
                // No default image to show anymore
            } else {
                // Vérifiez si le nom de la section correspond au filtre (insensible à la casse)
                if (category.toLowerCase() === filter.toLowerCase()) {
                    c.style.display = 'block';
                } else {
                    c.style.display = 'none';
                }
            }
        });

        // Met à jour l’image à chaque clic, selon le filtre
        const sectionImageContainer = document.getElementById('section-image');
        if (sectionImageContainer) {
            let sectionToShow = null;
            if (filter === 'all') {
                // Si tout est affiché
            } else if (filter !== 'clear') {
                // Find visible section
                document.querySelectorAll('.section-container').forEach(c => {
                    if (c.dataset.category === filter) sectionToShow = c.dataset.category;
                });
            }

            if (sectionToShow) {
                // Show specific logo
                const logoSrc = getLogoForSection(sectionToShow);
                sectionImageContainer.innerHTML = `<img src="${logoSrc}" alt="${sectionToShow}" class="default-logo-search">`;
            } else {
                // Show default logo (ACF Small)
                sectionImageContainer.innerHTML = `<img src="Logo_acf.png" class="default-logo-search" alt="Logo ACF">`;
            }
        }
    });
});

function attachSectionEvents(container) {
    if (!container) return;

    container.querySelectorAll('.processus').forEach(processus => {
        // Clone node to remove existing listeners if any (safety check) or just ensure single attachment
        // simplified: just adding listener. logic elsewhere ensures we only call this once per section creation.

        processus.addEventListener('click', function (event) {
            event.stopPropagation();
            const actorRectangle = processus.querySelector('.actor-rectangle');
            const popupContent = this.dataset.popupContent; // Use 'this' to refer to the clicked element
            const existingPopup = processus.querySelector('.popup');

            if (existingPopup) {
                existingPopup.remove();
            } else {
                // Close other popups first
                document.querySelectorAll('.popup').forEach(p => p.remove());
                document.querySelectorAll('.actor-rectangle').forEach(r => r.style.display = 'none');

                const popupDiv = document.createElement('div');
                popupDiv.classList.add('popup');
                popupDiv.innerHTML = popupContent;
                popupDiv.innerHTML +=
                    `<div style="margin-top: 10px;"><a href="https://nohungerforum.sharepoint.com/sites/KitLog/SitePages/fr/Home.aspx" target="_blank" class="popup-button">Accéder à l'outil</a></div>`;
                processus.appendChild(popupDiv);
                popupDiv.style.display = 'block';
            }

            actorRectangle.textContent = this.dataset.actors;
            actorRectangle.style.display = actorRectangle.style.display === 'block' ? 'none' : 'block';
        });
    });
}

let showSubProcessus = true;

document.addEventListener("DOMContentLoaded", function () {
    fetch('processus_logistiques.json')
        .then(response => response.json())
        .then(data => {
            const sectionsContainer = document.getElementById("logistics-sections-container");
            const groupedData = groupDataByProcessus(data);

            for (const processus in groupedData) {
                const processusData = groupedData[processus];
                createSection(sectionsContainer, processusData, processus);
            }
        })
        .catch(error => console.error("Erreur:", error));

    const toggleViewButton = document.getElementById("toggleView");
    toggleViewButton.addEventListener("click", function () {
        showSubProcessus = !showSubProcessus;
        toggleViewButton.textContent = showSubProcessus ? "Afficher toutes les activités" :
            "Afficher par sous-processus";

        const sectionsContainer = document.getElementById("logistics-sections-container");
        sectionsContainer.innerHTML = "";

        fetch('processus_logistiques.json')
            .then(response => response.json())
            .then(data => {
                const groupedData = groupDataByProcessus(data);
                for (const processus in groupedData) {
                    const processusData = groupedData[processus];
                    createSection(sectionsContainer, processusData, processus);
                }
            })
            .catch(error => console.error("Erreur:", error));
    });
});

function groupDataByProcessus(data) {
    return data.reduce((acc, item) => {
        const processus = item.Processus;
        if (!acc[processus]) {
            acc[processus] = [];
        }
        acc[processus].push(item);
        return acc;
    }, {});
}

function getLogoForSection(sectionTitle) {
    const logos = {
        "Gestion de stocks": "Logo_Stock2.png",
        "Gestion de achats": "Logo_Procurement.png",
        "Transport": "Logo_transport.png",
        "Equipements": "Logo_equipement.png",
        "Energie": "Logo_energie.png",
        "Gestion des Dons en Nature (DEN) ": "Logo_Donation.png",
        "Assurance qualité": "QA.png",
        "Gestion de parc véhicules": "Logo_fleet.png",
        "Management de l’équipe logistique": "Logo_Team.png",
        "Gestion des bâtiments": "Logo_acf.png"
    };
    return logos[sectionTitle] || "Logo_acf.png";
}

function createSection(container, sectionData, sectionTitle) {
    console.log("Création section :", sectionTitle);

    const sectionContainer = document.createElement("div");
    sectionContainer.className = "section-container";
    sectionContainer.dataset.category = sectionTitle;

    // Header Row with Small Logo + Title
    const headerRow = document.createElement("div");
    headerRow.className = "section-header-row";

    const logoImg = document.createElement("img");
    logoImg.className = "section-logo-small";
    logoImg.src = getLogoForSection(sectionTitle);
    logoImg.alt = sectionTitle;

    const title = document.createElement("h2");
    title.textContent = sectionTitle;

    headerRow.appendChild(logoImg);
    headerRow.appendChild(title);

    sectionContainer.appendChild(headerRow);

    // Logique sous-processus vs plat
    if (showSubProcessus) {
        const subGroups = sectionData.reduce((acc, item) => {
            const sub = item['Sous processus'] || 'Autre';
            if (!acc[sub]) acc[sub] = [];
            acc[sub].push(item);
            return acc;
        }, {});

        for (const [subName, items] of Object.entries(subGroups)) {
            const subContainer = document.createElement('div');
            subContainer.className = 'sous-processus-container';

            if (subName !== 'Autre') {
                const subTitle = document.createElement('h3');
                subTitle.textContent = subName;
                subContainer.appendChild(subTitle);
            }

            const frise = document.createElement('div');
            frise.className = 'frise';

            items.forEach(item => {
                frise.appendChild(createCard(item));
            });

            subContainer.appendChild(frise);
            sectionContainer.appendChild(subContainer);
        }
    } else {
        const frise = document.createElement("div");
        frise.className = "frise";
        sectionData.forEach(item => {
            frise.appendChild(createCard(item));
        });
        sectionContainer.appendChild(frise);
    }

    container.appendChild(sectionContainer);
    attachSectionEvents(sectionContainer);
}

function masquerPdf() {
    const overlay = document.getElementById('pdfOverlay');
    const frame = document.getElementById('pdfFrame');
    overlay.style.display = 'none';
    frame.src = ""; // Stop loading
}

function ouvrirPdf(pdfUrl, page) {
    const overlay = document.getElementById('pdfOverlay');
    const frame = document.getElementById('pdfFrame');
    // Si page est définie, on l'ajoute à l'URL (format navigateur standard #page=X)
    const finalUrl = page ? `${pdfUrl}#page=${page}` : pdfUrl;
    frame.src = finalUrl;
    overlay.style.display = 'flex';
}

function getActorsFromItem(item) {
    if (item.ACTEURS && item.ACTEURS.trim() !== "") {
        return item.ACTEURS;
    }

    // List of potential role columns based on JSON structure
    const roleKeys = [
        "DRO", "CFR", "RLR", "Référent Tech siège", "Pharmacien siège",
        "Directeur pays", "RDD Log", "RDD Technique", "RDD Fin", "CT", "RP",
        "Gestionnaire de stock", "RLog/RAppo", "RFin", "RRH"
    ];

    let actors = [];
    roleKeys.forEach(key => {
        if (item[key]) {
            // Optional: Include the RACI code? e.g. "RLog (R)"
            // For now, just listing the roles for searchability seems safest.
            actors.push(`${key} (${item[key]})`);
        }
    });

    return actors.join(", ");
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'processus';

    const computedActors = getActorsFromItem(item);

    card.dataset.actors = computedActors || '';
    card.dataset.typeControle = item['Type de contrôle'] || '';
    card.dataset.hq = item.HQ ? 'true' : 'false';
    card.dataset.coordination = item.Coordination ? 'true' : 'false';
    card.dataset.base = item.Base ? 'true' : 'false';

    // Popup content building - RESTORED FULL DATA
    let popupHTML = `<h3>${item.Activité}</h3>`;
    popupHTML += `<strong>Objectifs:</strong> ${item.Objectifs || 'N/A'}<br><br>`;

    // Restore Actors
    if (computedActors) popupHTML += `<strong>Acteurs:</strong> ${computedActors}<br>`;

    popupHTML += `<strong>Type de contrôle:</strong> ${item['Type de contrôle'] || 'N/A'}<br>`;

    // Risks / Gaps - restored
    if (item['Gaps de contrôle potentiels ou risques']) {
        popupHTML += `<br><strong>Risques/Gaps:</strong> ${item['Gaps de contrôle potentiels ou risques']}<br>`;
    }

    popupHTML += `<div class="controle-popup">`;
    if (item['Documentés (formel)']) popupHTML += `Documentés: ${item['Documentés (formel)']}<br>`;
    if (item['Opérationnels (informel)']) popupHTML += `Opérationnels: ${item['Opérationnels (informel)']}<br>`;
    if (item.Physique) popupHTML += `Physique: ${item.Physique}<br>`;
    if (item.Automatisés) popupHTML += `Automatisés: ${item.Automatisés}<br>`;
    popupHTML += `</div>`;

    card.dataset.popupContent = popupHTML;

    // Icon handling
    let iconClass = item.Icone || 'fa-cogs';
    if (iconClass.startsWith('fa-')) iconClass = `fas ${iconClass}`;

    // PDF Loupe Handling
    let pdfIconHtml = '';
    // We check if pdfFile exists. Note: use single quotes inside onclick to avoid breaking HTML.
    if (item.pdfFile) {
        // Encode filenames to be safe
        const safePdf = encodeURIComponent(item.pdfFile).replace(/'/g, "%27");
        const page = item.pdfPage || 1;
        // stopPropagation is crucial so it doesn't open the card popup
        pdfIconHtml = `<i class="fas fa-search blue-loupe" title="Voir la procédure" onclick="event.stopPropagation(); ouvrirPdf('${safePdf}', ${page})"></i>`;
    }

    // Inner HTML Structure
    card.innerHTML = `
        <div class="actor-rectangle" style="display:none;"></div>
        ${pdfIconHtml}
        <i class="${iconClass}"></i>
        <div class="card-title">${item.Activité}</div>

        <div class="localisation">
            ${item.HQ ? '<i class="fas fa-building" title="Siège"></i> ' : ''}
            ${item.Coordination ? '<i class="fas fa-map-marker-alt" title="Coordination"></i> ' : ''}
            ${item.Base ? '<i class="fas fa-home" title="Base"></i> ' : ''}
        </div>
    `;

    return card;
}
