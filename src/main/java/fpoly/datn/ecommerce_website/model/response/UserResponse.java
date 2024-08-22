package fpoly.datn.ecommerce_website.model.response;

import java.sql.Date;
import java.util.UUID;

public interface UserResponse {

    UUID getId();

    String getFullname();

    String getEmail();

    Date getDateofbirth();

    String getPhonenumber();

    Boolean getGender();

    String getAddress();

    Integer getRole();
}
