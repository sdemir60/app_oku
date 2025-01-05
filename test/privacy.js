function hideSensitiveData() {

    var indexesToSkip = [2, 5, 6, 9, 12, 20, 24, 30, 33];

    document.querySelectorAll("#dgListem > tbody > tr td:nth-child(1)")
        .forEach(function (td, index) {

            if (index > 0 && !indexesToSkip.includes(index)) {
                td.innerText = "000";
            }

        });

    document.querySelectorAll("#dgListem > tbody > tr td:nth-child(2)")
        .forEach(function (td, index) {

            if (index > 0) {
                td.innerText = "ÖĞRENCİ - " + index;
            }

        });

    document.getElementById("IOMPageHeader1_lblKurumIlIlce").innerText = "İl/İlçe";
    document.getElementById("IOMPageHeader1_lblKisi").innerText = "Sn. OKU";
    document.getElementById("IOMPageHeader1_lblKullaniciAdi").innerText = "OKU.2023";

    document.getElementById("OKLMenu1_ddlHizliOgretimYili").options[0].text = "Öğretim Yılı";
    document.getElementById("ddlSinifiSubesi").options[0].text = "Sınıf/Şube";
    document.getElementById("ddlDersler").options[1].text = "Ders";
    document.getElementById("lblDersAdi").innerText = "Ders";

}