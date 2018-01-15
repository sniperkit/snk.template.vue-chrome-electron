/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Becauseqa.Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

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
