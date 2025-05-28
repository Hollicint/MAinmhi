
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('insurancelogin');

    form.addEventListener('Enter', function (event) {
        clicked.preventDefault();
        window.location.href = "/insurance/insurance_profile";
    });    
});