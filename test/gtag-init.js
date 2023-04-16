/*

gtag "event" direktifi bir etkinlik gönderir. Birden fazla mülk için birden fazla "config" yönergesinin bulunduğu snippet'lerde etkinlik tüm mülklere gönderilir.

Örneğin; gtag('event', 'sign_up', { 'method': 'email' });

Bu örnekte, "sign_up" parametresi etkinlik adıdır. Son parametre, bir dizi etkinlik parametresi içeren bir nesnedir. Bu durumda, "method", "email" değerine sahip bir parametredir.

Google Analytics > DebugView testi için,

* {'debug_mode': true} olarak ayarlanmalı.
* https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna eklenti kurulmalı ve açık moduna getirilmeli.

*/

window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

gtag('config', 'G-83W18N5K0V', {'debug_mode': true});