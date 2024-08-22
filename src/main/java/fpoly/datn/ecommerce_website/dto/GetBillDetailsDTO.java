package fpoly.datn.ecommerce_website.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fpoly.datn.ecommerce_website.entity.Bills;
import fpoly.datn.ecommerce_website.entity.ProductDetails;
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
public class GetBillDetailsDTO {

    private String billDetailId;

    private Bills bills;

    private ProductDetails productDetails;

    private Integer amount;

    private Double price;


    private Integer billDetailStatus;

    private String billDetailNote;
}