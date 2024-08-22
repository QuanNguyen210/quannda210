package fpoly.datn.ecommerce_website.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import fpoly.datn.ecommerce_website.entity.Customers;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartDTO {

    private String cartId;

    private String cartCode;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    private LocalDateTime cartCreatTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    private LocalDateTime cartPaymentTime;

    private String cartNote;

    private Integer cartStatus;

    private Customers customers;

}
