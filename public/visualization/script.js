const getParams = async () => {
    const parts = window.location.pathname.split('/');
    const hash = parts[parts.length-1];
    const res = await fetch(`../${hash}`);
    const json = await res.json();
    const nameelement = document.querySelector('#name');
    const imgelement = document.querySelector('#img');
    const tnelement = document.querySelector('#thumbnail');
    const idelement = document.querySelector('#id');
    const bioelement = document.querySelector('#bio');
    nameelement.textContent = json.name;
    imgelement.src = json.image.url;
    idelement.textContent = `ID: ${json.id}`;
    bioelement.textContent = json.bio;
    tnelement.src = json.image.thumbnailUrl;
}