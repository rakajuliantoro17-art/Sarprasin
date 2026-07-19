/*
==========================================================
Sarprasin 2.0
Email Notification Service
File : src/services/notification/email.service.js
Version : 2.0.0
==========================================================
*/

import apiService from "../api/api.service.js";

class EmailService {

    constructor() {

        this.endpoint = "/notification/email";

    }

    /* ==========================================
       SEND EMAIL
    ========================================== */

    async send({

        to,

        subject,

        message,

        html = null,

        attachments = []

    }) {

        if (!to) {

            throw new Error("Email tujuan wajib diisi.");

        }

        if (!subject) {

            throw new Error("Subject wajib diisi.");

        }

        return apiService.post(

            this.endpoint,

            {

                to,

                subject,

                message,

                html,

                attachments

            }

        );

    }

    /* ==========================================
       SEND BULK EMAIL
    ========================================== */

    async sendBulk(

        recipients = [],

        subject,

        message

    ) {

        return apiService.post(

            `${this.endpoint}/bulk`,

            {

                recipients,

                subject,

                message

            }

        );

    }

    /* ==========================================
       TEST CONNECTION
    ========================================== */

    async test() {

        return apiService.get(

            `${this.endpoint}/test`

        );

    }

}

const emailService =

    new EmailService();

export default emailService;

export {

    EmailService

};
