package fpoly.datn.ecommerce_website.restController;

import fpoly.datn.ecommerce_website.entity.Mail;
import fpoly.datn.ecommerce_website.service.IMailSendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MailContronller {
    @Autowired
    private IMailSendService iMailSendService;
    @RequestMapping(value = "/send-mail", method = RequestMethod.POST)
    public ResponseEntity<?> notificationCreateCustomer(
            @RequestBody Mail mail) {
      Boolean isSuccess =  iMailSendService.notificationCreateCustomer(mail);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }
    @RequestMapping(value = "/send-mail-test", method = RequestMethod.POST)
    public ResponseEntity<?> sendMailTest(
            @RequestBody Mail mail) {
        Boolean isSuccess =  iMailSendService.notificationTest(mail);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }
}
