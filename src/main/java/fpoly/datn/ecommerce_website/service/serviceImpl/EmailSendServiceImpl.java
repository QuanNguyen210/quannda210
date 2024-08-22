package fpoly.datn.ecommerce_website.service.serviceImpl;

import fpoly.datn.ecommerce_website.entity.Mail;
import fpoly.datn.ecommerce_website.service.IMailSendService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSendServiceImpl implements IMailSendService {

    @Autowired
    private JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;
    @Override
    public Boolean notificationCreateCustomer(Mail mail) {
     try {
         MimeMessage mimeMessage = javaMailSender.createMimeMessage();
         MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false);

         mimeMessageHelper.setFrom(fromEmail);
         mimeMessageHelper.setTo(mail.getEmail());

         mimeMessageHelper.setSubject(mail.getSubject());
         mimeMessageHelper.setText(mail.getContent());
         javaMailSender.send(mimeMessage);
     }catch (Exception e){
         throw new RuntimeException(e);
     }
        return true;
    }

    @Override
    public Boolean notificationTest(Mail mail) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true,"UTF-8");

            mimeMessageHelper.setFrom(fromEmail);
            mimeMessageHelper.setTo(mail.getEmail());

            mimeMessageHelper.setSubject(mail.getSubject());
            mimeMessageHelper.setText(mail.getContent(),true);
            javaMailSender.send(mimeMessage);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
        return true;
    }
}
