/*******************************************************************************
 * Functions for GoFSe
 *
 * Company: GoFSE
 * Website: http://www.gof.com
 * Phone:   0767.666.299
 *******************************************************************************/

// GoFSe API url.
const GoFSe_API_URL = "45.118.134.212"
const Test_Post_URL = "localhost:5083"

namespace esp8266 {
    // Flag to indicate whether the GoFSe message was sent successfully.
    let GoFSeMessageSent = false
    /**
     * Return true if the GoFSe message was sent successfully.
     */
    //% subcategory="API"
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_GoFSe_tests_sent
    //% block="API test sent"
    export function isGoFSeMessageSent(): boolean {
        return GoFSeMessageSent
    }

    /**
     * Send GoFSe message.
     * @param apiKey GoFSe API Key.
     * @param chatId The chat ID we want to send message to.
     */
    //% subcategory="API"
    //% weight=29
    //% blockGap=8
    //% blockId=esp8266_send_GoFSe_message
    //% block="send GET request:|API Key %apiKey|Chat ID %chatId| %message"
    export function callGETrequest(apiKey: string, chatId: number) {
        // Reset the upload successful flag.
        GoFSeMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) {
            return
        }

        // Connect to GoFSe. Return if failed.
        if (sendCommand('AT+CIPSTART=\"TCP\",\"' + Test_Post_URL + '\",8080', "OK", 10000) == false) return
        // let data = "GET /hi?name=" + formatUrl(apiKey) + "&value=" + chatId
        let data = "GET /"

        data += " HTTP/1.1\r\n"
        data += "Host: " + GoFSe_API_URL + "\r\n"
        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from GoFSe.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        GoFSeMessageSent = true
        return
    }


    /**
         * Call POST request.
         * @param sendParam String Param.
         */
    //% subcategory="API"
    //% weight=29
    //% blockGap=8
    //% blockId=func_post_request
    //% block="send POST request:|Param %sendParam|" color=#0fbc11
    export function callPOSTrequest(sendParam: string) {
        // Reset the upload successful flag.
        // GoFSeMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) {
            return
        }

        // Tạo dữ liệu POST
        // let postData = '{/"sendParam/"=' + ''+formatUrl(sendParam) +'}';
        let postData = JSON.stringify({ name:"John", age:"42"});

        // Chuẩn bị yêu cầu POST với body
        let postRequest = "POST /api/Test";
        postRequest += " HTTP/1.1\r\n"
        postRequest += "Host: " + Test_Post_URL + "\r\n";
        postRequest += "Content-Type: application/json\r\n"; 
        postRequest += "Content-Length: 100\r\n";
        postRequest += "\r\n";
        postRequest += postData;

        // Kết nối TCP đến URL
        if (sendCommand('AT+CIPSTART=\"TCP\",\"' + Test_Post_URL, "OK", 10000) == false) return;

        // Gửi yêu cầu POST
        sendCommand("AT+CIPSEND=" + (postRequest.length + 2));
        sendCommand(postRequest);


        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from GoFSe.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        GoFSeMessageSent = true
        return
    }


}