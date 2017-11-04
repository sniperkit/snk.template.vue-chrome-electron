// Get internal local ip address from browser
/*
 see stackoverflow:
 https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only
*/
const getPrivateIP = function () {
    var privateIP = new Promise((resolve, reject) => {
        let w = window
        let a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({iceServers: []})
        let b = () => {
        }
        a.createDataChannel('')
        a.createOffer(c => a.setLocalDescription(c, b, b), b)
        a.onicecandidate = c => {
            try {
                c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(resolve)
            } catch (e) {
            }
        }
    })
    return privateIP
}
/*
See page in stackoverflow for vue:
https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only
1. https://ip-api.io/json/ 2500 requests per 24 hours
2. https://freegeoip.net/json/ 10,000 requests per hour
3. http://ip-api.com/json   150 requests per minute
4. https://ipfind.co/me?auth=e9cc0d7c-7015-44f4-ae6c-61d5c324aa50   300/day
*/
const getLocationInfo = function () {
    const url = 'https://freegeoip.net/json/'
    let resultData = ''
    this.$http.get(url)
        .then((response) => {
            resultData = response.data
        }).catch((error) => {
        if (error) {
            console.log(error.stack)
        }
    })
    return resultData
}

export default getLocationInfo