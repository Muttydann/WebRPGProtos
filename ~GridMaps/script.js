async function generateVersionCards() {
    const response = await fetch('tbbmanifest.php');
    const files = await response.json();
    console.log("Parsed manifest data:", files);
    const directory = document.getElementById('directory');

    if (!directory) {
        return;
    }

    files.forEach(file => {
        const cont = document.createElement('div');
        cont.classList.add('card', 'mb-3');

        const img = document.createElement('img');
        img.src = file.thumb ? file.thumb : '../src/no-image.png';
        img.classList.add('card-img-top');
        cont.appendChild(img);

        const body = document.createElement('div');
        body.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = file.name;
        body.appendChild(title);

        const dateC = document.createElement('p');
        dateC.classList.add('card-date');
        dateC.textContent = `Created: ${file.createdDate}`;
        dateC.style.fontStyle = 'italic';
        body.appendChild(dateC);

        const dateE = document.createElement('p');
        dateE.classList.add('card-date');
        dateE.textContent = `Last Edited: ${file.editedDate}`;
        dateE.style.fontStyle = 'italic';
        body.appendChild(dateE);
        
        const descCont = document.createElement('div');
        descCont.classList.add('card-desc-box');
        const desc = document.createElement('p');
        desc.classList.add('card-text');
        desc.textContent = file.desc ?? "";
        descCont.appendChild(desc);
        body.appendChild(descCont);
        

        const link = document.createElement('a');
        link.href = file.path;
        link.classList.add('btn', 'btn-primary', 'view-project-btn');
        link.textContent = 'View Project';
        body.appendChild(link);

        cont.appendChild(body);
        directory.appendChild(cont);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    generateVersionCards();
});