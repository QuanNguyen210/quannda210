package fpoly.datn.ecommerce_website.service;

import fpoly.datn.ecommerce_website.entity.Mail;

public interface IMailSendService {
    Boolean notificationCreateCustomer(Mail mail);

    Boolean notificationTest(Mail mail);
}
