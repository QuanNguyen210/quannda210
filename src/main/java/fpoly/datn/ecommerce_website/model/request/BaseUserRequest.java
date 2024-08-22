package fpoly.datn.ecommerce_website.model.request;


import fpoly.datn.ecommerce_website.infrastructure.constant.Constants;
import fpoly.datn.ecommerce_website.infrastructure.constant.EntityProperties;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class BaseUserRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    @Length(max = EntityProperties.LENGTH_NAME)
    private String fullName;


    @Length(max = EntityProperties.LENGTH_EMAIL)
    @Email(message = "Email không đúng định dạng")
    private String email;


    private String dateOfBirth;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Length(max = EntityProperties.LENGTH_PASSWORD_SHORT, message = "Mật khẩu không vượt quá 30 ký tự")
    private String password;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Length(max = EntityProperties.LENGTH_PHONE)
    @Pattern(regexp = Constants.REGEX_PHONE_NUMBER)
    private String phoneNumber;

    @NotNull
    private Boolean gender;


    @Length(max = EntityProperties.LENGTH_ADDRESS)
    private String address;

    @NotNull
    private Role role;
}
