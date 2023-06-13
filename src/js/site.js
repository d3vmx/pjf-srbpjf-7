
window.addEventListener("scroll",
    function (e) {
        var r = document.querySelector(".navbar-sticky");
        if (500 < e.currentTarget.pageYOffset) {
            r.classList.remove("navbar-dark");
            r.classList.add("navbar-light", "navbar-stuck");
        }
        else {
            r.classList.remove("navbar-light", "navbar-stuck");
            r.classList.add("navbar-dark")
        }
    });
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const href = $(this).attr("href");
        $("html, body").animate({ scrollTop: $(href).offset().top }, 800);
    });
});

function Loading() {
    console.log('Loading');
    document.getElementById('loading').style.display = "block";
    return false;
}