package fpoly.datn.ecommerce_website.infrastructure.constant;


import fpoly.datn.ecommerce_website.util.PropertiesReader;
import lombok.Getter;

@Getter
public enum Message {

    SUCCESS("Success"),
    ERROR_UNKNOWN("Error Unknown"),
    USER_NOT_EXISTS(PropertiesReader.getProperty(PropertyKeys.USER_NOT_EXISTS)),
    USER_NOT_ALLOWED(PropertiesReader.getProperty(PropertyKeys.USER_NOT_ALLOWED)),
    INVALID_TOKEN(PropertiesReader.getProperty(PropertyKeys.INVALID_TOKEN)),
    TOKEN_VERIFICATION_FAILED(PropertiesReader.getProperty(PropertyKeys.TOKEN_VERIFICATION_FAILED)),
    EMAIL_EXISTS(PropertiesReader.getProperty(PropertyKeys.EMAIL_EXISTS)),
    EMAIL_OR_PASSWORD_INCORRECT(PropertiesReader.getProperty(PropertyKeys.EMAIL_OR_PASSWORD_INCORRECT));

    private String message;

    Message(String message) {
        this.message = message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
