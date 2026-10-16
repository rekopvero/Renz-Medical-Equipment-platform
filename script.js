// --- confirmatioN SUCCESS POPUP --- //
function showSuccessPopup(text) {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(10,35,55,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: modalAppear 0.25s ease;">
            <div style="background: white; padding: 30px; border-radius: 16px; text-align: center; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div style="font-size: 45px; color: #1D546C; margin-bottom: 15px;">✓</div>
                <h3 style="color: #1A3D64; font-family: 'Trebuchet MS', sans-serif; margin-bottom: 10px; font-size: 22px;">Success</h3>
                <p style="color: #475569; font-family: 'Trebuchet MS', sans-serif; font-size: 15px; margin-bottom: 25px; line-height: 1.5;">${text}</p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #1D546C; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; transition: 0.2s;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

// --- CUSTOM CHOICE POPUP for the REQUEST A QUOTE, YES OR NO LIVE AI ESTIMATION --- //
function showChoicePopup(title, text, yesText, noText, onYes, onNo) {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="position: fixed; inset: 0; background: rgba(10,35,55,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: modalAppear 0.25s ease;">
            <div style="background: white; padding: 30px; border-radius: 16px; text-align: center; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                <div style="margin-bottom: 15px;">
    <img src="images/ojogsmile.png" alt="Ren AI" style="width: 55px; height: 55px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
</div>
                <h3 style="color: #1A3D64; font-family: 'Trebuchet MS', sans-serif; margin-bottom: 10px; font-size: 22px;">${title}</h3>
                <p style="color: #475569; font-family: 'Trebuchet MS', sans-serif; font-size: 15px; margin-bottom: 25px; line-height: 1.5;">${text}</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="btn-yes" style="background: #0879E8; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; transition: 0.2s;">${yesText}</button>
                    <button id="btn-no" style="background: #E2E8F0; color: #475569; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-family: inherit; transition: 0.2s;">${noText}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
    
    document.getElementById("btn-yes").addEventListener("click", () => {
        popup.remove();
        if(onYes) onYes();
    });
    document.getElementById("btn-no").addEventListener("click", () => {
        popup.remove();
        if(onNo) onNo();
    });
}

// --- MODAL OPEN/CLOSE FUNCTIONS --- //
function openModal(event) {
    event.preventDefault();
    const modal = document.getElementById("autoclaveModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(event) {
    const modal = document.getElementById("autoclaveModal");
    if (!modal) return;
    if (event && event.target !== modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

function openAnesthesiaModal(event) {
    event.preventDefault();
    const modal = document.getElementById("anesthesiaModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeAnesthesiaModal(event) {
    const modal = document.getElementById("anesthesiaModal");
    if (!modal) return;
    if (event && event.target !== modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

function openTableModal(event) {
    event.preventDefault();
    const modal = document.getElementById("tableModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeTableModal(event) {
    const modal = document.getElementById("tableModal");
    if (!modal) return;
    if (event && event.target !== modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

function openCardiacModal(event) {
    event.preventDefault();
    const modal = document.getElementById("cardiacModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeCardiacModal(event) {
    const modal = document.getElementById("cardiacModal");
    if (!modal) return;
    if (event && event.target !== modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

function openDefibModal(event) {
    event.preventDefault();
    const modal = document.getElementById("defibModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeDefibModal(event) {
    const modal = document.getElementById("defibModal");
    if (!modal) return;
    if (event && event.target !== modal) return;
    modal.style.display = "none";
    document.body.style.overflow = "";
}

// --- DATABASE INTEGRATION --- //

// Empty arrays to hold our database data
let autoclaves = [];
let anesthesiaMachines = [];
let orTables = [];
let cardiacMonitors = [];
let defibrillators = [];

// Track current slides
let currentAutoclave = 0;
let currentAnesthesia = 0;
let currentTable = 0;
let currentCardiac = 0;
let currentDefib = 0;

// 2. Fetch data from FastAPI
async function loadEquipmentFromDB() {
    try {
        const response = await fetch("http://localhost:8000/api/equipment");
        const allEquipment = await response.json();

        // ENFORCE TOGGLE: Only keep available items
        const availableEquipment = allEquipment.filter(item => item.is_available === true);

        // Sort into categories
        autoclaves = availableEquipment.filter(item => item.category === "autoclave");
        anesthesiaMachines = availableEquipment.filter(item => item.category === "anesthesia");
        orTables = availableEquipment.filter(item => item.category === "table");
        cardiacMonitors = availableEquipment.filter(item => item.category === "cardiac");
        defibrillators = availableEquipment.filter(item => item.category === "defib");

        // ALWAYS initialize the modals so they can render the "Empty State" if items are missing
        changeAutoclave(0);
        changeAnesthesia(0);
        changeTable(0);
        changeCardiac(0);
        changeDefib(0);

    } catch (error) {
        console.error("Failed to load equipment from database:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadEquipmentFromDB);

// --- MODAL SLIDER FUNCTIONS --- //

function getLetterByIndex(index) {
    return String.fromCharCode(97 + index);
}

function changeAutoclave(direction) {
    const title = document.getElementById("autoclaveModel");
    const desc = document.getElementById("autoclaveDescription");
    const img = document.getElementById("autoclaveImage");
    const img2 = document.getElementById("autoclaveImage2");
    const link = document.getElementById("autoclaveDetailsLink");

    if (autoclaves.length === 0) {
        title.textContent = "CURRENTLY UNAVAILABLE";
        desc.textContent = "THERE IS CURRENTLY NO AVAILABLE EQUIPMENT IN THIS CATEGORY.";
        img.src = "images/unavailable.png"; // Shows your new image
        img.alt = "Unavailable";
        img.style.display = "";             // Keeps the image box visible
        if (img2) img2.style.display = "none";
        link.style.display = "none";
        return;
    }

    img.style.display = ""; 
    link.style.display = ""; 

    currentAutoclave = (currentAutoclave + direction + autoclaves.length) % autoclaves.length;
    const equipment = autoclaves[currentAutoclave];

    title.textContent = equipment.name;
    desc.textContent = equipment.description;
    img.src = equipment.image_url;
    img.alt = equipment.name;
    if (img2) img2.style.display = "none";
    link.href = "view-details.html?item=autoclave-" + getLetterByIndex(currentAutoclave);
}

function changeAnesthesia(direction) {
    const title = document.getElementById("anesthesiaModel");
    const desc = document.getElementById("anesthesiaDescription");
    const imgA = document.getElementById("anesthesia-1");
    const imgB = document.getElementById("anesthesia-2");
    const link = document.getElementById("anesthesiaDetailsLink");

    if (anesthesiaMachines.length === 0) {
        title.textContent = "CURRENTLY UNAVAILABLE";
        desc.textContent = "THERE IS CURRENTLY NO AVAILABLE EQUIPMENT IN THIS CATEGORY.";
        imgA.src = "images/unavailable.png";
        imgA.alt = "Unavailable";
        imgA.style.display = "";
        if (imgB) imgB.style.display = "none";
        link.style.display = "none";
        return;
    }

    imgA.style.display = "";
    link.style.display = "";

    currentAnesthesia = (currentAnesthesia + direction + anesthesiaMachines.length) % anesthesiaMachines.length;
    const equipment = anesthesiaMachines[currentAnesthesia];

    title.textContent = equipment.name;
    desc.textContent = equipment.description;
    imgA.src = equipment.image_url;
    imgA.alt = equipment.name;
    if (imgB) imgB.style.display = "none";
    link.href = "view-details.html?item=anesthesia-" + getLetterByIndex(currentAnesthesia);
}

function changeTable(direction) {
    const title = document.getElementById("tableModel");
    const desc = document.getElementById("tableDescription");
    const img = document.getElementById("tableImage");
    const link = document.getElementById("tableDetailsLink");

    if (orTables.length === 0) {
        title.textContent = "CURRENTLY UNAVAILABLE";
        desc.textContent = "THERE IS CURRENTLY NO AVAILABLE EQUIPMENT IN THIS CATEGORY.";
        img.src = "images/unavailable.png";
        img.alt = "Unavailable";
        img.style.display = "";
        link.style.display = "none";
        return;
    }

    img.style.display = "";
    link.style.display = "";

    currentTable = (currentTable + direction + orTables.length) % orTables.length;
    const equipment = orTables[currentTable];

    title.textContent = equipment.name;
    desc.textContent = equipment.description;
    img.src = equipment.image_url;
    img.alt = equipment.name;
    link.href = "view-details.html?item=table-" + getLetterByIndex(currentTable);
}

function changeCardiac(direction) {
    const title = document.getElementById("cardiacModel");
    const desc = document.getElementById("cardiacDescription");
    const img = document.getElementById("cardiacImage");
    const link = document.getElementById("cardiacDetailsLink");

    if (cardiacMonitors.length === 0) {
        title.textContent = "CURRENTLY UNAVAILABLE";
        desc.textContent = "THERE IS CURRENTLY NO AVAILABLE EQUIPMENT IN THIS CATEGORY.";
        img.src = "images/unavailable.png";
        img.alt = "Unavailable";
        img.style.display = "";
        link.style.display = "none";
        return;
    }

    img.style.display = "";
    link.style.display = "";

    currentCardiac = (currentCardiac + direction + cardiacMonitors.length) % cardiacMonitors.length;
    const equipment = cardiacMonitors[currentCardiac];

    title.textContent = equipment.name;
    desc.textContent = equipment.description;
    img.src = equipment.image_url;
    img.alt = equipment.name;
    link.href = "view-details.html?item=cardiac-" + getLetterByIndex(currentCardiac);
}

function changeDefib(direction) {
    const title = document.getElementById("defibModel");
    const desc = document.getElementById("defibDescription");
    const img = document.getElementById("defibImage");
    const link = document.getElementById("defibDetailsLink");

    if (defibrillators.length === 0) {
        title.textContent = "CURRENTLY UNAVAILABLE";
        desc.textContent = "THERE IS CURRENTLY NO AVAILABLE EQUIPMENT IN THIS CATEGORY.";
        img.src = "images/unavailable.png";
        img.alt = "Unavailable";
        img.style.display = "";
        link.style.display = "none";
        return;
    }

    img.style.display = "";
    link.style.display = "";

    currentDefib = (currentDefib + direction + defibrillators.length) % defibrillators.length;
    const equipment = defibrillators[currentDefib];

    title.textContent = equipment.name;
    desc.textContent = equipment.description;
    img.src = equipment.image_url;
    img.alt = equipment.name;
    link.href = "view-details.html?item=defibrillator-" + getLetterByIndex(currentDefib);
}


// THIS IS Sa FORMS NATIN ANO! FUCKYOU
// --- FORM SUBMISSIONS (SERVICES) --- //
const repairForm = document.querySelector(".repair-form");
if (repairForm) {
    repairForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append("request_type", "Repair");
        formData.append("full_name", document.getElementById("full-name").value);
        formData.append("facility", document.getElementById("facility").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("phone", document.getElementById("phone").value);
        formData.append("equipment_type", document.getElementById("equipment").value);
        formData.append("equipment_model", document.getElementById("model").value);
        formData.append("location", document.getElementById("location").value);
        formData.append("condition_status", document.getElementById("urgency").value);
        formData.append("description", document.getElementById("problem").value);

        const photoInput = document.getElementById("photo");
        if (photoInput.files.length > 0) {
            formData.append("photo", photoInput.files[0]);
        }

        await submitServiceRequest(formData, repairForm);
    });
}

const pmsForm = document.querySelector(".pms-form");
if (pmsForm) {
    pmsForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const formData = new FormData();

        formData.append("request_type", "PMS");
        formData.append("full_name", document.getElementById("pms-name").value);
        formData.append("facility", document.getElementById("pms-facility").value);
        formData.append("email", document.getElementById("pms-email").value);
        formData.append("phone", document.getElementById("pms-phone").value);
        formData.append("equipment_type", document.getElementById("pms-equipment").value);
        formData.append("equipment_model", document.getElementById("pms-model").value);
        formData.append("quantity", document.getElementById("pms-quantity").value);
        formData.append("location", document.getElementById("pms-location").value);
        formData.append("preferred_date", document.getElementById("preferred-date").value);
        formData.append("description", document.getElementById("pms-details").value);

        await submitServiceRequest(formData, pmsForm);
    });
}

const refurbishForm = document.querySelector(".refurbish-form");
if (refurbishForm) {
    refurbishForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const formData = new FormData();

        formData.append("request_type", "Refurbish");
        formData.append("full_name", document.getElementById("ref-name").value);
        formData.append("facility", document.getElementById("ref-facility").value);
        formData.append("email", document.getElementById("ref-email").value);
        formData.append("phone", document.getElementById("ref-phone").value);
        formData.append("equipment_type", document.getElementById("ref-equipment").value);
        formData.append("equipment_model", document.getElementById("ref-model").value);
        formData.append("quantity", document.getElementById("ref-quantity").value);
        formData.append("location", document.getElementById("ref-location").value);
        formData.append("condition_status", document.getElementById("ref-condition").value);
        
        const workNeeded = document.getElementById("ref-work").value;
        const details = document.getElementById("ref-details").value;
        formData.append("description", `WORK NEEDED: ${workNeeded}\n\nDETAILS: ${details}`);

        const photoInput = document.getElementById("ref-photo");
        if (photoInput && photoInput.files.length > 0) {
            formData.append("photo", photoInput.files[0]);
        }

        await submitServiceRequest(formData, refurbishForm);
    });
}

// our Helper function
async function submitServiceRequest(formData, formElement) {
    try {
        const response = await fetch("http://localhost:8000/api/services", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            
            showSuccessPopup("Your service request has been submitted successfully! Our team will review the details and contact you soon.");
            formElement.reset(); 
        } else {
            alert("Something went wrong. Please check your inputs and try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to connect to the server.");
    }
}


// --- AI SUPPORT CHAT UI LOGIC --- //

const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessages = document.getElementById('chat-messages');
const suggestionItems = document.querySelectorAll('.suggestion-item');

if (chatInput && chatSendBtn && chatMessages) {

    // RESET cHATTT BUTTON
    const clearChatBtn = document.getElementById('clear-chat-btn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            sessionStorage.removeItem('renzChatHistory');
            location.reload();
        });
    }
    
    
    let chatHistory = JSON.parse(sessionStorage.getItem('renzChatHistory')) || [];
    
    if (chatHistory.length > 0) {
        const suggestionsCard = document.querySelector('.suggestions-card');
        if (suggestionsCard) suggestionsCard.style.display = 'none';
        
        chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.sender === 'user' ? 'user-message' : 'ai-message');
            messageDiv.innerHTML = `<div class="message-content">${msg.text}</div>`;
            chatMessages.appendChild(messageDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendMessage(sender, text, save = true) {
      
        const cleanText = text.replace(/\*\*/g, '');

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
        messageDiv.innerHTML = `<div class="message-content">${cleanText}</div>`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Save to browser memory
        if (save) {
            chatHistory.push({ sender, text: cleanText });
            sessionStorage.setItem('renzChatHistory', JSON.stringify(chatHistory));
        }
    }

    async function handleUserMessage(messageText) {
        if (!messageText.trim()) return;

        // LOCK THE INPUTS SO USERS CAN'T SPAM
        chatInput.disabled = true;
        chatSendBtn.disabled = true;
        chatInput.placeholder = "Ren is typing...";

        const suggestionsCard = document.querySelector('.suggestions-card');
        if (suggestionsCard) suggestionsCard.style.display = 'none';

        appendMessage('user', messageText);
        chatInput.value = '';

        const typingId = "typing-" + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'ai-message');
        typingDiv.id = typingId;
        typingDiv.innerHTML = `<div class="message-content"><em>Typing...</em></div>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch("http://localhost:8000/api/support/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: messageText,
                    history: chatHistory 
                })
            });
            const data = await response.json();
            
            document.getElementById(typingId).remove();
            appendMessage('ai', data.reply);
            
        } catch (error) {
            document.getElementById(typingId).remove();
            appendMessage('ai', "Sorry, I am having trouble connecting to my servers right now.");
        } finally {
            // ONLY UNLOCKED INPUTS WHEN REN FINISHES
            chatInput.disabled = false;
            chatSendBtn.disabled = false;
            chatInput.placeholder = "You may type your concern here...";
            chatInput.focus();
        }
    }

    // REN AUTO SEND AI QUOTE FROM FORM --- //
    const pendingQuote = sessionStorage.getItem('pendingAiQuote');
    if (pendingQuote) {
        
        sessionStorage.removeItem('pendingAiQuote');
        
        setTimeout(() => {
            handleUserMessage(pendingQuote);
        }, 600);
    }

    chatSendBtn.addEventListener('click', () => handleUserMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserMessage(chatInput.value); });
    
    suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.textContent.replace('>', '').trim();
            handleUserMessage(text);
        });
    });
}


const showcase = document.getElementById("showcase-image");

if (showcase) {
    const showcaseImages = [
        { src: "images/autoclave.png", alt: "Medical Autoclave" },
        { src: "images/anesthesia-1.png", alt: "Anesthesia Machine" },
        { src: "images/table-1.png", alt: "Operating Room Table" },
        { src: "images/cardiac-1.png", alt: "Cardiac Monitor" },
        { src: "images/defib-2.png", alt: "Defibrillator" }
    ];

    let currentImage = 0;

    setInterval(function () {
        showcase.classList.add("fading");

        setTimeout(function () {
            currentImage = (currentImage + 1) % showcaseImages.length;

            showcase.src = showcaseImages[currentImage].src;
            showcase.alt = showcaseImages[currentImage].alt;

            showcase.classList.remove("fading");
        }, 450);

    }, 3000);
}