package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.entity.Users;
import fpoly.datn.ecommerce_website.infrastructure.constant.Ranking;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CustomerDTO {

    private String customerId;
    private String customerCode;
    private Integer customerStatus;
    private Integer consumePoints;
    private Integer rankingPoints;
    private Ranking customerRanking;


    private Users users;


}
