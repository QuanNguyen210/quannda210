package fpoly.datn.ecommerce_website.dto;

import fpoly.datn.ecommerce_website.entity.Images;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Setter
@Getter
public class TopProductsDTO {
    private List<Images> images;
    private String productCode;
    private String productName;
    private BigDecimal productPrice;
    private BigDecimal totalBillAmount;

}
