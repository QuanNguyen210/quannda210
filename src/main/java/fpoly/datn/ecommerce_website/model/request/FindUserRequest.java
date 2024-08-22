package fpoly.datn.ecommerce_website.model.request;

import fpoly.datn.ecommerce_website.entity.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindUserRequest extends PageableRequest {

    private String fullName;

    private String email;

    private String phoneNumber;

    private String address;

    private Boolean gender;

}
