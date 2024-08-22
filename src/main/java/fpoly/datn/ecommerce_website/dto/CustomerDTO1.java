package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import fpoly.datn.ecommerce_website.infrastructure.constant.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Setter
@Getter
public class CustomerDTO1 {

    private String customerId;
    private String staffCode;

    private Integer customerStatus;

    private Integer consumePoints;

    private Integer rankingPoints;

    private Ranking customerRanking;
    @NotBlank
    private String usersFullName;
    @NotBlank
    private String usersAccount;
    @NotBlank
    private String usersPassword;
    @NotBlank
    private String usersPhoneNumber;
    @NotBlank
    private String usersEmail;
    @NotBlank
    private String usersAddress;
    @NotBlank
    private Integer userStatus;
    @NotBlank
    private Boolean usersGender;

    private String usersUserNote;
    @NotBlank
    private Role role;

}
