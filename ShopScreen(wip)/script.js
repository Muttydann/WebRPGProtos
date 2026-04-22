var data = [];

async function buildShop() {
    console.log("Building shop...");

    const navTabs = document.getElementById("nav-tab");
    const tabContent = document.getElementById("nav-tabContent");

    data.forEach(list => {
        console.log(list);
        const newTab = document.createElement("button");
        newTab.classList.add("nav-link");
        newTab.setAttribute("data-bs-toggle", "tab");
        newTab.setAttribute("href", `#${list.name}`);
        newTab.textContent = list.name;
        navTabs.appendChild(newTab);

        const newTabContent = document.createElement("div");
        newTabContent.classList.add("tab-pane");
        newTabContent.setAttribute("id", list.name);
        const itemList = document.createElement("ul");
        itemList.classList.add("item-list");

        for (const item of list.items) {
            const itemElement = document.createElement("li");
            itemElement.setAttribute("tabindex", "0");
            itemElement.addEventListener("click", () => displayItemDetails(item));

            const itemName = document.createElement("p");
            itemName.classList.add("item-name");
            itemName.textContent = item.name;
            const itemPrice = document.createElement("p");
            itemPrice.classList.add("item-price");
            itemPrice.textContent = `${item.price}G`;
            itemElement.appendChild(itemName);
            itemElement.appendChild(itemPrice);
            itemList.appendChild(itemElement);
        }

        newTabContent.appendChild(itemList);
        tabContent.appendChild(newTabContent);

    });

    document.getElementsByClassName("nav-link")[0].classList.add("active");
    document.getElementsByClassName("tab-pane")[0].classList.add("show", "active");
}

function displayItemDetails(item) {
    console.log("Displaying item details for:", item.name);
    const displayContainer = document.getElementById("display-col");
    while(displayContainer.firstChild) {
        displayContainer.removeChild(displayContainer.firstChild);
    }

    const itemName = document.createElement("h2");
    itemName.classList.add("item-detail-name");
    itemName.textContent = item.name;

    const itemDescription = document.createElement("p");
    itemDescription.classList.add("item-description");
    itemDescription.textContent = item.description;

    displayContainer.appendChild(itemName);
    displayContainer.appendChild(itemDescription);

    if(item.attributes) {
        for (const [key, value] of Object.entries(item.attributes)) {
            const attributeElement = document.createElement("p");
            attributeElement.classList.add("item-attribute");
            attributeElement.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
            displayContainer.appendChild(attributeElement);
        }
    }
}

async function getData() {
    const response = await fetch("parseJson.php")
    data = await response.json();
    
    console.log("Data received from server:", data);
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Document loaded, building shop...");
    await getData();
    buildShop();
});