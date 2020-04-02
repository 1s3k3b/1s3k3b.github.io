window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const text = params.get("code") ? atob(params.get("code")) : "You must give base64 encoded HTML code in the <code>code</code> URL parameter";
    document.body.innerHTML = text;
};
