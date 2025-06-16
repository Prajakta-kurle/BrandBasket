const paypal = require('paypal-rest-sdk')

paypal.configure({
 mode : 'sandbox',
 client_id : 
 "AWeECVc4zCPt1QeVtEVNqEyAzFHSaE7phgaYVNBc03l22c9wnx65h04u2fVFyoB-XjrMctx4Yb1ouSc0",
 client_secret:
 "EFTNUrlXgewWxEBXgK-h-ExfH2j_KV3sEZ5bdDjMQOB6xRcwp6QWToFN2pL39ZiUG9yj-RI6lBaECV8B"
});

module.exports = paypal;